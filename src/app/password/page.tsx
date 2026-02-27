"use client";

import { useActionState } from "react";
import { verifyPassword } from "@/lib/actions/password-gate";

export default function PasswordPage() {
  const [state, formAction, isPending] = useActionState(verifyPassword, null);

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-xl font-bold text-white shadow-lg">
            H
          </div>
          <h1 className="text-xl font-semibold text-slate-900">HiringLens</h1>
          <p className="mt-1 text-sm text-slate-500">
            Enter the password to continue
          </p>
        </div>

        {/* Password Form */}
        <form action={formAction}>
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoFocus
              required
              placeholder="Enter site password"
              className="mb-4 block w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />

            {state?.error && (
              <p className="mb-3 text-sm text-red-600">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-50"
            >
              {isPending ? "Checking…" : "Enter"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          This site is currently in early access.
        </p>
      </div>
    </div>
  );
}
