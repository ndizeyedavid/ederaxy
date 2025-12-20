"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bell,
  ChevronDown,
  FileText,
  HelpCircle,
  Menu,
  Scissors,
  Search,
  Video,
} from "lucide-react";
import { ApiError } from "@/lib/api/client";
import { me } from "@/lib/api/auth";

function resolveBackendUrl(rawUrl?: string | null) {
  if (!rawUrl) return undefined;
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://"))
    return rawUrl;

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
    "http://localhost:8080";

  return `${apiBaseUrl}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
}

export default function Header() {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const createMenuRef = useRef<HTMLDivElement | null>(null);
  const [user, setUser] = useState<{ profilePicture?: string | null } | null>(
    null
  );
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const u = await me();
        if (!cancelled) setUser(u);
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiError && err.statusCode === 401) {
            // Not logged in; ignore silently
            setUserError(null);
          } else {
            setUserError(
              err instanceof Error ? err.message : "Failed to load user"
            );
          }
        }
      } finally {
        if (!cancelled) setUserLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const profileSrc = useMemo(() => {
    if (userLoading || userError) return undefined;
    // @ts-ignore
    const raw = user?.user?.profilePicture;
    // console.log(user.user);
    const resolved = resolveBackendUrl(raw);

    return resolved;
  }, [user, userLoading, userError]);

  useEffect(() => {
    if (!isCreateOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!createMenuRef.current) return;
      if (
        event.target instanceof Node &&
        !createMenuRef.current.contains(event.target)
      ) {
        setCreateOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCreateOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCreateOpen]);

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
        <div className="relative hidden md:block" ref={createMenuRef}>
          <Button
            type="button"
            onClick={() => setCreateOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
            aria-haspopup="menu"
            aria-expanded={isCreateOpen}
          >
            <Video className="size-4" />
            Create
            <ChevronDown className="size-4 text-white/70" />
          </Button>

          {isCreateOpen ? (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-40  overflow-hidden rounded-2xl border border-white/10 bg-[#14161d] shadow-[0_20px_60px_rgba(0,0,0,0.55)]"
            >
              <Link
                role="menuitem"
                href="/dashboard/Teacher/content/upload-video"
                onClick={() => setCreateOpen(false)}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                <Video className="size-4" />
                Upload video
              </Link>
              <Link
                role="menuitem"
                href="/dashboard/Teacher/content/clips"
                onClick={() => setCreateOpen(false)}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                <Scissors className="size-4" />
                Upload Clip
              </Link>
              <Link
                role="menuitem"
                href="/dashboard/Teacher/content/study-material"
                onClick={() => setCreateOpen(false)}
                className="flex w-full items-center gap-3 px-4 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/5 hover:text-white"
              >
                <FileText className="size-4" />
                Study Material
              </Link>
            </div>
          ) : null}
        </div>
        <button
          type="button"
          className="hidden size-9 overflow-hidden rounded-full border border-white/10 bg-white/5 transition hover:border-white/20 hover:bg-white/10 md:block"
          aria-label="Account"
        >
          {profileSrc ? (
            <Image
              src={profileSrc}
              alt="Profile"
              width={44}
              height={44}
              className="size-full object-cover"
              unoptimized
              onError={(e) => {
                // Fallback to default avatar on image load error
                const target = e.target as HTMLImageElement;
                target.src = "/users/default-avatar.svg";
              }}
            />
          ) : (
            <Image
              src="/users/default-avatar.svg"
              alt="Profile"
              width={44}
              height={44}
              className="size-full object-cover"
              unoptimized
            />
          )}
        </button>
      </div>
    </header>
  );
}
