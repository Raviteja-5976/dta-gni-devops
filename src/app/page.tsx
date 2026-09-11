import Link from "next/link";
import Image from "next/image";
import { Lock, ArrowRight, Clock, StickyNote } from "lucide-react";
import { SESSIONS } from "@/lib/sessions";
import { getUnlockedSessions } from "@/lib/store";

/* Tiles reflect admin unlocks, which change at class time. */
export const dynamic = "force-dynamic";

/* Per-session accent, drawn from the existing deck palette. */
const ACCENTS = {
  orange: { bg: "#FF6B35", ink: "#FFFFFF" },
  sky: { bg: "#4EA8FF", ink: "#1B1F3B" },
  yellow: { bg: "#FFC93C", ink: "#1B1F3B" },
  mint: { bg: "#6EE7B7", ink: "#1B1F3B" },
} as const;

export default async function HomePage() {
  const unlocked = await getUnlockedSessions();

  return (
    <main className="min-h-screen bg-[#FFF8F0] bg-[radial-gradient(rgba(27,31,59,0.14)_1.5px,transparent_1.6px)] [background-size:32px_32px]">
      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* ---------- Masthead ---------- */}
        <header className="mb-14">
          <div className="flex items-center gap-4 mb-9">
            <div className="relative w-14 h-14 border-4 border-[#1B1F3B] bg-white shadow-[5px_5px_0_#1B1F3B] shrink-0">
              <Image
                src="/logo.png"
                alt="DevTrackAcademy"
                fill
                className="object-contain p-1"
                sizes="56px"
                priority
              />
            </div>
            <span className="font-display text-[24px] text-[#1B1F3B] tracking-tight">
              DevTrackAcademy
            </span>
            <span className="chip-mono bg-[#FF6B35] text-white text-[12px]">
              Workshop
            </span>
          </div>

          <h1 className="font-display text-[clamp(40px,7vw,76px)] leading-[1.02] text-[#1B1F3B] tracking-[-0.03em] max-w-4xl">
            DevOps &amp; Docker <span className="marker">Workshop</span>
          </h1>

          <p className="font-sans text-[19px] text-[#1B1F3B]/70 mt-6 max-w-2xl leading-relaxed">
            A hands-on series that takes you from &ldquo;it works on my
            machine&rdquo; to containers, pipelines and infrastructure as code.
            Sessions open as we reach them in class.
          </p>

          <Link
            href="/notes"
            className="tactile-btn tactile-btn-sky px-5 py-2.5 text-xs mt-8"
          >
            <StickyNote className="w-4 h-4 shrink-0" />
            Notes &amp; links
          </Link>

          <div className="mt-8 h-2 w-full brut-stripes opacity-25" />
        </header>

        {/* ---------- Session tiles ---------- */}
        <section aria-label="Workshop sessions" className="grid gap-7 grid-cols-2 max-[820px]:grid-cols-1">
          {SESSIONS.map((session) => {
            const accent = ACCENTS[session.accent];
            const isUnlocked = unlocked.includes(session.slug);
            const authored = session.slides !== null;
            const open = isUnlocked && authored;

            /* Three tile states:
                 open      — unlocked and authored, clickable
                 upcoming  — unlocked but the deck isn't written yet
                 locked    — admin hasn't activated it for class yet   */
            const body = (
              <>
                <div className="flex items-start justify-between gap-4 mb-5">
                  <span
                    className="font-display text-[28px] leading-none px-4 py-3 border-4 border-[#1B1F3B] shadow-[5px_5px_0_#1B1F3B] shrink-0"
                    style={{
                      background: open ? accent.bg : "#F5EBE0",
                      color: open ? accent.ink : "#1B1F3B",
                    }}
                  >
                    {String(session.number).padStart(2, "0")}
                  </span>

                  {open ? (
                    <span className="chip-mono bg-[#6EE7B7] text-[#1B1F3B] text-[11px]">
                      Open
                    </span>
                  ) : authored ? (
                    <span className="chip-mono bg-[#F5EBE0] text-[#1B1F3B]/70 text-[11px]">
                      <Lock className="w-3 h-3 shrink-0" /> Locked
                    </span>
                  ) : (
                    <span className="chip-mono bg-[#F5EBE0] text-[#1B1F3B]/70 text-[11px]">
                      <Clock className="w-3 h-3 shrink-0" /> Coming soon
                    </span>
                  )}
                </div>

                <h2
                  className={`font-display text-[26px] leading-tight tracking-tight ${
                    open ? "text-[#1B1F3B]" : "text-[#1B1F3B]/55"
                  }`}
                >
                  {session.title}
                </h2>

                <p
                  className={`font-sans text-[15px] leading-relaxed mt-3 ${
                    open ? "text-[#1B1F3B]/70" : "text-[#1B1F3B]/45"
                  }`}
                >
                  {session.tagline}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  {session.topics.map((topic) => (
                    <span
                      key={topic}
                      className={`font-mono text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 border-2 ${
                        open
                          ? "border-[#1B1F3B] text-[#1B1F3B] bg-[#FFF8F0]"
                          : "border-[#1B1F3B]/25 text-[#1B1F3B]/40"
                      }`}
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t-4 border-[#1B1F3B]/10 flex items-center justify-between gap-3">
                  {open ? (
                    <>
                      <span className="font-mono text-[12px] font-bold text-[#1B1F3B]/60 uppercase tracking-wider">
                        {session.slides?.length} slides
                      </span>
                      <span className="font-display text-[15px] text-[#1B1F3B] inline-flex items-center gap-2 uppercase">
                        Open deck
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </span>
                    </>
                  ) : (
                    <span className="font-mono text-[12px] font-bold text-[#1B1F3B]/45 uppercase tracking-wider">
                      {authored
                        ? "Unlocks at class time"
                        : "Content in preparation"}
                    </span>
                  )}
                </div>
              </>
            );

            const shell =
              "block p-7 border-[6px] border-[#1B1F3B] bg-white transition-transform duration-150";

            return open ? (
              <Link
                key={session.slug}
                href={`/sessions/${session.slug}`}
                className={`${shell} shadow-[10px_10px_0_#1B1F3B] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[14px_14px_0_#1B1F3B] focus-visible:outline-4 focus-visible:outline-[#4EA8FF]`}
              >
                {body}
              </Link>
            ) : (
              <div
                key={session.slug}
                aria-disabled="true"
                className={`${shell} bg-[#FCF6EE] shadow-[6px_6px_0_rgba(27,31,59,0.28)] cursor-not-allowed`}
              >
                {body}
              </div>
            );
          })}
        </section>

        {/* ---------- Footer ---------- */}
        <footer className="mt-16 pt-7 border-t-4 border-[#1B1F3B]/15 flex items-center justify-between gap-4 flex-wrap">
          <p className="font-mono text-[12px] text-[#1B1F3B]/50 uppercase tracking-wider">
            DevTrackAcademy · DevOps &amp; Docker Workshop
          </p>
          <Link
            href="/admin"
            className="font-mono text-[12px] text-[#1B1F3B]/40 hover:text-[#FF6B35] uppercase tracking-wider underline underline-offset-4"
          >
            Instructor access
          </Link>
        </footer>
      </div>
    </main>
  );
}
