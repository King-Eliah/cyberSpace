/**
 * scripts/seed-data.ts
 * ─────────────────────────────────────────────────────────────
 * Pulls real and realistic events + internships relevant to
 * KNUST students in Kumasi / Ghana, then writes them to:
 *   - prisma/seed-events.json
 *   - prisma/seed-internships.json
 *
 * Sources used (no login required, public data):
 *   - Eventbrite public API (Ghana events)
 *   - Luma public event pages (GDG Accra, MEST, etc.)
 *   - Static curated list of known recurring KNUST/Ghana tech events
 *   - Known Ghana tech companies for internships
 *
 * Run: npx tsx scripts/seed-data.ts
 * Then: npx prisma db seed
 */

import fs from "fs";
import path from "path";

// ─── Types ───────────────────────────────────────────────────────────────────

type SeedEvent = {
  title: string;
  description: string;
  startsAt: string;
  endsAt?: string;
  location: string;
  isOnline: boolean;
  category: string;
  tags: string[];
  targetColleges: string[];
  organizer: string;
  coverImageUrl?: string;
  requiresApplication: boolean;
  applicationUrl?: string;
  applicationDeadline?: string;
  source: string;
  sourceUrl?: string;
};

type SeedInternship = {
  title: string;
  company: string;
  description: string;
  location: string;
  isRemote: boolean;
  isPaid: boolean;
  stipendRange?: string;
  applicationUrl: string;
  applicationDeadline?: string;
  tags: string[];
  experienceLevel: string;
  source: string;
};

// ─── Step 1: Eventbrite public search ────────────────────────────────────────

async function fetchEventbriteGhana(): Promise<SeedEvent[]> {
  console.log("📡 Fetching Eventbrite Ghana events...");

  const url =
    "https://www.eventbriteapi.com/v3/events/search/?location.address=Ghana&q=tech+student+workshop+hackathon&expand=venue,organizer&sort_by=date";

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.EVENTBRITE_API_KEY ?? ""}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.log("  ⚠️  Eventbrite unavailable (no key or rate limited). Using curated data.");
      return [];
    }

    const data = await res.json();
    const events: SeedEvent[] = [];

    for (const event of ((data.events as Record<string, unknown>[]) ?? []).slice(0, 5)) {
      const name = event.name as Record<string, string> | undefined;
      const description = event.description as Record<string, string> | undefined;
      const start = event.start as Record<string, string> | undefined;
      const end = event.end as Record<string, string> | undefined;
      const venue = event.venue as Record<string, Record<string, string>> | undefined;
      const organizer = event.organizer as Record<string, string> | undefined;

      events.push({
        title: name?.text ?? "Untitled Event",
        description: description?.text ?? "",
        startsAt: start?.utc ?? new Date().toISOString(),
        endsAt: end?.utc,
        location: venue?.address?.localized_address_display ?? "Ghana",
        isOnline: (event.online_event as boolean) ?? false,
        category: "OTHER",
        tags: ["eventbrite", "ghana"],
        targetColleges: ["OTHER"],
        organizer: organizer?.name ?? "Unknown",
        requiresApplication: false,
        applicationUrl: event.url as string | undefined,
        source: "eventbrite",
        sourceUrl: event.url as string | undefined,
      });
    }

    console.log(`  ✅ Got ${events.length} events from Eventbrite`);
    return events;
  } catch {
    console.log("  ⚠️  Eventbrite fetch failed. Skipping.");
    return [];
  }
}

// ─── Step 2: Luma public API ──────────────────────────────────────────────────

async function fetchLumaGhana(): Promise<SeedEvent[]> {
  console.log("📡 Fetching Luma events (GDG Accra, MEST, GDG Kumasi)...");

  const LUMA_CALENDARS = [
    { slug: "gdg-accra", organizer: "GDG Accra" },
    { slug: "mest-africa", organizer: "MEST Africa" },
    { slug: "gdg-kumasi", organizer: "GDG Kumasi" },
  ];

  const events: SeedEvent[] = [];

  for (const cal of LUMA_CALENDARS) {
    try {
      const res = await fetch(
        `https://api.lu.ma/public/v1/calendar/get-items?calendar_api_id=${cal.slug}`,
        { headers: { Accept: "application/json" } }
      );

      if (!res.ok) continue;

      const data = await res.json();
      const items = (data.entries as Record<string, unknown>[]) ?? [];

      for (const item of items.slice(0, 3)) {
        const ev = item.event as Record<string, unknown> | undefined;
        if (!ev) continue;

        const geo = ev.geo_address_info as Record<string, string> | undefined;

        events.push({
          title: (ev.name as string) ?? "Untitled",
          description: (ev.description as string) ?? "",
          startsAt: (ev.start_at as string) ?? new Date().toISOString(),
          endsAt: ev.end_at as string | undefined,
          location: geo?.full_address ?? "Accra, Ghana",
          isOnline: ev.geo_latitude == null,
          category: categorizeLuma((ev.name as string) ?? ""),
          tags: extractTags(((ev.name as string) ?? "") + " " + ((ev.description as string) ?? "")),
          targetColleges: ["COE", "COS"],
          organizer: cal.organizer,
          requiresApplication: false,
          applicationUrl: `https://lu.ma/${ev.api_id as string}`,
          source: "luma",
          sourceUrl: `https://lu.ma/${ev.api_id as string}`,
        });
      }
    } catch {
      // Each calendar is optional — silent fail
    }
  }

  console.log(`  ✅ Got ${events.length} events from Luma`);
  return events;
}

// ─── Step 3: Curated KNUST/Ghana events ──────────────────────────────────────

function getCuratedEvents(): SeedEvent[] {
  console.log("📋 Loading curated KNUST/Ghana events...");

  const now = new Date();
  const inWeeks = (n: number): string => {
    const d = new Date(now);
    d.setDate(d.getDate() + n * 7);
    return d.toISOString();
  };

  const events: SeedEvent[] = [
    {
      title: "GDG Kumasi DevFest 2025",
      description:
        "DevFest is Google Developer Groups' annual flagship event — a day of talks, workshops, and networking covering Android, Web, AI/ML, and Cloud. KNUST students get priority registration. Expect speakers from Google, local startups, and senior engineers across Ghana. This is the biggest tech event in Kumasi. Dress smart, bring your laptop, and come ready to connect.",
      startsAt: inWeeks(3),
      endsAt: inWeeks(3),
      location: "Great Hall, KNUST, Kumasi",
      isOnline: false,
      category: "CONFERENCE",
      tags: ["Google", "Android", "AI", "Web", "free", "certificate"],
      targetColleges: ["COE", "COS", "OTHER"],
      organizer: "GDG Kumasi",
      requiresApplication: false,
      applicationUrl: "https://gdg.community.dev/gdg-kumasi/",
      source: "curated",
      sourceUrl: "https://gdg.community.dev/gdg-kumasi/",
    },
    {
      title: "IEEE KNUST Student Branch — Tech Talk: AI in Healthcare",
      description:
        "Monthly IEEE tech talk series. This edition: how machine learning is being deployed in Ghanaian hospitals, diagnostics startups, and telemedicine. Speaker from Helios Health and a PhD researcher from KNUST College of Health Sciences. Open to all students, no IEEE membership required. Free snacks provided.",
      startsAt: inWeeks(1),
      endsAt: inWeeks(1),
      location: "Electrical Engineering LT1, KNUST",
      isOnline: false,
      category: "TALK",
      tags: ["AI", "healthcare", "IEEE", "free", "ML"],
      targetColleges: ["COE", "COS", "COHS"],
      organizer: "IEEE KNUST Student Branch",
      requiresApplication: false,
      source: "curated",
    },
    {
      title: "AIESEC KNUST — Global Volunteer Info Session",
      description:
        "Thinking about a global experience? AIESEC offers 6-week international volunteering programs in 120+ countries. This info session covers how to apply, what projects are available (education, environment, tech), and how past KNUST students found it. Also covers how to fund the program. All colleges welcome.",
      startsAt: inWeeks(2),
      location: "KSB Lecture Theatre B, KNUST",
      isOnline: false,
      category: "NETWORKING",
      tags: ["AIESEC", "international", "volunteer", "career", "free"],
      targetColleges: ["COE", "COS", "KSB", "COA", "COAS"],
      organizer: "AIESEC KNUST",
      requiresApplication: false,
      source: "curated",
    },
    {
      title: "KNUST SRC Career & Internship Fair 2025",
      description:
        "The biggest on-campus recruitment event of the year. 40+ companies including Vodafone Ghana, MTN, Hubtel, Ecobank, Deloitte Ghana, PwC, and several growing startups will be recruiting for internships and graduate roles. Bring printed CVs (minimum 10 copies). Dress formally. The fair runs 9am–4pm — come early for the least crowded halls.",
      startsAt: inWeeks(4),
      endsAt: inWeeks(4),
      location: "Recreation Centre, KNUST, Kumasi",
      isOnline: false,
      category: "CAREER_FAIR",
      tags: ["career", "internship", "recruitment", "corporate", "CV", "Vodafone", "MTN", "Hubtel"],
      targetColleges: ["COE", "COS", "KSB", "COHS", "COA", "COAS"],
      organizer: "KNUST SRC",
      requiresApplication: false,
      source: "curated",
    },
    {
      title: "MEST Africa Entrepreneurship Workshop — Kumasi Edition",
      description:
        "MEST (Meltwater Entrepreneurial School of Technology) runs quarterly workshops for aspiring tech entrepreneurs in Ghana. This Kumasi edition covers: validating a startup idea in 48 hours, pitching to investors, and navigating the Ghana tech ecosystem. 30 spots available. Application required — essay question: describe a problem you'd solve with technology.",
      startsAt: inWeeks(5),
      location: "KNUST School of Business, Room 204",
      isOnline: false,
      category: "WORKSHOP",
      tags: ["startup", "entrepreneurship", "MEST", "pitch", "application required"],
      targetColleges: ["KSB", "COE", "COS"],
      organizer: "MEST Africa",
      requiresApplication: true,
      applicationUrl: "https://meltwater.org/mest",
      applicationDeadline: inWeeks(3),
      source: "curated",
      sourceUrl: "https://meltwater.org/mest",
    },
    {
      title: "HackKNUST 2025 — 36hr Hackathon",
      description:
        "KNUST's flagship student-run hackathon. Theme: 'Technology for Local Communities'. Build anything that solves a real problem in Kumasi or Ghana broadly. Teams of 2-4. Prizes: GHS 5,000 first place, GHS 2,500 second, GHS 1,000 third. Mentors from local startups available throughout. Meals and accommodation provided for the 36 hours. Register as a team or solo (we'll help you find teammates).",
      startsAt: inWeeks(6),
      endsAt: inWeeks(6),
      location: "Computer Science Building, KNUST",
      isOnline: false,
      category: "HACKATHON",
      tags: ["hackathon", "prizes", "GHS5000", "teams", "overnight", "mentors"],
      targetColleges: ["COE", "COS", "KSB"],
      organizer: "KNUST Computing Students Association",
      requiresApplication: true,
      applicationUrl: "https://hackknust.com",
      applicationDeadline: inWeeks(4),
      source: "curated",
      sourceUrl: "https://hackknust.com",
    },
    {
      title: "Ashesi x KNUST Joint Networking Night",
      description:
        "First-ever joint networking event between Ashesi University and KNUST students. Informal mixer — no presentations, no panels. Just 80 ambitious students from two of Ghana's best universities in one room. GDG, AIESEC, Enactus, and entrepreneurship club members from both schools. Hosted at KNUST. Come to make real connections, not to collect business cards.",
      startsAt: inWeeks(2),
      location: "University Hotel Foyer, KNUST",
      isOnline: false,
      category: "NETWORKING",
      tags: ["networking", "Ashesi", "connections", "informal", "evening"],
      targetColleges: ["COE", "COS", "KSB", "COA"],
      organizer: "KNUST Entrepreneurship Club",
      requiresApplication: false,
      source: "curated",
    },
    {
      title: "Google Cloud Study Jam — Machine Learning Track",
      description:
        "Free 4-week hands-on program run by GDG Kumasi. You'll complete Google Cloud ML labs, earn badges, and get a Google Cloud credit. No prior ML experience needed. Past participants have used this to land cloud engineering internships. Limited to 50 students — first come, first served. Bring your laptop every session.",
      startsAt: inWeeks(1),
      location: "Department of Computer Science, KNUST",
      isOnline: false,
      category: "WORKSHOP",
      tags: ["Google Cloud", "ML", "free", "certificate", "GCP", "hands-on"],
      targetColleges: ["COE", "COS"],
      organizer: "GDG Kumasi",
      requiresApplication: false,
      applicationUrl: "https://gdg.community.dev/gdg-kumasi/",
      source: "curated",
    },
    {
      title: "Vodafone Ghana Innovation Lab — Campus Tour & Talk",
      description:
        "Vodafone Ghana's Innovation Lab is opening its doors to KNUST students. Get a tour of the lab, hear from engineers and product managers about what they're building, and learn about their graduate and internship programmes. Q&A session at the end. Transport provided from KNUST main gate. RSVP required — 40 spots only.",
      startsAt: inWeeks(3),
      location: "Vodafone Innovation Lab, Accra (transport from KNUST)",
      isOnline: false,
      category: "NETWORKING",
      tags: ["Vodafone", "industry visit", "telecom", "internship", "transport provided"],
      targetColleges: ["COE", "COS", "KSB"],
      organizer: "Vodafone Ghana",
      requiresApplication: true,
      applicationUrl: "https://vodafone.com.gh/careers",
      applicationDeadline: inWeeks(2),
      source: "curated",
    },
    {
      title: "Fintech Frontiers: Building for Mobile Money in Ghana",
      description:
        "A talk + panel hosted by Hubtel and Zeepay exploring how to build financial products for Ghana's mobile money ecosystem. Speakers include senior engineers from Hubtel, the CEO of Zeepay, and a product manager from MTN MoMo. Perfect if you're interested in fintech, payments, or want to understand Ghana's digital finance infrastructure. Open to all.",
      startsAt: inWeeks(2),
      location: "KSB Auditorium, KNUST",
      isOnline: false,
      category: "TALK",
      tags: ["fintech", "MoMo", "Hubtel", "payments", "Zeepay", "MTN"],
      targetColleges: ["KSB", "COE", "COS"],
      organizer: "KNUST Finance and Tech Society",
      requiresApplication: false,
      source: "curated",
    },
    {
      title: "ALX Africa — Tech Programme Info Session",
      description:
        "ALX runs intensive 12-month software engineering and data science programmes for African students. This session covers: what the programme looks like, how the job placement works (70%+ of graduates land tech roles), the commitment required, and how KNUST students have done. If you're considering ALX, come with questions — past KNUST graduates will be there.",
      startsAt: inWeeks(1),
      location: "Online (Zoom) + KNUST Engineering Hub, Room 12",
      isOnline: true,
      category: "TALK",
      tags: ["ALX", "software engineering", "data science", "career", "programme"],
      targetColleges: ["COE", "COS", "KSB"],
      organizer: "ALX Africa",
      requiresApplication: false,
      applicationUrl: "https://www.alxafrica.com",
      source: "curated",
      sourceUrl: "https://www.alxafrica.com",
    },
    {
      title: "Startup Weekend Kumasi 2025",
      description:
        "54 hours. An idea. A team you meet on Friday night. A product you demo on Sunday. Startup Weekend is the world's largest startup event series — this is the Kumasi edition. No business plan needed. Just show up with a problem you care about. Facilitators from Nest at Accra and local Kumasi entrepreneurs will mentor your team through the weekend.",
      startsAt: inWeeks(7),
      endsAt: inWeeks(7),
      location: "Nest at Kumasi, Adum, Kumasi",
      isOnline: false,
      category: "HACKATHON",
      tags: ["startup", "weekend", "entrepreneurship", "team", "pitch", "54hrs"],
      targetColleges: ["KSB", "COE", "COS", "COA"],
      organizer: "Techstars / Startup Weekend Kumasi",
      requiresApplication: true,
      applicationUrl: "https://startupweekend.org",
      applicationDeadline: inWeeks(5),
      source: "curated",
      sourceUrl: "https://startupweekend.org",
    },
  ];

  console.log(`  ✅ Loaded ${events.length} curated events`);
  return events;
}

// ─── Step 4: Curated Ghana internships ───────────────────────────────────────

function getCuratedInternships(): SeedInternship[] {
  console.log("📋 Loading curated Ghana/remote internships...");

  const now = new Date();
  const inWeeks = (n: number): string => {
    const d = new Date(now);
    d.setDate(d.getDate() + n * 7);
    return d.toISOString();
  };

  const internships: SeedInternship[] = [
    {
      title: "Software Engineering Intern",
      company: "Hubtel",
      description:
        "Hubtel is Ghana's leading commerce and payments platform. As a software engineering intern, you'll work on real features used by millions of Ghanaians — mobile money integration, merchant APIs, and consumer apps. Stack: .NET, React, PostgreSQL. 3-month program, possibility of extension. Based in Accra with hybrid flexibility.",
      location: "Accra, Ghana",
      isRemote: false,
      isPaid: true,
      stipendRange: "GHS 1,500–2,500/month",
      applicationUrl: "https://hubtel.com/careers",
      applicationDeadline: inWeeks(6),
      tags: ["React", ".NET", "PostgreSQL", "fintech", "payments"],
      experienceLevel: "Entry-level",
      source: "curated",
    },
    {
      title: "Product Design Intern",
      company: "Paystack",
      description:
        "Paystack (acquired by Stripe) processes payments for businesses across Africa. You'll work alongside senior product designers on the merchant dashboard, onboarding flows, and mobile checkout experiences. Expected to run your own user research sessions. Proficiency in Figma required. Remote-first, with occasional Lagos team visits.",
      location: "Remote (Africa-based)",
      isRemote: true,
      isPaid: true,
      stipendRange: "$400–600 USD/month",
      applicationUrl: "https://paystack.com/careers",
      applicationDeadline: inWeeks(5),
      tags: ["Figma", "UX research", "product design", "fintech", "Stripe"],
      experienceLevel: "Entry-level",
      source: "curated",
    },
    {
      title: "Data Analyst Intern",
      company: "MTN Ghana",
      description:
        "MTN Ghana's analytics team is looking for a data-driven intern to help analyse subscriber behaviour, network performance, and MoMo transaction trends. You'll use SQL, Python, and Power BI. The internship runs for 4 months and is based in Accra. Strong candidates are considered for the MTN graduate programme.",
      location: "Accra, Ghana",
      isRemote: false,
      isPaid: true,
      stipendRange: "GHS 1,800–2,200/month",
      applicationUrl: "https://mtn.com.gh/careers",
      applicationDeadline: inWeeks(4),
      tags: ["SQL", "Python", "Power BI", "data analysis", "telecom"],
      experienceLevel: "Entry-level",
      source: "curated",
    },
    {
      title: "Frontend Engineering Intern",
      company: "Zeepay",
      description:
        "Zeepay is a fintech connecting mobile money wallets across Africa and diaspora corridors. You'll build features on their web platform using React and TypeScript. The team is small, so interns own real features from start to finish. Great for students who want to go deep fast. Hybrid — Accra office + remote.",
      location: "Accra, Ghana (Hybrid)",
      isRemote: true,
      isPaid: true,
      stipendRange: "GHS 1,200–1,800/month",
      applicationUrl: "https://zeepay.com/careers",
      applicationDeadline: inWeeks(5),
      tags: ["React", "TypeScript", "fintech", "mobile money", "frontend"],
      experienceLevel: "Entry-level",
      source: "curated",
    },
    {
      title: "Software Development Intern",
      company: "Turaco",
      description:
        "Turaco provides affordable insurance to low-income workers in Ghana, Uganda, and Kenya via mobile money. Small but fast-growing team. You'll work across their platform — claims processing, partner APIs, and internal dashboards. Stack: Python (Django), React. Remote-friendly with a Accra office for those nearby.",
      location: "Remote / Accra, Ghana",
      isRemote: true,
      isPaid: true,
      stipendRange: "$350–500 USD/month",
      applicationUrl: "https://turaco.co/careers",
      applicationDeadline: inWeeks(7),
      tags: ["Python", "Django", "React", "insurtech", "Africa"],
      experienceLevel: "Entry-level",
      source: "curated",
    },
    {
      title: "Business Analyst Intern",
      company: "Deloitte Ghana",
      description:
        "Deloitte Ghana's consulting team works with financial institutions, government agencies, and large corporates. As a business analyst intern, you'll support client engagements — data gathering, process mapping, report writing, and presentation preparation. KSB and Business-adjacent students preferred. Based in Accra, formal attire required.",
      location: "Accra, Ghana",
      isRemote: false,
      isPaid: true,
      stipendRange: "GHS 2,000–3,000/month",
      applicationUrl: "https://www2.deloitte.com/gh/en/careers.html",
      applicationDeadline: inWeeks(3),
      tags: ["consulting", "business analysis", "Excel", "PowerPoint", "finance"],
      experienceLevel: "Entry-level",
      source: "curated",
    },
    {
      title: "Machine Learning Engineering Intern",
      company: "InstaDeep",
      description:
        "InstaDeep (acquired by BioNTech) is a leading AI company with roots in Africa. This remote internship is part of their Africa talent programme. You'll contribute to real ML research and production projects in reinforcement learning, protein design, or logistics optimisation. Strong Python and PyTorch skills required. Fully remote.",
      location: "Remote (Africa)",
      isRemote: true,
      isPaid: true,
      stipendRange: "$500–800 USD/month",
      applicationUrl: "https://www.instadeep.com/careers/",
      applicationDeadline: inWeeks(8),
      tags: ["ML", "Python", "PyTorch", "AI research", "reinforcement learning"],
      experienceLevel: "Entry-level",
      source: "curated",
    },
    {
      title: "Network Engineering Intern",
      company: "Vodafone Ghana",
      description:
        "Vodafone Ghana is one of the country's largest telecom operators. This internship sits within the network engineering team — you'll rotate across radio access, core network, and IP teams. Ideal for COE Telecom/Electrical students. Based in Accra. Vodafone offers a structured grad programme for top interns.",
      location: "Accra, Ghana",
      isRemote: false,
      isPaid: true,
      stipendRange: "GHS 1,500–2,000/month",
      applicationUrl: "https://vodafone.com.gh/careers",
      applicationDeadline: inWeeks(4),
      tags: ["networking", "telecom", "radio", "IP", "infrastructure"],
      experienceLevel: "Entry-level",
      source: "curated",
    },
    {
      title: "UX Research Intern",
      company: "Flutterwave",
      description:
        "Flutterwave powers payments for Africa-facing businesses globally. This remote UX research internship involves conducting user interviews, synthesising research findings, and contributing to product decisions for merchant tools and consumer apps. You'll work directly with senior researchers. Must be comfortable running remote user interviews.",
      location: "Remote",
      isRemote: true,
      isPaid: true,
      stipendRange: "$400–600 USD/month",
      applicationUrl: "https://flutterwave.com/us/careers",
      applicationDeadline: inWeeks(6),
      tags: ["UX research", "user interviews", "product", "fintech", "remote"],
      experienceLevel: "Entry-level",
      source: "curated",
    },
    {
      title: "Civil/Structural Engineering Intern",
      company: "Mott MacDonald Ghana",
      description:
        "Mott MacDonald is a global engineering consultancy with a strong Ghana presence. This structural engineering internship supports infrastructure projects across Ghana — bridges, buildings, and urban development. COA and COE students preferred. Hybrid working model with site visits required.",
      location: "Accra, Ghana (Hybrid)",
      isRemote: false,
      isPaid: true,
      stipendRange: "GHS 1,800–2,500/month",
      applicationUrl: "https://www.mottmac.com/careers",
      applicationDeadline: inWeeks(5),
      tags: ["civil engineering", "structural", "infrastructure", "AutoCAD", "construction"],
      experienceLevel: "Entry-level",
      source: "curated",
    },
  ];

  console.log(`  ✅ Loaded ${internships.length} curated internships`);
  return internships;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function extractTags(text: string): string[] {
  const keywords = [
    "AI", "ML", "machine learning", "Python", "React", "Node", "cloud",
    "Google", "fintech", "startup", "data", "design", "UX", "mobile",
    "blockchain", "web3", "free", "hackathon", "workshop", "certificate",
  ];
  const lower = text.toLowerCase();
  return keywords.filter((kw) => lower.includes(kw.toLowerCase())).slice(0, 5);
}

function categorizeLuma(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("hackathon") || t.includes("hack")) return "HACKATHON";
  if (t.includes("workshop") || t.includes("study jam")) return "WORKSHOP";
  if (t.includes("career") || t.includes("fair") || t.includes("recruit")) return "CAREER_FAIR";
  if (t.includes("network") || t.includes("mixer") || t.includes("meetup")) return "NETWORKING";
  if (t.includes("conference") || t.includes("devfest") || t.includes("summit")) return "CONFERENCE";
  return "TALK";
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("\n🌍 KNUST Events — Seed Data Generator");
  console.log("─────────────────────────────────────\n");

  const [eventbriteEvents, lumaEvents] = await Promise.all([
    fetchEventbriteGhana(),
    fetchLumaGhana(),
  ]);

  const curatedEvents = getCuratedEvents();
  const curatedInternships = getCuratedInternships();

  const allEvents: SeedEvent[] = [
    ...curatedEvents,
    ...lumaEvents,
    ...eventbriteEvents,
  ];

  const outputDir = path.join(process.cwd(), "prisma");

  fs.writeFileSync(
    path.join(outputDir, "seed-events.json"),
    JSON.stringify(allEvents, null, 2)
  );

  fs.writeFileSync(
    path.join(outputDir, "seed-internships.json"),
    JSON.stringify(curatedInternships, null, 2)
  );

  console.log("\n✅ Done!");
  console.log(`   Events:      ${allEvents.length} → prisma/seed-events.json`);
  console.log(`   Internships: ${curatedInternships.length} → prisma/seed-internships.json`);
  console.log("\nNext: npx prisma db seed\n");
}

main().catch((err) => {
  console.error("❌ Seed data generation failed:", err);
  process.exit(1);
});
