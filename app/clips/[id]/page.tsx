"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type WheelEvent as ReactWheelEvent,
  type TouchEvent as ReactTouchEvent,
} from "react";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  MoreVertical,
  Pause,
  Repeat,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Volume2,
} from "lucide-react";
import Link from "next/link";
import ClipsContorolls from "@/components/Clips/ClipsContorolls";
import { AnimatePresence, motion } from "framer-motion";

const SWIPE_THRESHOLD = 60;
const TRANSITION_DURATION = 420;

const clipVariants = {
  enter: (direction: number) => ({
    y: direction >= 0 ? 80 : -80,
    opacity: 0,
    scale: 0.95,
  }),
  center: {
    y: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    y: direction >= 0 ? -80 : 80,
    opacity: 0,
    scale: 0.95,
  }),
};

export default function ClipsFeedPage() {
  const clips = useMemo(
    () => [
      {
        id: "clip-1",
        title: "You Guys Asked for This... #Shorts",
        caption: "▶️ Can We Make It Transparent?",
        channel: "PhoneRepairGuru",
        handle: "@PhoneRepairGuru",
        avatar: "/users/1.jpg",
        poster: "/videos/ai-vs-ml-thumb.jpg",
        stats: {
          likes: "72K",
          dislikes: "Dislike",
          comments: "493",
          remix: "Remix",
        },
      },
      {
        id: "clip-2",
        title: "Fastest Way to Fix a Cracked Screen",
        caption: "This hack can save you hundreds.",
        channel: "Repair Lab",
        handle: "@RepairLab",
        avatar: "/users/2.jpeg",
        poster: "/videos/ai-vs-ml-thumb.jpg",
        stats: {
          likes: "54K",
          dislikes: "Dislike",
          comments: "1.1K",
          remix: "Remix",
        },
      },
      {
        id: "clip-3",
        title: "AI Builds a PC in 30 Seconds",
        caption: "Would you let a robot pick your parts?",
        channel: "TechNova",
        handle: "@TechNova",
        avatar: "/users/3.jpeg",
        poster: "/videos/ai-vs-ml-thumb.jpg",
        stats: {
          likes: "98K",
          dislikes: "Dislike",
          comments: "2.3K",
          remix: "Remix",
        },
      },
      {
        id: "clip-4",
        title: "This Algorithm Solves Any Maze",
        caption: "Graph theory magic explained in 60 seconds",
        channel: "AlgoDaily",
        handle: "@AlgoDaily",
        avatar: "/users/4.jpg",
        poster: "/videos/ai-vs-ml-thumb.jpg",
        stats: {
          likes: "81K",
          dislikes: "Dislike",
          comments: "742",
          remix: "Remix",
        },
      },
    ],
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const isTransitioningRef = useRef(false);
  const touchStartRef = useRef<number | null>(null);
  const interactionContainerRef = useRef<HTMLDivElement | null>(null);
  const [transitionDirection, setTransitionDirection] = useState<-1 | 0 | 1>(0);

  const slideTo = useCallback(
    (direction: "next" | "prev") => {
      if (isTransitioningRef.current) return;

      let hasChanged = false;
      setActiveIndex((prev) => {
        const nextIndex =
          direction === "next"
            ? Math.min(prev + 1, clips.length - 1)
            : Math.max(prev - 1, 0);

        if (nextIndex !== prev) {
          hasChanged = true;
          return nextIndex;
        }
        return prev;
      });

      if (!hasChanged) return;

      setTransitionDirection(direction === "next" ? 1 : -1);

      isTransitioningRef.current = true;
      window.setTimeout(() => {
        isTransitioningRef.current = false;
        setTransitionDirection(0);
      }, TRANSITION_DURATION);
    },
    [clips.length]
  );

  const handleNext = useCallback(() => {
    slideTo("next");
  }, [slideTo]);

  const handlePrev = useCallback(() => {
    slideTo("prev");
  }, [slideTo]);

  const handleWheel = useCallback(
    (event: ReactWheelEvent<HTMLDivElement>) => {
      if (Math.abs(event.deltaY) < 12) return;
      event.preventDefault();
      if (event.deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    },
    [handleNext, handlePrev]
  );

  const handleTouchStart = useCallback(
    (event: ReactTouchEvent<HTMLDivElement>) => {
      touchStartRef.current = event.touches[0]?.clientY ?? null;
    },
    []
  );

  const handleTouchEnd = useCallback(
    (event: ReactTouchEvent<HTMLDivElement>) => {
      if (touchStartRef.current === null) return;
      const endY = event.changedTouches[0]?.clientY ?? touchStartRef.current;
      const distance = touchStartRef.current - endY;
      touchStartRef.current = null;

      if (Math.abs(distance) < SWIPE_THRESHOLD) return;
      if (distance > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    },
    [handleNext, handlePrev]
  );

  useEffect(() => {
    const container = interactionContainerRef.current;
    if (!container) return;

    const preventDefault = (event: WheelEvent) => event.preventDefault();
    container.addEventListener("wheel", preventDefault, { passive: false });
    return () => {
      container.removeEventListener("wheel", preventDefault);
    };
  }, []);

  useEffect(() => {
    const handleKeys = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        handlePrev();
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeys);
    return () => {
      window.removeEventListener("keydown", handleKeys);
    };
  }, [handleNext, handlePrev]);

  const activeClip = clips[activeIndex];

  const actionButtons = useMemo(
    () => [
      { id: "like", icon: ThumbsUp, label: activeClip.stats.likes },
      { id: "dislike", icon: ThumbsDown, label: activeClip.stats.dislikes },
      { id: "share", icon: Share2, label: "Share" },
    ],
    [activeClip.stats]
  );

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-[#0f0f0f] text-white">
      <Header />
      <div className="flex min-h-0 flex-1">
        <div className="fixed left-0 top-[72px] z-30 h-[calc(100vh-72px)]">
          <Sidebar />
        </div>

        <div className="ml-60 flex-1 overflow-y-hidden">
          <div
            ref={interactionContainerRef}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="mx-auto flex h-[89vh] w-full items-end justify-between gap-10 px-6 py-2"
          >
            {/* Video details */}
            <AnimatePresence
              mode="wait"
              initial={false}
              custom={transitionDirection}
            >
              <motion.div
                key={activeClip.id}
                custom={transitionDirection}
                variants={clipVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: TRANSITION_DURATION / 1000,
                  ease: [0.33, 1, 0.68, 1],
                }}
              >
                <div className="inset-x-0 bottom-0 p-4 flex-1/3">
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 overflow-hidden rounded-full border border-white/10">
                        <Image
                          src={activeClip.avatar}
                          alt={activeClip.channel}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <Link
                          href="/@mellow"
                          className="text-lg font-semibold hover:text-white"
                        >
                          {activeClip.handle}
                        </Link>
                      </div>
                      <Button className="rounded-full bg-white px-4 py-0 text-xs font-semibold text-black hover:bg-white/90">
                        Subscribe
                      </Button>
                    </div>

                    <p className="mt-1 text-xl font-bold text-white line-clamp-2 truncate">
                      {activeClip.title}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <section className="flex items-end gap-3 flex-1">
              <AnimatePresence
                mode="wait"
                initial={false}
                custom={transitionDirection}
              >
                <motion.div
                  key={activeClip.id}
                  custom={transitionDirection}
                  variants={clipVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: TRANSITION_DURATION / 1000,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                  className="relative aspect-9/15 w-[min(360px,80vw)] max-w-sm overflow-hidden rounded-[28px] bg-black shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
                >
                  <Image
                    src={activeClip.poster}
                    alt={activeClip.title}
                    fill
                    sizes="(max-width: 640px) 80vw, 360px"
                    className="object-cover"
                  />

                  <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
                    <div className="flex items-center gap-2">
                      <button className="group flex size-11 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/90">
                        <Pause className="size-5" />
                      </button>
                      <button className="group flex size-11 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/90">
                        <Volume2 className="size-5" />
                      </button>
                    </div>
                    <button className="flex size-10 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/90">
                      <MoreVertical className="size-5" />
                    </button>
                  </div>
                </motion.div>
                {/* options */}
                <div className="flex flex-col gap-5">
                  {actionButtons.map(({ id, icon: Icon, label }) => (
                    <div key={id} className="flex flex-col items-center gap-2 ">
                      <button className="rounded-full bg-[#1d1d1d] p-3 text-neutral-200 transition hover:bg-[#2a2a2a] hover:text-white">
                        <Icon className="size-6" />
                      </button>
                      <span className="text-xs font-medium">{label}</span>
                    </div>
                  ))}
                </div>
              </AnimatePresence>
            </section>

            <div className="flex-1/2">
              <ClipsContorolls
                onPrev={handlePrev}
                onNext={handleNext}
                disabledPrev={activeIndex === 0}
                disabledNext={activeIndex === clips.length - 1}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
