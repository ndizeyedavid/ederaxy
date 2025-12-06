"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({
  showSpinner: false,
  minimum: 0.18,
  trickleSpeed: 140,
  speed: 350,
});

const isExternalUrl = (href: string) => {
  try {
    const url = new URL(href, window.location.href);
    return url.origin !== window.location.origin;
  } catch (error) {
    return false;
  }
};

export function NProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const doneTimer = useRef<number | null>(null);

  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return; // only left clicks
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;

      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      if (!href || href.startsWith("#")) return;
      if (anchor.target === "_blank") return;
      if (href.startsWith("mailto:") || href.startsWith("tel:")) return;
      if (isExternalUrl(href)) return;

      if (!NProgress.isStarted()) {
        NProgress.start();
      }
    };

    const handlePopState = () => {
      if (!NProgress.isStarted()) {
        NProgress.start();
      }
    };

    document.addEventListener("click", handleLinkClick, true);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.removeEventListener("click", handleLinkClick, true);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  useEffect(() => {
    if (!NProgress.isStarted()) {
      return;
    }

    if (doneTimer.current) {
      window.clearTimeout(doneTimer.current);
    }

    doneTimer.current = window.setTimeout(() => {
      NProgress.done(true);
    }, 120);

    return () => {
      if (doneTimer.current) {
        window.clearTimeout(doneTimer.current);
      }
    };
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      NProgress.start();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return null;
}
