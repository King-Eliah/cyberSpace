import { generateWithClaude } from "./claude";
import type { Event, User, LinkedInVariant, PreEventBrief } from "@/types";

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

Return ONLY valid JSON with this structure:
{
  "variants": [
    {
      "label": "Reflective",
      "hook": "The first line only",
      "content": "The full post text"
    },
    {
      "label": "Technical",
      "hook": "The first line only",
      "content": "The full post text"
    },
    {
      "label": "Network-focused",
      "hook": "The first line only",
      "content": "The full post text"
    }
  ]
}`;

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

  const { content, tokensUsed } = await generateWithClaude(
    systemPrompt,
    userPrompt,
    2000
  );

  const parsed = JSON.parse(content);
  return { variants: parsed.variants, tokensUsed };
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

Return ONLY valid JSON with this structure:
{
  "whatToExpect": "2-3 sentences on the realistic vibe, format, and crowd",
  "conversationStarters": ["starter 1", "starter 2", "starter 3"],
  "whatToBring": ["item 1", "item 2", "item 3"],
  "networkingTip": "One specific, actionable networking tip for this exact type of event",
  "mindsetPrimer": "One sentence to set the right frame of mind going in"
}`;

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

  const { content, tokensUsed } = await generateWithClaude(
    systemPrompt,
    userPrompt,
    1000
  );

  const parsed = JSON.parse(content);
  return { brief: parsed, tokensUsed };
}
