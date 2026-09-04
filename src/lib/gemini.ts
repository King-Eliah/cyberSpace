import { GoogleGenAI, ThinkingLevel, type Schema } from "@google/genai";

// gemini-2.5-flash is retired for new API keys; 3.6-flash is Google's replacement.
const MODEL = process.env.GEMINI_MODEL ?? "gemini-3.6-flash";

// Generation is slow and variable (roughly 5–35s). Fail before the platform
// kills the function so the client gets a real error instead of a dead socket.
const TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS ?? 45_000);

/** The model is unreachable, unconfigured, or timed out. Retryable. */
export class AiUnavailableError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = "AiUnavailableError";
  }
}

/** The model responded, but not with JSON matching the schema. Not retryable as-is. */
export class AiFormatError extends Error {
  constructor(message: string, readonly raw: string) {
    super(message);
    this.name = "AiFormatError";
  }
}

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new AiUnavailableError("GOOGLE_AI_API_KEY is not set");
  }
  client ??= new GoogleGenAI({ apiKey });
  return client;
}

interface GenerateJsonOptions {
  systemPrompt: string;
  userPrompt: string;
  schema: Schema;
  maxOutputTokens?: number;
}

/**
 * Ask Gemini for JSON matching `schema` and parse it.
 *
 * responseSchema constrains decoding, so the model cannot wrap the payload in
 * prose or a markdown fence — but we still guard the parse, because a truncated
 * response (MAX_TOKENS) is valid JSON's problem, not the schema's.
 */
export async function generateJson<T>({
  systemPrompt,
  userPrompt,
  schema,
  maxOutputTokens = 2000,
}: GenerateJsonOptions): Promise<{ data: T; tokensUsed: number }> {
  const ai = getClient();

  let response;
  try {
    response = await ai.models.generateContent({
      model: MODEL,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: schema,
        maxOutputTokens,
        // These prompts don't need deliberation. LOW drops thinking tokens
        // entirely — measured 1398 -> 433 total tokens on the same prompt.
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        abortSignal: AbortSignal.timeout(TIMEOUT_MS),
      },
    });
  } catch (error) {
    throw new AiUnavailableError(
      error instanceof Error ? error.message : "Gemini request failed",
      { cause: error }
    );
  }

  const finishReason = response.candidates?.[0]?.finishReason;
  if (finishReason === "MAX_TOKENS") {
    throw new AiFormatError("Model output was cut off before it finished", "");
  }

  const text = response.text ?? "";
  if (!text.trim()) {
    throw new AiFormatError(`Model returned no content (finish: ${finishReason})`, "");
  }

  let data: T;
  try {
    data = JSON.parse(text) as T;
  } catch {
    throw new AiFormatError("Model did not return valid JSON", text.slice(0, 500));
  }

  return { data, tokensUsed: response.usageMetadata?.totalTokenCount ?? 0 };
}
