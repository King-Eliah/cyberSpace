import Link from "next/link";
import { TypewriterText } from "@/components/landing/TypewriterText";
import { CursorGlow } from "@/components/landing/CursorGlow";
import { EventsTicker } from "@/components/landing/EventsTicker";

export default function LandingPage() {
  return (
    <main className="bg-[#0F0F0E] min-h-screen overflow-hidden">

      {/* ── Navigation ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b border-white/10 px-6 py-4 backdrop-blur-xl md:px-8"
        style={{ background: "rgba(15,15,14,0.72)" }}
      >
        <div className="flex items-center gap-1">
          <span className="text-[#FAFAF7] font-black text-xl tracking-tighter">cyber</span>
          <span className="text-[#C84B31] font-black text-xl tracking-tighter">Space</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {["EVENTS", "INTERNSHIPS", "STORIES"].map((item) => (
            <span
              key={item}
              className="text-[11px] font-semibold tracking-[0.22em] text-[#8A8A81] hover:text-[#FAFAF7] transition-colors cursor-pointer"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className="text-[11px] font-semibold tracking-[0.15em] text-[#8A8A81] hover:text-[#FAFAF7] transition-colors uppercase"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-[11px] font-semibold tracking-[0.15em] uppercase border border-[#C84B31] text-[#C84B31] px-5 py-2.5 hover:bg-[#C84B31] hover:text-white transition-all"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        <CursorGlow />
        <div className="absolute inset-x-0 top-20 h-56 bg-[radial-gradient(circle_at_center,rgba(200,75,49,0.12),transparent_68%)]" aria-hidden />

        <div className="relative z-10 flex flex-1 items-center px-6 pb-24 pt-32 md:px-10 lg:px-16 mx-auto w-full max-w-7xl">
          <div className="grid w-full gap-12 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.7fr)] xl:items-end">
            <div>
              <div className="flex items-center gap-3 mb-10">
                <span className="text-[11px] font-semibold tracking-[0.3em] text-[#8A8A81] uppercase">
                  KNUST · KUMASI
                </span>
                <span className="w-12 h-px bg-[#C84B31]" />
                <span className="text-[11px] font-semibold tracking-[0.3em] text-[#C84B31] uppercase">
                  2025
                </span>
              </div>

              <h1
                className="max-w-4xl font-black text-[#FAFAF7] leading-[0.92] tracking-tight mb-8"
                style={{ fontSize: "clamp(42px, 6.5vw, 88px)" }}
              >
                <TypewriterText />
              </h1>

              <p
                className="text-[#8A8A81] leading-relaxed mb-10 max-w-md"
                style={{ fontSize: "clamp(15px, 1.5vw, 18px)" }}
              >
                Discover events, build your presence, grow your network. Built for
                KNUST students who are serious about their trajectory.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-12">
                <Link
                  href="/signup"
                  className="rounded-full bg-[#C84B31] px-8 py-4 text-[13px] font-bold tracking-[0.12em] uppercase text-white transition-all hover:-translate-y-0.5 hover:bg-[#E05D42]"
                >
                  Get started
                </Link>
                <Link
                  href="/feed"
                  className="rounded-full border border-white/12 bg-white/0 px-8 py-4 text-[13px] font-bold tracking-[0.12em] uppercase text-[#B7B7AF] transition-all hover:border-white/30 hover:text-[#FAFAF7]"
                >
                  Browse events
                </Link>
              </div>

              <div className="flex items-center gap-3">
                <div className="group flex h-8 w-8 items-center justify-center rounded-full border border-white/12 transition-colors hover:border-[#C84B31]">
                  <div className="ml-0.5 h-0 w-0 border-b-[5px] border-b-transparent border-l-8 border-l-[#8A8A81] border-t-[5px] border-t-transparent transition-colors group-hover:border-l-[#C84B31]" />
                </div>
                <span className="text-[13px] font-semibold tracking-wide text-[#8A8A81] transition-colors hover:text-[#FAFAF7] cursor-pointer">
                  Watch intro
                </span>
              </div>
            </div>

            <div className="xl:self-center">
              <div className="border border-white/10 bg-white/5 p-6 shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-sm">
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-[#8A8A81]">
                  Designed for focus
                </p>
                <div className="space-y-4">
                  {[
                    ["Discover", "A calmer event feed with stronger hierarchy."],
                    ["Prepare", "Context-aware briefs before you arrive."],
                    ["Post", "LinkedIn posts that sound like students, not templates."],
                  ].map(([title, description]) => (
                    <div key={title} className="border-b border-white/8 pb-4 last:border-b-0 last:pb-0">
                      <p className="text-sm font-semibold text-[#FAFAF7]">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-[#A5A59C]">{description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-8 left-6 z-10 md:left-10 lg:left-16">
            <span className="text-[10px] font-semibold tracking-[0.3em] text-[#C84B31] uppercase">
              KNUST · GHANA
            </span>
          </div>

          <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2">
            <div className="flex h-8 w-5 justify-center rounded-full border border-white/12 pt-1.5">
              <div className="h-2 w-0.5 animate-bounce rounded-full bg-[#C84B31]" />
            </div>
            <span className="text-[9px] tracking-[0.3em] text-[#3A3A38] uppercase">Scroll</span>
          </div>
        </div>
      </section>

      {/* ── Events ticker ───────────────────────────────────────── */}
      <EventsTicker />

      {/* ── Stats ───────────────────────────────────────────────── */}
      <section className="bg-[#FAFAF7] px-8 md:px-16 lg:px-24 py-20 border-b border-[#E8E8E3]">
        <p className="text-[11px] font-semibold tracking-[0.3em] text-[#6B6B63] uppercase mb-12">
          WHY IT EXISTS
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { stat: "85,000", label: "Students on one campus", note: "One campus. Zero excuses." },
            { stat: "24+", label: "Events this month", note: "Tech, business, hackathons, career fairs" },
            { stat: "1,200+", label: "LinkedIn posts written", note: "In real voices, not press releases" },
          ].map((s) => (
            <div key={s.stat} className="border-l-2 border-[#C84B31] pl-6">
              <p className="text-6xl font-black text-[#0F0F0E] leading-none mb-2">{s.stat}</p>
              <p className="text-base font-semibold text-[#0F0F0E] mb-1">{s.label}</p>
              <p className="text-sm text-[#6B6B63]">{s.note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section className="bg-[#FAFAF7] px-8 md:px-16 lg:px-24 py-24 space-y-28 border-b border-[#E8E8E3]">
        {[
          {
            num: "01",
            label: "DISCOVER",
            title: "Events tailored to your college and interests",
            body: "Filter by category, college, and date. GDG KNUST, IEEE, AIESEC, SRC, Kumasi Hive — everything in one feed, filtered to what matters to you.",
            preview: [
              { month: "JUN", day: "12", title: "GDG Kumasi DevFest 2025", tag: "CONFERENCE" },
              { month: "JUN", day: "18", title: "SRC Career & Internship Fair", tag: "CAREER FAIR" },
              { month: "JUL", day: "3", title: "Startup Weekend Kumasi", tag: "HACKATHON" },
            ],
            reverse: false,
          },
          {
            num: "02",
            label: "PREPARE",
            title: "Get your brief 24 hours before every event",
            body: "What to expect. Three conversation starters. What to bring. Written by Claude, grounded in KNUST context. Show up ready, not guessing.",
            preview: null,
            previewBrief: true,
            reverse: true,
          },
          {
            num: "03",
            label: "POST",
            title: "Turn every event into a LinkedIn post in 30 seconds",
            body: "Tell us what you learned. Get 3 variants — reflective, technical, network-focused. In your voice, not corporate-speak.",
            preview: null,
            previewPost: true,
            reverse: false,
          },
        ].map((f) => (
          <div
            key={f.num}
            className={`grid grid-cols-1 md:grid-cols-2 gap-16 items-center ${
              f.reverse ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[11px] font-black tracking-[0.3em] text-[#C84B31] uppercase">
                  {f.num}
                </span>
                <span className="w-8 h-px bg-[#C84B31]" />
                <span className="text-[11px] font-bold tracking-[0.25em] text-[#6B6B63] uppercase">
                  {f.label}
                </span>
              </div>
              <h2 className="text-4xl font-black text-[#0F0F0E] leading-tight mb-5">
                {f.title}
              </h2>
              <p className="text-[#6B6B63] text-base leading-relaxed">{f.body}</p>
            </div>

            <div className="border border-[#E8E8E3] bg-white p-7">
              {f.preview && (
                <div className="space-y-3">
                  {f.preview.map((e) => (
                    <div
                      key={e.title}
                      className="event-card flex gap-5 border border-[#E8E8E3] p-4 transition-colors cursor-pointer"
                    >
                      <div className="text-center min-w-11 shrink-0">
                        <p className="text-[10px] font-bold text-[#6B6B63] uppercase tracking-wider">
                          {e.month}
                        </p>
                        <p className="text-3xl font-black leading-none text-[#0F0F0E]">{e.day}</p>
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className="font-bold text-sm text-[#0F0F0E]">{e.title}</p>
                        <span className="text-[10px] font-bold text-[#C84B31] mt-1 tracking-wide">
                          {e.tag}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {f.previewBrief && (
                <div className="space-y-5 text-sm">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B6B63] mb-4">
                    Your brief — GDG DevFest
                  </p>
                  <div>
                    <p className="font-bold text-[#0F0F0E] mb-1.5">What to expect</p>
                    <p className="text-[#6B6B63] leading-relaxed">
                      ~200 people, mostly COE and COS. Three keynotes then breakout rooms. Energy peaks after the first hour.
                    </p>
                  </div>
                  <div>
                    <p className="font-bold text-[#0F0F0E] mb-1.5">Conversation starters</p>
                    <ul className="text-[#6B6B63] space-y-1.5">
                      <li className="flex gap-2"><span className="text-[#C84B31] font-bold">—</span> &ldquo;What are you building right now?&rdquo;</li>
                      <li className="flex gap-2"><span className="text-[#C84B31] font-bold">—</span> &ldquo;Are you applying to MEST this cycle?&rdquo;</li>
                      <li className="flex gap-2"><span className="text-[#C84B31] font-bold">—</span> &ldquo;How long have you been with GDG?&rdquo;</li>
                    </ul>
                  </div>
                  <div className="bg-[#FAFAF7] p-3 border border-[#E8E8E3]">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B63] mb-1">Mindset</p>
                    <p className="text-[#0F0F0E] font-medium text-sm">Come to contribute, not just collect. One real conversation beats ten business cards.</p>
                  </div>
                </div>
              )}

              {f.previewPost && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#6B6B63] mb-4">
                    Reflective variant
                  </p>
                  <p className="text-sm text-[#0F0F0E] leading-relaxed mb-5">
                    &ldquo;The best conversation I had at DevFest wasn&apos;t about code — it was with the guy building a fintech tool for market women in Kejetia. That&apos;s the KNUST energy I came for. Walked away with two contacts, one idea, and a clear picture of what I want to build next...&rdquo;
                  </p>
                  <div className="flex gap-2">
                    {["Reflective", "Technical", "Network"].map((v) => (
                      <span
                        key={v}
                        className={`text-[11px] font-semibold px-3 py-1 border ${
                          v === "Reflective"
                            ? "bg-[#0F0F0E] text-white border-[#0F0F0E]"
                            : "border-[#E8E8E3] text-[#6B6B63]"
                        }`}
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* ── Community tips preview ───────────────────────────────── */}
      <section className="bg-[#FAFAF7] px-8 md:px-16 lg:px-24 py-20 border-b border-[#E8E8E3]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="md:order-2">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-[11px] font-black tracking-[0.3em] text-[#C84B31] uppercase">04</span>
              <span className="w-8 h-px bg-[#C84B31]" />
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#6B6B63] uppercase">COMMUNITY</span>
            </div>
            <h2 className="text-4xl font-black text-[#0F0F0E] leading-tight mb-5">
              Tips from different students, not one voice.
            </h2>
            <p className="text-[#6B6B63] text-base leading-relaxed">
              Best parts, what to skip, who to meet, and a few replies underneath when someone needs the extra context.
            </p>
          </div>
          <div className="md:order-1 space-y-3">
            {[
              {
                name: "Ama Serwaa",
                college: "COE · Year 3",
                type: "BEST PART",
                color: "border-[#4CAF50] text-[#4CAF50]",
                tip: "The hands-on ML workshop after the keynote was the real value. Less hype, more building.",
                reply: "Reply: If you go, sit near the front. The Q&A after lunch got the best contacts.",
              },
              {
                name: "Yaw Mensah",
                college: "KSB · Year 4",
                type: "BRING THIS",
                color: "border-[#2196F3] text-[#2196F3]",
                tip: "Keep your phone ready and your LinkedIn QR open. Conversations moved fast at the booths.",
                reply: "Reply: A short intro with your college and what you build works better than business cards.",
              },
              {
                name: "Nana Ama",
                college: "COS · Year 2",
                type: "TALK TO",
                color: "border-[#C84B31] text-[#C84B31]",
                tip: "The MEST alumni were the most honest people in the room. They will tell you if your idea is weak.",
                reply: "Reply: Ask what they would build first if they were starting over. That question opens things up.",
              },
            ].map((t) => (
              <div key={t.name} className="border border-[#E8E8E3] bg-white p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <p className="text-sm font-semibold text-[#0F0F0E]">{t.name}</p>
                    <p className="text-xs text-[#6B6B63] mt-0.5">{t.college}</p>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] border px-2 py-0.5 ${t.color}`}>
                    {t.type}
                  </span>
                </div>
                <p className="text-sm text-[#0F0F0E] leading-relaxed">{t.tip}</p>
                <div className="mt-4 border-l-2 border-[#E8E8E3] pl-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#6B6B63] mb-1">
                    Reply
                  </p>
                  <p className="text-sm text-[#6B6B63] leading-relaxed">{t.reply}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Internships strip ───────────────────────────────────── */}
      <section className="bg-[#FAFAF7] px-8 md:px-16 lg:px-24 py-20 border-b border-[#E8E8E3]">
        <div className="flex items-start justify-between gap-8 mb-10">
          <div>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-[#6B6B63] uppercase mb-3">
              INTERNSHIPS
            </p>
            <h2 className="text-4xl font-black text-[#0F0F0E] leading-tight">
              Ghana-based and remote roles,<br />curated for KNUST students.
            </h2>
          </div>
          <Link
            href="/internships"
            className="shrink-0 text-[11px] font-bold tracking-[0.2em] uppercase border border-[#0F0F0E] text-[#0F0F0E] px-5 py-3 hover:bg-[#0F0F0E] hover:text-white transition-all mt-1"
          >
            See all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { company: "Hubtel", role: "Software Engineering Intern", tags: ["React", ".NET", "Fintech"], remote: false, paid: true },
            { company: "Paystack", role: "Product Design Intern", tags: ["Figma", "UX", "Stripe"], remote: true, paid: true },
            { company: "InstaDeep", role: "ML Engineering Intern", tags: ["Python", "PyTorch", "AI"], remote: true, paid: true },
          ].map((j) => (
            <div key={j.company} className="event-card border border-[#E8E8E3] bg-white p-5 transition-colors cursor-pointer">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-black text-[#0F0F0E]">{j.company}</span>
                {j.remote && (
                  <span className="text-[10px] font-semibold border border-[#E8E8E3] px-2 py-0.5 text-[#6B6B63]">REMOTE</span>
                )}
                {j.paid && (
                  <span className="text-[10px] font-semibold border border-[#E8E8E3] px-2 py-0.5 text-[#6B6B63]">PAID</span>
                )}
              </div>
              <p className="text-sm font-semibold text-[#0F0F0E] mb-3">{j.role}</p>
              <div className="flex gap-1.5 flex-wrap">
                {j.tags.map((t) => (
                  <span key={t} className="text-[10px] border border-[#E8E8E3] px-2 py-0.5 text-[#6B6B63]">{t}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────── */}
      <section className="relative bg-[#0F0F0E] px-8 md:px-16 lg:px-24 py-28 overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-[#C84B31]/10 blur-3xl" />
          <div className="absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <p className="text-[11px] font-bold tracking-[0.3em] text-[#C84B31] uppercase mb-6">
            cyberSpace
          </p>
          <h2
            className="font-black text-[#FAFAF7] leading-[0.92] tracking-tight mb-8"
            style={{ fontSize: "clamp(40px, 5.5vw, 80px)" }}
          >
            Your environment
            <br />
            is your curriculum.
          </h2>
          <p className="text-[#6B6B63] text-lg mb-10 max-w-xl leading-relaxed">
            Stop missing the rooms that change your trajectory. Everything in
            one place — built for KNUST students who move with intention.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-[#C84B31] text-white px-10 py-4 text-[13px] font-bold tracking-[0.15em] uppercase hover:bg-[#FAFAF7] hover:text-[#0F0F0E] transition-all"
          >
            Join cyberSpace
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className="bg-[#0F0F0E] border-t border-[#1E1E1C] px-8 md:px-16 py-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-1">
          <span className="text-[#FAFAF7] font-black tracking-tighter">cyber</span>
          <span className="text-[#C84B31] font-black tracking-tighter">Space</span>
        </div>
        <p className="text-[11px] text-[#3A3A38] tracking-widest uppercase">
          For KNUST students · Kumasi, Ghana · 2025
        </p>
      </footer>

    </main>
  );
}
