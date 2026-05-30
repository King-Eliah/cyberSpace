import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY ?? "" });

export async function generateWithClaude(
  systemPrompt: string,
  userPrompt: string,
  maxTokens = 1500
): Promise<{ content: string; tokensUsed: number }> {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const content = response.choices[0]?.message?.content ?? "";
  return { content, tokensUsed: 0 };
}
