import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Lock, ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/sessions";
import { getUnlockedSessions } from "@/lib/store";
import { isAdmin } from "@/lib/admin-auth";
import { DeckShell } from "@/components/deck/DeckShell";

/* Unlock state changes at class time and must never be served stale. */
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const session = getSession(slug);
  if (!session) return { title: "Session not found" };
  return {
    title: `Session ${session.number}: ${session.title} | DevTrackAcademy`,
    description: session.tagline,
  };
}

export default async function SessionPage({ params }: PageProps) {
  const { slug } = await params;
  const session = getSession(slug);

  // Unknown slug, or a session whose deck has not been authored yet.
  if (!session || session.slides === null) notFound();

  /* ---- Server-side gate ----------------------------------------
     The homepage hides locked sessions behind a lock badge, but that
     is only presentation. This check is what actually prevents someone
     opening /sessions/session-3 by guessing the URL before class. */
  const [unlocked, admin] = await Promise.all([
    getUnlockedSessions(),
    isAdmin(),
  ]);
  const isUnlocked = unlocked.includes(session.slug);

  if (!isUnlocked && !admin) {
    return (
      <main className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-6">
        <div className="w-full max-w-xl bg-white border-[8px] border-[#1B1F3B] shadow-[16px_16px_0_#FF6B35] p-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#FFC93C] border-[6px] border-[#1B1F3B] shadow-[6px_6px_0_#1B1F3B] mb-7">
            <Lock className="w-9 h-9 text-[#1B1F3B]" strokeWidth={2.5} />
          </div>

          <span className="chip-mono bg-[#1B1F3B] text-[#FFF8F0] text-[12px]">
            Session {String(session.number).padStart(2, "0")} · Locked
          </span>

          <h1 className="font-display text-[34px] leading-tight text-[#1B1F3B] mt-5">
            This session isn&apos;t open yet
          </h1>
          <p className="font-sans text-[17px] text-[#1B1F3B]/70 mt-3 leading-relaxed">
            {session.title} unlocks when the class begins. Check back then, or
            head back to see what&apos;s available now.
          </p>

          <Link
            href="/"
            className="tactile-btn tactile-btn-primary px-6 py-3 text-sm mt-8"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            All sessions
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Admins can preview a locked deck before class — labelled, so it is
          never mistaken for the student-facing state. */}
      {!isUnlocked && admin && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1100] bg-[#FFC93C] text-[#1B1F3B] border-4 border-[#1B1F3B] shadow-[5px_5px_0_#1B1F3B] px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2">
          <Lock className="w-4 h-4 shrink-0" />
          Admin preview · still locked for students
        </div>
      )}

      <DeckShell
        slides={session.slides}
        sessionNumber={session.number}
        sessionTitle={session.title}
      />
    </>
  );
}
