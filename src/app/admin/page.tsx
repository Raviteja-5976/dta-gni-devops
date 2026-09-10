import Link from "next/link";
import type { Metadata } from "next";
import { Lock, Unlock, ArrowLeft, LogOut, TriangleAlert } from "lucide-react";
import { SESSIONS } from "@/lib/sessions";
import {
  getUnlockedSessions,
  storageMode,
  supabaseConfigProblem,
} from "@/lib/store";
import { isAdmin, isAdminConfigured } from "@/lib/admin-auth";
import { AdminLogin } from "./AdminLogin";
import { logoutAction, toggleSessionAction } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Instructor access | DevTrackAcademy",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!(await isAdmin())) {
    return <AdminLogin configured={isAdminConfigured()} />;
  }

  const [unlocked, mode, configProblem] = [
    await getUnlockedSessions(true),
    storageMode(),
    supabaseConfigProblem(),
  ];

  return (
    <main className="min-h-screen bg-[#FFF8F0] bg-[radial-gradient(rgba(27,31,59,0.14)_1.5px,transparent_1.6px)] [background-size:32px_32px]">
      <div className="max-w-4xl mx-auto px-6 py-14">
        {/* ---------- Header ---------- */}
        <header className="flex items-start justify-between gap-6 flex-wrap mb-10">
          <div>
            <span className="chip-mono bg-[#1B1F3B] text-[#FFF8F0] text-[12px]">
              Instructor
            </span>
            <h1 className="font-display text-[42px] leading-tight text-[#1B1F3B] tracking-tight mt-4">
              Session access
            </h1>
            <p className="font-sans text-[16px] text-[#1B1F3B]/70 mt-2 max-w-xl leading-relaxed">
              Activate a session to make it open on the homepage. Locked
              sessions can&apos;t be opened by students even with a direct link.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="tactile-btn tactile-btn-secondary px-4 py-2 text-xs"
            >
              <ArrowLeft className="w-4 h-4 shrink-0" />
              Homepage
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="tactile-btn tactile-btn-coral px-4 py-2 text-xs"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Sign out
              </button>
            </form>
          </div>
        </header>

        {/* ---------- Supabase misconfiguration ----------
            Half-filled credentials fall back to local storage rather than
            crashing, so say plainly why Supabase is not in use. */}
        {configProblem && (
          <div className="mb-8 p-5 bg-[#FF5C7A] border-[6px] border-[#1B1F3B] shadow-[8px_8px_0_#1B1F3B] flex gap-4">
            <TriangleAlert className="w-6 h-6 shrink-0 text-white mt-0.5" />
            <div className="font-sans text-[15px] text-white leading-relaxed">
              <strong className="font-bold">Supabase is not connected.</strong>{" "}
              {configProblem} Until then, unlocks are stored{" "}
              {mode === "file" ? "in a local file" : "in memory"}.
            </div>
          </div>
        )}

        {/* ---------- Storage warning ----------
            Memory mode means unlocks vanish on restart and aren't shared
            between serverless instances — the instructor must know. */}
        {mode === "memory" && (
          <div className="mb-8 p-5 bg-[#FFC93C] border-[6px] border-[#1B1F3B] shadow-[8px_8px_0_#1B1F3B] flex gap-4">
            <TriangleAlert className="w-6 h-6 shrink-0 text-[#1B1F3B] mt-0.5" />
            <div className="font-sans text-[15px] text-[#1B1F3B] leading-relaxed">
              <strong className="font-bold">Temporary storage in use.</strong>{" "}
              Supabase isn&apos;t configured and the filesystem isn&apos;t
              writable, so unlocks will be lost on restart and won&apos;t apply
              across serverless instances. Run{" "}
              <code className="font-mono text-[13px]">supabase/schema.sql</code>,
              then set{" "}
              <code className="font-mono text-[13px]">SUPABASE_URL</code> and{" "}
              <code className="font-mono text-[13px]">
                SUPABASE_SERVICE_ROLE_KEY
              </code>
              .
            </div>
          </div>
        )}

        {/* ---------- Session toggles ---------- */}
        <ul className="space-y-5">
          {SESSIONS.map((session) => {
            const isUnlocked = unlocked.includes(session.slug);
            const authored = session.slides !== null;

            return (
              <li
                key={session.slug}
                className={`p-6 border-[6px] border-[#1B1F3B] flex items-center justify-between gap-6 ${
                  isUnlocked
                    ? "bg-white shadow-[8px_8px_0_#6EE7B7]"
                    : "bg-[#FCF6EE] shadow-[8px_8px_0_#1B1F3B]"
                }`}
              >
                <div className="flex items-start gap-5 min-w-0 flex-1">
                  <span
                    className={`font-display text-[24px] leading-none px-3.5 py-3 border-4 border-[#1B1F3B] shrink-0 ${
                      isUnlocked
                        ? "bg-[#6EE7B7] text-[#1B1F3B]"
                        : "bg-[#F5EBE0] text-[#1B1F3B]/60"
                    }`}
                  >
                    {String(session.number).padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <h2 className="font-display text-[19px] leading-tight text-[#1B1F3B]">
                      {session.title}
                    </h2>
                    <p className="font-mono text-[12px] uppercase tracking-wider mt-2 text-[#1B1F3B]/55">
                      {isUnlocked ? "Open to students" : "Hidden from students"}
                      {!authored && " · deck not written yet"}
                    </p>
                  </div>
                </div>

                <form action={toggleSessionAction} className="shrink-0">
                  <input type="hidden" name="slug" value={session.slug} />
                  <input
                    type="hidden"
                    name="next"
                    value={(!isUnlocked).toString()}
                  />
                  <button
                    type="submit"
                    className={`tactile-btn px-5 py-2.5 text-xs ${
                      isUnlocked ? "tactile-btn-secondary" : "tactile-btn-mint"
                    }`}
                  >
                    {isUnlocked ? (
                      <>
                        <Lock className="w-4 h-4 shrink-0" />
                        Lock
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4 shrink-0" />
                        Activate
                      </>
                    )}
                  </button>
                </form>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 font-mono text-[12px] text-[#1B1F3B]/45 uppercase tracking-wider">
          Storage: {mode} · {unlocked.length} of {SESSIONS.length} active
        </p>
      </div>
    </main>
  );
}
