"use client";

import type { ReactNode } from "react";

import Header from "@/components/Dashboard/Header";
import Sidebar from "@/components/Dashboard/Sidebar";
import { TeacherContentProvider } from "@/components/TeacherContent/TeacherContentProvider";
import { me } from "@/lib/api/auth";
import { clearAccessToken } from "@/lib/api/token";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TeacherDashboardLayoutProps {
  children: ReactNode;
}

export default function TeacherDashboardLayout({
  children,
}: TeacherDashboardLayoutProps) {
  const router = useRouter();
  const [isCheckingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await me();
        if (!cancelled) setCheckingAuth(false);
      } catch {
        clearAccessToken();
        if (!cancelled) router.replace("/dashboard/auth/login");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0d0f14] text-white">
        <p className="text-sm text-white/70">Checking session...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0d0f14] text-white">
      <Header />
      <div className="flex flex-1 overflow-hidden pt-[66px]">
        <div className="w-[260px] shrink-0">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto bg-[#141517] px-12  py-6">
          <TeacherContentProvider>
            <div className="mx-auto w-full max-w-7xl space-y-6">{children}</div>
          </TeacherContentProvider>
        </main>
      </div>
    </div>
  );
}
