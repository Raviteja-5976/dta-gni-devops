"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import { loginAction, type LoginState } from "./actions";

export function AdminLogin({ configured }: { configured: boolean }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {}
  );

  return (
    <main className="min-h-screen bg-[#FFF8F0] bg-[radial-gradient(rgba(27,31,59,0.14)_1.5px,transparent_1.6px)] [background-size:32px_32px] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border-[8px] border-[#1B1F3B] shadow-[16px_16px_0_#FF6B35] p-9">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FF6B35] border-[5px] border-[#1B1F3B] shadow-[5px_5px_0_#1B1F3B] mb-6">
          <KeyRound className="w-7 h-7 text-white" strokeWidth={2.5} />
        </div>

        <h1 className="font-display text-[30px] leading-tight text-[#1B1F3B]">
          Instructor access
        </h1>
        <p className="font-sans text-[15px] text-[#1B1F3B]/65 mt-2 leading-relaxed">
          Unlock sessions for the class. This page controls what students can
          open.
        </p>

        {!configured ? (
          <div className="mt-7 p-4 bg-[#FF5C7A]/15 border-4 border-[#FF5C7A] font-mono text-[13px] text-[#1B1F3B] leading-relaxed">
            <strong className="font-bold">ADMIN_PASSWORD is not set.</strong>
            <br />
            Add it to <code>.env.local</code> (or your host&apos;s environment
            variables) and restart the server.
          </div>
        ) : (
          <form action={formAction} className="mt-7 space-y-4">
            <label className="block">
              <span className="font-mono text-[12px] font-bold uppercase tracking-wider text-[#1B1F3B]/70">
                Password
              </span>
              <input
                type="password"
                name="password"
                autoFocus
                autoComplete="current-password"
                className="mt-2 w-full bg-[#FFF8F0] border-4 border-[#1B1F3B] px-4 py-3 font-mono text-[15px] text-[#1B1F3B] focus:outline-none focus:shadow-[5px_5px_0_#4EA8FF]"
              />
            </label>

            {state.error && (
              <p
                role="alert"
                className="font-mono text-[13px] font-bold text-[#FF5C7A] bg-[#FF5C7A]/10 border-2 border-[#FF5C7A] px-3 py-2"
              >
                {state.error}
              </p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="tactile-btn tactile-btn-primary w-full px-6 py-3 text-sm"
            >
              {pending ? "Checking…" : "Unlock admin"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
