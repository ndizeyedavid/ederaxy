import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, LogIn, ScanLine, ShieldCheck, Users } from "lucide-react";

const BACKGROUND_IMAGE =
  "/background/ChatGPT Image Dec 6, 2025, 06_48_18 PM.png";
const PRIMARY_ILLUSTRATION = "/illustrations/all.png";
const SUPPORTING_ILLUSTRATIONS = [
  "/illustrations/peron-1.png",
  "/illustrations/person-2.png",
  "/illustrations/person-3.png",
  "/illustrations/person-4.png",
];

export default function AuthPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080b17] text-white">
      <div className="absolute inset-0">
        <Image
          src={BACKGROUND_IMAGE}
          alt="Nebula background"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-[#05060d]/40 via-[#05060d]/55 to-[#05060d]/72" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_70%)]" />
      </div>
      <Image
        src="/logo/logo.png"
        alt="Logo"
        width={170}
        height={170}
        className="absolute top-5 left-10 w-[170px]"
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-2">
        <div className="w-full max-w-5xl mt-5 rounded-lg bg-black/20 shadow-[0_35px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
          <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <section className="flex flex-col gap-8 border-b border-white/5 px-8 py-10 md:border-b-0 md:border-r">
              <div>
                <div>
                  <h1 className="text-3xl font-semibold leading-tight md:text-[34px]">
                    Welcome back
                  </h1>
                  <p className="text-sm leading-relaxed text-neutral-300 md:text-base">
                    We are excited to see you again!
                  </p>
                </div>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@studentmail.com"
                      className="h-12 rounded-xl border-white/10 bg-black/40 pr-12 text-sm text-white focus-visible:ring-0 placeholder:text-neutral-500"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-500">
                      <Users className="size-4" />
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-[0.28em] text-neutral-400"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="h-12 rounded-xl border-white/10 bg-black/40 focus-visible:ring-0 pr-12 text-sm text-white placeholder:text-neutral-500"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-neutral-500">
                      <ShieldCheck className="size-4" />
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 text-xs text-neutral-400 sm:flex-row sm:items-center sm:justify-between">
                  <label className="flex items-center gap-2 text-sm text-neutral-300">
                    <input
                      type="checkbox"
                      className="size-4 rounded border border-white/20 bg-black/40 accent-emerald-500"
                    />
                    Remember me
                  </label>
                  <Link
                    href="#"
                    className="text-sm font-semibold text-emerald-200 transition hover:text-emerald-100"
                  >
                    Forgot your password?
                  </Link>
                </div>

                <div>
                  <Button className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 text-sm font-semibold text-black transition hover:bg-emerald-400">
                    Continue
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </form>

              <p className="text-sm text-neutral-400">
                Need an account?{" "}
                <Link
                  href="#"
                  className="font-semibold text-emerald-200 transition hover:text-emerald-100"
                >
                  Register
                </Link>
              </p>
            </section>

            <aside className="relative hidden flex-col gap-6  bg-white/[0.07] px-8 py-10 md:flex">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_65%)]" />

              <div className="relative z-10 flex items-center justify-center">
                <Image
                  src={SUPPORTING_ILLUSTRATIONS[1]}
                  alt="Login illustration"
                  width={100}
                  height={100}
                  className="w-[160px]"
                />
              </div>

              <h3 className="text-lg text-center font-semibold">
                Ambitious to ease up your studying in no time
              </h3>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
