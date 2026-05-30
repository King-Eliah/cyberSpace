import Link from "next/link";
import { TypewriterText } from "@/components/landing/TypewriterText";
import { Particles } from "@/components/landing/Particles";
import { EventsTicker } from "@/components/landing/EventsTicker";

export default function LandingPage() {
  return (
    <main className="bg-[#0F0F0E] min-h-screen">

      {/* ── Navigation ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 border-b border-[#1E1E1C]"
        style={{ background: "rgba(15,15,14,0.88)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-1">
          <span className="text-[#FAFAF7] font-black text-xl tracking-tighter">cyber</span>
          <span className="text-[#C84B31] font-black text-xl tracking-tighter">Space</span>
        </div>

        <div className="hidden md:flex items-center gap-10">
          {["EVENTS", "INTERNSHIPS", "STORIES"].map((item) => (
            <span
              key={item}
              className="text-[11px] font-semibold tracking-[0.22em] text-[#6B6B63] hover:text-[#FAFAF7] transition-colors cursor-pointer"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className="text-[11px] font-semibold tracking-[0.15em] text-[#6B6B63] hover:text-[#FAFAF7] transition-colors uppercase"
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

        {/* Background: massive "CS" letterforms */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-end pointer-events-none select-none overflow-hidden"
        >
          {/* Outline C */}
          <span
            className="font-black leading-none text-transparent select-none"
            style={{
              fontSize: "clamp(260px, 42vw, 680px)",
              WebkitTextStroke: "1.5px rgba(200,75,49,0.18)",
              color: "transparent",
              marginRight: "-2vw",
              letterSpacing: "-0.05em",
              userSelect: "none",
            }}
          >
            C
          </span>
          {/* Filled S */}
          <span
            className="font-black leading-none select-none"
            style={{
              fontSize: "clamp(260px, 42vw, 680px)",
              color: "rgba(200,75,49,0.13)",
              marginRight: "-8vw",
              letterSpacing: "-0.05em",
              userSelect: "none",
            }}
          >
            S
          </span>
        </div>

        {/* Confetti particles */}
        <Particles count={30} />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center flex-1 px-8 md:px-16 lg:px-24 pt-32 pb-28 max-w-5xl">

          {/* Year marker */}
          <div className="flex items-center gap-3 mb-10">
            <span className="text-[11px] font-semibold tracking-[0.3em] text-[#6B6B63] uppercase">
              KNUST · KUMASI
            </span>
            <span className="w-12 h-px bg-[#C84B31]" />
            <span className="text-[11px] font-semibold tracking-[0.3em] text-[#C84B31] uppercase">
              2025
            </span>
          </div>

          {/* Headline with typewriter */}
          <h1
            className="font-black text-[#FAFAF7] leading-[0.92] tracking-tight mb-8"
            style={{ fontSize: "clamp(42px, 6.5vw, 88px)" }}
          >
            <TypewriterText />
          </h1>

          {/* Sub */}
          <p
            className="text-[#6B6B63] leading-relaxed mb-10 max-w-md"
            style={{ fontSize: "clamp(15px, 1.5vw, 18px)" }}
          >
            Discover events, build your presence, grow your network. Built for
            KNUST students who are serious about their trajectory.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 mb-12">
            <Link
              href="/signup"
              className="bg-[#C84B31] text-white px-8 py-4 text-[13px] font-bold tracking-[0.12em] uppercase hover:bg-[#FAFAF7] hover:text-[#0F0F0E] transition-all"
            >
              Get started
            </Link>
            <Link
              href="/feed"
              className="border border-[#2A2A28] text-[#6B6B63] px-8 py-4 text-[13px] font-bold tracking-[0.12em] uppercase hover:border-[#FAFAF7] hover:text-[#FAFAF7] transition-all"
            >
              Browse events
            </Link>
          </div>

          {/* Play row */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-[#2A2A28] flex items-center justify-center cursor-pointer hover:border-[#C84B31] transition-colors group">
              <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-[#6B6B63] ml-0.5 group-hover:border-l-[#C84B31] transition-colors" />
            </div>
            <span className="text-[13px] font-semibold text-[#6B6B63] tracking-wide hover:text-[#FAFAF7] cursor-pointer transition-colors">
              Watch intro
            </span>
          </div>
        </div>

        {/* Right sidebar: SHARE */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-10 hidden lg:flex flex-col items-center gap-3">
          <div className="w-px h-10 bg-[#2A2A28]" />
          <p
            className="text-[9px] font-bold tracking-[0.4em] text-[#3A3A38] uppercase"
            style={{ writingMode: "vertical-rl" }}
          >
            SHARE
          </p>
          <div className="w-px h-10 bg-[#2A2A28]" />
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <div className="w-5 h-8 border border-[#2A2A28] rounded-full flex justify-center pt-1.5">
            <div className="w-0.5 h-2 bg-[#C84B31] rounded-full animate-bounce" />
          </div>
          <span className="text-[9px] tracking-[0.3em] text-[#3A3A38] uppercase">Scroll</span>
        </div>

        {/* Bottom-left: Langara-style label */}
        <div className="absolute bottom-8 left-8 z-10">
          <span className="text-[10px] font-semibold tracking-[0.3em] text-[#C84B31] uppercase">
            KNUST · GHANA
          </span>
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
                      <div className="text-center min-w-[44px] flex-shrink-0">
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
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#6B6B63] uppercase">LEARN</span>
            </div>
            <h2 className="text-4xl font-black text-[#0F0F0E] leading-tight mb-5">
              Tips from students who&apos;ve been there
            </h2>
            <p className="text-[#6B6B63] text-base leading-relaxed">
              Best part. What to skip. Who to talk to. Real notes from past attendees — before you walk in the door.
            </p>
          </div>
          <div className="md:order-1 space-y-3">
            {[
              { type: "BEST PART", color: "border-[#4CAF50] text-[#4CAF50]", tip: "The hands-on ML workshop after the keynote. Instructor flew in from Google Accra specifically for this." },
              { type: "BRING THIS", color: "border-[#2196F3] text-[#2196F3]", tip: "Your phone and LinkedIn QR ready. People will connect on the spot. Don't fumble with business cards." },
              { type: "TALK TO", color: "border-[#C84B31] text-[#C84B31]", tip: "The MEST alumni — they're always there and will give you brutally honest feedback on your ideas." },
            ].map((t) => (
              <div key={t.type} className="border border-[#E8E8E3] bg-white p-5">
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] border px-2 py-0.5 ${t.color}`}>
                  {t.type}
                </span>
                <p className="text-sm text-[#0F0F0E] leading-relaxed mt-3">{t.tip}</p>
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
            className="flex-shrink-0 text-[11px] font-bold tracking-[0.2em] uppercase border border-[#0F0F0E] text-[#0F0F0E] px-5 py-3 hover:bg-[#0F0F0E] hover:text-white transition-all mt-1"
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
        <Particles count={16} />
        {/* Background CS */}
        <div aria-hidden className="absolute right-0 bottom-0 pointer-events-none select-none overflow-hidden leading-none">
          <span
            className="font-black text-[#C84B31] opacity-[0.06] select-none leading-none"
            style={{ fontSize: "clamp(180px, 28vw, 480px)" }}
          >
            CS
          </span>
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
