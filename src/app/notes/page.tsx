import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { getNotes } from "@/lib/notes";

/* Notes are published live during class. */
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notes & links | DevTrackAcademy",
};

const dateFmt = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <main className="min-h-screen bg-[#FFF8F0] bg-[radial-gradient(rgba(27,31,59,0.14)_1.5px,transparent_1.6px)] [background-size:32px_32px]">
      <div className="max-w-4xl mx-auto px-6 py-14">
        <header className="mb-10">
          <Link href="/" className="tactile-btn tactile-btn-secondary px-4 py-2 text-xs">
            <ArrowLeft className="w-4 h-4 shrink-0" />
            Homepage
          </Link>
          <h1 className="font-display text-[clamp(36px,6vw,56px)] leading-tight text-[#1B1F3B] tracking-tight mt-8">
            Notes &amp; <span className="marker">links</span>
          </h1>
          <p className="font-sans text-[17px] text-[#1B1F3B]/70 mt-4 max-w-2xl leading-relaxed">
            Resources, links and announcements from your instructor. Newest first.
          </p>
        </header>

        {notes.length === 0 ? (
          <p className="p-6 bg-[#FCF6EE] border-[6px] border-[#1B1F3B] shadow-[6px_6px_0_rgba(27,31,59,0.28)] font-mono text-[14px] text-[#1B1F3B]/60">
            Nothing posted yet — check back during class.
          </p>
        ) : (
          <ul className="space-y-6">
            {notes.map((note) => (
              <li
                key={note.id}
                className="p-6 bg-white border-[6px] border-[#1B1F3B] shadow-[8px_8px_0_#1B1F3B]"
              >
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#1B1F3B]/45">
                  {dateFmt.format(new Date(note.created_at))}
                </p>
                <h2 className="font-display text-[22px] leading-tight text-[#1B1F3B] mt-2 break-words">
                  {note.title}
                </h2>
                {note.body && (
                  <p className="font-sans text-[15px] text-[#1B1F3B]/75 mt-3 leading-relaxed whitespace-pre-wrap break-words">
                    {note.body}
                  </p>
                )}
                {note.url && (
                  <a
                    href={note.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 font-mono text-[13px] font-bold text-[#FF6B35] underline underline-offset-4 break-all hover:text-[#1B1F3B]"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    {note.url}
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
