/**
 * Smoke test for the Gemini AI features. Hits the real API.
 * Run: npx tsx scripts/ai-smoke.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config({ path: ".env" });

import { generateLinkedInPost, generatePreEventBrief } from "../src/lib/ai-features";
import type { Event, User } from "../src/types";

const event = {
  id: "smoke",
  title: "KNUST AI & Robotics Hackathon",
  description: "48 hours building applied AI projects with mentors from Accra tech companies.",
  startsAt: new Date(Date.now() + 7 * 864e5),
  endsAt: null,
  location: "College of Engineering, KNUST",
  isOnline: false,
  category: "HACKATHON",
  tags: ["ai"],
  targetColleges: ["COE"],
  organizer: "KNUST Robotics Club",
  coverImageUrl: null,
  requiresApplication: false,
  applicationUrl: null,
  applicationDeadline: null,
  status: "APPROVED",
  source: "manual",
  sourceUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
} as Event;

const user: Partial<User> = {
  name: "Kwame Mensah",
  college: "COE",
  program: "Computer Engineering",
  yearOfStudy: 3,
  interests: ["AI", "backend"],
};

async function main() {
  console.log("--- generateLinkedInPost ---");
  let t = Date.now();
  const post = await generateLinkedInPost(
    event,
    user,
    "I learned that RAG quality is mostly retrieval quality, not the model. Met two engineers from a fintech in Accra."
  );
  console.log(`ok in ${Date.now() - t}ms | tokensUsed=${post.tokensUsed} | variants=${post.variants.length}`);
  post.variants.forEach((v) => console.log(`  [${v.label}] ${v.hook.slice(0, 80)}`));

  console.log("\n--- generatePreEventBrief ---");
  t = Date.now();
  const brief = await generatePreEventBrief(event, user);
  console.log(`ok in ${Date.now() - t}ms | tokensUsed=${brief.tokensUsed}`);
  console.log("  whatToExpect:", brief.brief.whatToExpect.slice(0, 110));
  console.log("  starters:", brief.brief.conversationStarters.length);
  console.log("  bring:", brief.brief.whatToBring.length);
  console.log("  mindset:", brief.brief.mindsetPrimer.slice(0, 90));
}

main().catch((e) => {
  console.error("FAILED:", e.name, "-", e.message);
  process.exit(1);
});
