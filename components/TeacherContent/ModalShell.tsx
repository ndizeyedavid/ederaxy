"use client";

import type { ReactNode } from "react";

interface ModalShellProps {
  open: boolean;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
}

export function ModalShell({
  open,
  title,
  subtitle,
  children,
  footer,
  onClose,
}: ModalShellProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#14161d] shadow-[0_50px_140px_rgba(0,0,0,0.65)]">
        <header className="space-y-2 border-b border-white/5 px-6 py-5 text-white">
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle ? (
            <p className="text-sm text-white/50">{subtitle}</p>
          ) : null}
        </header>
        <div className="px-6 py-5 text-white">{children}</div>
        {footer ? (
          <footer className="flex items-center justify-end gap-3 border-t border-white/5 px-6 py-5">
            {footer}
          </footer>
        ) : null}
      </div>
    </div>
  );
}
