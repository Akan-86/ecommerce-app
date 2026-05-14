"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDisabled = useMemo(() => {
    return !email.trim() || !password.trim() || loading;
  }, [email, password, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fafafa] px-6 py-16 dark:bg-black">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.06),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />

      <div className="grid w-full max-w-6xl overflow-hidden rounded-[40px] border border-black/5 bg-white shadow-[0_60px_180px_-50px_rgba(0,0,0,0.18)] dark:border-white/10 dark:bg-neutral-950 lg:grid-cols-[1.05fr_0.95fr]">
        {/* LEFT PANEL */}
        <div className="relative hidden overflow-hidden bg-black p-14 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_40%)]" />

          <div className="relative z-10">
            <Link
              href="/"
              className="text-2xl font-semibold tracking-[-0.05em]"
            >
              Velora
            </Link>
          </div>

          <div className="relative z-10 max-w-md">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-white/40">
              Premium Commerce Experience
            </p>

            <h1 className="text-5xl font-semibold leading-[1.02] tracking-tight">
              Shop modern essentials with confidence.
            </h1>

            <p className="mt-8 text-lg leading-8 text-white/70">
              Secure authentication, fast checkout, and curated premium products
              designed for a modern lifestyle.
            </p>

            <div className="mt-12 space-y-5">
              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
                  <ShieldCheck size={20} />
                </div>

                <div>
                  <h3 className="font-medium">Secure Authentication</h3>
                  <p className="mt-1 text-sm leading-6 text-white/60">
                    Protected sign in powered by modern authentication flows.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
                <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black">
                  <Lock size={20} />
                </div>

                <div>
                  <h3 className="font-medium">Private & Reliable</h3>
                  <p className="mt-1 text-sm leading-6 text-white/60">
                    Your account and orders stay protected with enterprise-grade
                    security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex items-center justify-center px-6 py-14 sm:px-10 lg:px-14">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/10 bg-black/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600 dark:border-white/10 dark:bg-white/5 dark:text-neutral-300">
                Welcome Back
              </div>

              <h2 className="text-4xl font-semibold tracking-tight text-black dark:text-white">
                Sign in to continue.
              </h2>

              <p className="mt-4 text-[15px] leading-7 text-neutral-500 dark:text-neutral-300">
                Access your orders, wishlist, premium collections, and account
                settings.
              </p>
            </div>

            {error && (
              <div
                aria-live="polite"
                className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">
                  Email Address
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3 transition focus-within:border-black/20 focus-within:ring-2 focus-within:ring-black/5 dark:border-white/10 dark:bg-white/5">
                  <Mail size={18} className="text-neutral-400" />

                  <input
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoFocus
                    className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-black dark:text-white">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-neutral-500 transition hover:text-black dark:text-neutral-400 dark:hover:text-white"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-2xl border border-black/10 bg-black/[0.03] px-4 py-3 transition focus-within:border-black/20 focus-within:ring-2 focus-within:ring-black/5 dark:border-white/10 dark:bg-white/5">
                  <Lock size={18} className="text-neutral-400" />

                  <input
                    type="password"
                    placeholder="Enter your password"
                    required
                    className="w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-sm">
                <label className="flex items-center gap-3 text-neutral-500 dark:text-neutral-300">
                  <input
                    id="remember"
                    type="checkbox"
                    className="h-4 w-4 rounded border-black/20"
                  />
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={isDisabled}
                className="group flex w-full items-center justify-center rounded-2xl bg-black px-5 py-4 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
              >
                {loading ? (
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white dark:border-black/20 dark:border-t-black" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={16}
                      className="ml-2 transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 rounded-2xl border border-black/5 bg-neutral-100 p-5 dark:border-white/10 dark:bg-neutral-900">
              <p className="text-sm leading-7 text-neutral-500 dark:text-neutral-300">
                Don’t have an account?
                <Link
                  href="/register"
                  className="ml-2 font-medium text-black transition hover:opacity-70 dark:text-white"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
