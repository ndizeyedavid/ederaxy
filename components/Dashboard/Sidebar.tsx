"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { me, type User } from "@/lib/api/auth";
import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  Captions,
  HandCoins,
  LayoutDashboard,
  Megaphone,
  MessageSquareWarningIcon,
  MessagesSquare,
  MonitorPlay,
  Settings,
  ShieldCheck,
  Wand2,
} from "lucide-react";

const primaryLinks = [
  {
    label: "Dashboard",
    href: "/dashboard/Teacher",
    icon: LayoutDashboard,
  },
  {
    label: "Content",
    href: "/dashboard/Teacher/content",
    icon: MonitorPlay,
  },
  {
    label: "Analytics",
    href: "/dashboard/Teacher/analytics",
    icon: BarChart3,
  },
  {
    label: "Messages",
    href: "/dashboard/Teacher/message",
    icon: MessagesSquare,
  },
  {
    label: "Customization",
    href: "/dashboard/Teacher/customization",
    icon: Wand2,
  },
  // {
  //   label: "Content detection",
  //   href: "/dashboard/Teacher/content-detection",
  //   icon: ShieldCheck,
  // },
  {
    label: "Earn",
    href: "/dashboard/Teacher/earn",
    icon: HandCoins,
  },
];

const secondaryLinks = [
  {
    label: "Settings",
    href: "/dashboard/Teacher/settings",
    icon: Settings,
  },
  {
    label: "Send feedback",
    href: "/dashboard/Teacher/feedback",
    icon: MessageSquareWarningIcon,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await me();
        if (!cancelled) setUser(res.user);
      } catch {
        if (!cancelled) setUser(null);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = useMemo(() => {
    if (!user) return "";
    const fromFullName = String(user.fullName ?? "").trim();
    if (fromFullName) return fromFullName;
    const first = String((user as any).firstName ?? "").trim();
    const last = String((user as any).lastName ?? "").trim();
    const joined = `${first} ${last}`.trim();
    return joined;
  }, [user]);

  const avatarSrc = useMemo(() => {
    const raw =
      (user?.profilePicture as string | null | undefined) ??
      ((user as any)?.avatarUrl as string | undefined) ??
      ((user as any)?.profilePictureUrl as string | undefined);
    const trimmed = String(raw ?? "").trim();

    if (!trimmed) return "/users/2.jpeg";

    if (/^https?:\/\//i.test(trimmed)) return trimmed;

    if (trimmed.startsWith("/")) {
      const apiBase =
        process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:8080";
      try {
        return new URL(trimmed, apiBase).href;
      } catch {
        return trimmed;
      }
    }

    return trimmed;
  }, [user]);

  const renderLinks = (links: typeof primaryLinks) => (
    <nav className="px-3 ">
      {links.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href;

        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium tracking-tight text-neutral-300 transition hover:bg-white/5 hover:text-white",
              isActive && "bg-white/10 text-white"
            )}
          >
            <Icon className="size-6 shrink-0" />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <aside
      className="fixed left-0 top-[66px] flex h-[calc(100vh-72px)] w-[260px] flex-col overflow-y-auto border-r border-white/10 bg-[#141517] text-white"
      id="sidebar"
    >
      <div className="pt-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div>
            <Image
              src={avatarSrc}
              alt={displayName ? `${displayName} avatar` : "Channel avatar"}
              width={96}
              height={96}
              unoptimized
              className="h-24 w-24 rounded-full border border-white/10 object-cover shadow-lg"
            />
          </div>
          <div>
            <p className="text-sm  text-white/50">Your channel</p>
            <p className="text-lg font-semibold">{displayName || "-"}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 pt-5">
        {renderLinks(primaryLinks)}

        <div className="mt-2 border-t border-white/10 pt-1">
          {renderLinks(secondaryLinks)}
        </div>
      </div>
    </aside>
  );
}
