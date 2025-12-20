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
      <div className="relative z-10 flex h-[72vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#14161d] shadow-[0_50px_140px_rgba(0,0,0,0.65)] md:h-[580px]">
        <header className="shrink-0 space-y-2 border-b border-white/5 px-6 py-5 text-white">
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle ? (
            <p className="text-sm text-white/50">{subtitle}</p>
          ) : null}
        </header>
        <div className="modal-scroll min-h-0 flex-1 overflow-y-auto px-6 py-5 text-white">
          {children}
        </div>
        {footer ? (
          <footer className="shrink-0 flex items-center  justify-end gap-3 border-t border-white/5 px-6 py-5">
            {footer}
          </footer>
        ) : null}
      </div>
      <style jsx global>{`
        .modal-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.22) transparent;
        }

        .modal-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .modal-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .modal-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.18);
          border-radius: 999px;
          border: 2px solid transparent;
          background-clip: content-box;
        }

        .modal-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(255, 255, 255, 0.28);
        }
      `}</style>
    </div>
  );
}
