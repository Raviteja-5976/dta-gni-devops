"use client";

import { useActionState, useEffect, useRef } from "react";
import { Plus } from "lucide-react";
import { addNoteAction, type NoteFormState } from "./actions";

const field =
  "mt-2 w-full bg-[#FFF8F0] border-4 border-[#1B1F3B] px-4 py-3 font-mono text-[14px] text-[#1B1F3B] focus:outline-none focus:shadow-[5px_5px_0_#4EA8FF]";
const label =
  "font-mono text-[12px] font-bold uppercase tracking-wider text-[#1B1F3B]/70";

export function NoteForm() {
  const [state, formAction, pending] = useActionState<NoteFormState, FormData>(
    addNoteAction,
    {}
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Clear the form after a successful publish, ready for the next note.
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="p-6 bg-white border-[6px] border-[#1B1F3B] shadow-[8px_8px_0_#4EA8FF] space-y-4"
    >
      <label className="block">
        <span className={label}>Title *</span>
        <input name="title" required maxLength={200} className={field} placeholder="Docker install guide" />
      </label>

      <label className="block">
        <span className={label}>Link (optional)</span>
        <input name="url" inputMode="url" className={field} placeholder="https://docs.docker.com/get-docker/" />
      </label>

      <label className="block">
        <span className={label}>Details (optional)</span>
        <textarea name="body" rows={3} maxLength={5000} className={field} placeholder="Install before Session 2." />
      </label>

      {state.error && (
        <p role="alert" className="font-mono text-[13px] font-bold text-[#FF5C7A] bg-[#FF5C7A]/10 border-2 border-[#FF5C7A] px-3 py-2">
          {state.error}
        </p>
      )}

      <button type="submit" disabled={pending} className="tactile-btn tactile-btn-primary px-5 py-2.5 text-xs">
        <Plus className="w-4 h-4 shrink-0" />
        {pending ? "Publishing…" : "Publish note"}
      </button>
    </form>
  );
}
