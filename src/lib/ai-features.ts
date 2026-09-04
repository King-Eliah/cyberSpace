import { Type, type Schema } from "@google/genai";
import { generateJson, AiFormatError } from "./gemini";
import type { Event, User, LinkedInVariant, PreEventBrief } from "@/types";

const linkedInSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    variants: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          label: { type: Type.STRING },
          hook: { type: Type.STRING, description: "The first line only" },
          content: { type: Type.STRING, description: "The full post text" },
        },
        required: ["label", "hook", "content"],
        propertyOrdering: ["label", "hook", "content"],
      },
    },
  },
  required: ["variants"],
};

const briefSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    whatToExpect: {
      type: Type.STRING,
      description: "2-3 sentences on the realistic vibe, format, and crowd",
    },
    conversationStarters: { type: Type.ARRAY, items: { type: Type.STRING } },
    whatToBring: { type: Type.ARRAY, items: { type: Type.STRING } },
    networkingTip: {
      type: Type.STRING,
      description: "One specific, actionable tip for this exact type of event",
    },
    mindsetPrimer: {
      type: Type.STRING,
      description: "One sentence to set the right frame of mind going in",
    },
  },
  required: [
    "whatToExpect",
    "conversationStarters",
    "whatToBring",
    "networkingTip",
    "mindsetPrimer",
  ],
  propertyOrdering: [
    "whatToExpect",
    "conversationStarters",
    "whatToBring",
    "networkingTip",
    "mindsetPrimer",
  ],
};

export async function generateLinkedInPost(
  event: Event,
  user: Partial<User>,
  takeaways: string
): Promise<{ variants: LinkedInVariant[]; tokensUsed: number }> {
  const systemPrompt = `You are a voice coach helping KNUST students write LinkedIn posts that sound like real people, not press releases.

STRICT RULES:
- Sound like a real KNUST student from Kumasi, Ghana — smart, ambitious, grounded
- BANNED phrases: "excited to share", "humbled", "game-changing", "honored to", "blessed to", "privileged to", "thrilled"
- Maximum 2 emojis per post
- The hook (first line) must NOT start with "I attended"
- Each post: 150–250 words
- Write in first person, conversational, specific
- Reference the KNUST/Ghana context when relevant
- Focus on what was learned, who was met, or what problem was clarified

Return exactly 3 variants, labelled "Reflective", "Technical", and "Network-focused".`;

  const userPrompt = `Event: ${event.title}
Organizer: ${event.organizer}
Category: ${event.category}
Date: ${new Date(event.startsAt).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
${event.location ? `Location: ${event.location}` : "Online event"}

Student: ${user.name || "KNUST Student"}
College: ${user.college || "KNUST"}
${user.program ? `Program: ${user.program}` : ""}

My takeaways from this event:
${takeaways}

Generate 3 LinkedIn post variants based on my takeaways. Make each one feel like I wrote it myself.`;

  const { data, tokensUsed } = await generateJson<{ variants: LinkedInVariant[] }>({
    systemPrompt,
    userPrompt,
    schema: linkedInSchema,
    maxOutputTokens: 2000,
  });

  if (!Array.isArray(data.variants) || data.variants.length === 0) {
    throw new AiFormatError("Model returned no post variants", JSON.stringify(data).slice(0, 500));
  }

  return { variants: data.variants, tokensUsed };
}

export async function generatePreEventBrief(
  event: Event,
  user: Partial<User>
): Promise<{ brief: PreEventBrief; tokensUsed: number }> {
  const systemPrompt = `You are a sharp senior KNUST student who has attended 50+ events on campus and in Accra. You give brutally useful advice — no fluff, no generic tips.

Your briefs are culturally grounded for KNUST/Ghana:
- Reference real Kumasi/KNUST context
- Know that Ghanaian networking culture is warm but hierarchical
- Understand the KNUST student hustle — time is tight, resources are limited, every event is an investment

Give exactly 3 conversation starters and 3 things to bring.`;

  const userPrompt = `Event: ${event.title}
Organizer: ${event.organizer}
Category: ${event.category}
Date: ${new Date(event.startsAt).toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
Time: ${new Date(event.startsAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}
${event.location ? `Location: ${event.location}` : "Online"}
${event.isOnline ? "Format: Virtual" : "Format: In-person"}
Description: ${event.description.slice(0, 500)}

Student background:
College: ${user.college || "KNUST"}
${user.program ? `Program: ${user.program}` : ""}
${user.yearOfStudy ? `Year: ${user.yearOfStudy}` : ""}
${user.interests?.length ? `Interests: ${user.interests.join(", ")}` : ""}

Give me a sharp pre-event brief.`;

  const { data, tokensUsed } = await generateJson<PreEventBrief>({
    systemPrompt,
    userPrompt,
    schema: briefSchema,
    maxOutputTokens: 1200,
  });

  if (!data.whatToExpect) {
    throw new AiFormatError("Model returned an incomplete brief", JSON.stringify(data).slice(0, 500));
  }

  return { brief: data, tokensUsed };
}
