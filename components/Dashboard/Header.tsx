"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, HelpCircle, Menu, Search, Video } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed z-50 flex w-full items-center justify-between gap-4 border-b border-white/10 bg-[#141517] px-4 py-3 text-white md:px-6">
      <div className="flex items-center gap-3 md:gap-4">
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full cursor-pointer transition hover:bg-white/10"
          aria-label="Toggle navigation"
        >
          <Menu className="size-5" />
        </button>
        <Link href="/dashboard/Teacher" className="flex items-center gap-2">
          <Image
            src="/logo/logo.png"
            alt="Logo"
            width={120}
            height={60}
            className="object-contain"
          />
        </Link>
      </div>

      <div className="flex min-w-0 flex-1 items-center justify-center">
        <form className="w-full max-w-xl">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-neutral-400">
              <Search className="size-4" />
            </span>
            <Input
              type="search"
              placeholder="Search across your channel"
              className="h-11 w-full rounded-full border-0 bg-black/60 pl-11 pr-4 text-sm text-white placeholder:text-neutral-500 focus-visible:border-white/20 focus-visible:ring-0"
            />
          </div>
        </form>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          type="button"
          className="flex size-10 items-center justify-center rounded-full  transition hover:border-white/20 hover:bg-white/10"
          aria-label="Help"
        >
          <HelpCircle className="size-6" />
        </button>
        <button
          type="button"
          className="relative flex size-10 items-center justify-center rounded-full  transition hover:border-white/20 hover:bg-white/10"
          aria-label="Notifications"
        >
          <Bell className="size-6" />
          <span className="absolute right-1 -top-0.5 inline-flex size-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-semibold text-black">
            3
          </span>
        </button>
        <Button
          type="button"
          className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10 md:flex"
        >
          <Video className="size-4" />
          Create
        </Button>
        <button
          type="button"
          className="hidden size-9 overflow-hidden rounded-full border border-white/10 bg-white/5 transition hover:border-white/20 hover:bg-white/10 md:block"
          aria-label="Account"
        >
          <Image
            src="/users/2.jpeg"
            alt="Profile"
            width={44}
            height={44}
            className="size-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}
