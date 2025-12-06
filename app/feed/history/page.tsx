"use client";

import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Clock, History, Play, Router, Trash2 } from "lucide-react";

const historySections = [
  {
    label: "Continue watching",
    description: "Pick up where you left off across your lessons.",
    cta: "Resume all",
    items: [
      {
        id: "hist-1",
        title: "Building responsive layouts with CSS Grid",
        channel: "CodeLab Studio",
        avatar: "/users/1.jpg",
        thumbnail: "/videos/ai-vs-ml-thumb.jpg",
        progress: 62,
        watchedAt: "Watched 2 hours ago",
        duration: "18:47",
        href: "/watch?v=grid",
      },
      {
        id: "hist-2",
        title: "Exam prep: mastering simultaneous equations",
        channel: "TutorLine",
        avatar: "/users/2.jpeg",
        thumbnail: "/videos/ai-vs-ml-thumb.jpg",
        progress: 34,
        watchedAt: "Watched yesterday",
        duration: "12:04",
        href: "/watch?v=equations",
      },
    ],
  },
  {
    label: "Today",
    description: "Your freshest replays and class sessions.",
    items: [
      {
        id: "hist-3",
        title: "Ethics of AI: balancing innovation and safety",
        channel: "FutureNow Talks",
        avatar: "/users/3.jpeg",
        thumbnail: "/videos/ai-vs-ml-thumb.jpg",
        duration: "24:13",
        watchedAt: "Watched 3 hours ago",
        href: "/watch?v=ai-ethics",
      },
      {
        id: "hist-4",
        title: "Daily warm-up: calculus quick drills",
        channel: "Keisha Mbaye",
        avatar: "/users/3.jpeg",
        thumbnail: "/videos/ai-vs-ml-thumb.jpg",
        duration: "09:55",
        watchedAt: "Watched 6 hours ago",
        href: "/watch?v=calc-drills",
      },
    ],
  },
  {
    label: "Earlier this week",
    description: "Lessons you completed or reviewed recently.",
    items: [
      {
        id: "hist-5",
        title: "Storytelling through motion graphics",
        channel: "Creative Sparks",
        avatar: "/users/1.jpg",
        thumbnail: "/videos/ai-vs-ml-thumb.jpg",
        duration: "16:38",
        watchedAt: "Watched Tuesday",
        href: "/watch?v=motion-story",
      },
      {
        id: "hist-6",
        title: "Introduction to multi-variable statistics",
        channel: "Maths with Mei",
        avatar: "/users/3.jpeg",
        thumbnail: "/videos/ai-vs-ml-thumb.jpg",
        duration: "21:06",
        watchedAt: "Watched Monday",
        href: "/watch?v=stats",
      },
      {
        id: "hist-7",
        title: "Design critique: building a Figma dashboard",
        channel: "Design Loop",
        avatar: "/users/4.jpg",
        thumbnail: "/videos/ai-vs-ml-thumb.jpg",
        duration: "14:12",
        watchedAt: "Watched Monday",
        href: "/watch?v=figma-dash",
      },
    ],
  },
];

export default function HistoryPage() {
  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-[#0f0f0f] text-white">
      <Header />
      <div className="flex min-h-0 flex-1">
        <div className="fixed left-0 top-[72px] z-30 h-[calc(100vh-72px)]">
          <Sidebar />
        </div>

        <div className="ml-60 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
            <header className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tight">
                    Watch history
                  </h1>
                  <p className="text-sm text-neutral-400">
                    Review what you've learned, resume in-progress lessons, or
                    remove anything you no longer need.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="secondary"
                    className="rounded-full border border-[#262626] bg-[#161616] px-4 text-sm text-neutral-200 hover:bg-[#1d1d1d]"
                  >
                    <Trash2 className="size-4" />
                    Clear all history
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-3 border-b border-[#1f1f1f] px-5 py-4 shadow-[0_18px_36px_rgba(0,0,0,0.25)] md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-300">
                    <History className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      You're on a 19-day learning streak
                    </p>
                    <p className="text-xs text-neutral-400">
                      Friendly reminder: annotate the lessons you revisit often
                      to build your revision kit.
                    </p>
                  </div>
                </div>
              </div>
            </header>

            {historySections.map((section) => (
              <section key={section.label} className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      {section.label}
                    </h2>
                    <p className="text-xs text-neutral-500">
                      {section.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {section.items.map((item) => (
                    <article
                      key={item.id}
                      className="flex gap-2 rounded-lg shadow-[0_14px_28px_rgba(0,0,0,0.28)]  hover:bg-[#141414]"
                    >
                      <Link
                        href={item.href}
                        className="relative h-32 w-48 shrink-0 overflow-hidden rounded-2xl"
                      >
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 60vw, 192px"
                          className="object-cover transition duration-500 group-hover:scale-[1.02]"
                        />
                        <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-semibold">
                          {item.duration}
                        </span>
                        {typeof item.progress === "number" && (
                          <span className="absolute inset-x-0 bottom-0 h-1 rounded-full bg-black/40">
                            <span
                              className="block h-full rounded-full bg-emerald-400"
                              style={{ width: `${item.progress}%` }}
                            />
                          </span>
                        )}
                      </Link>

                      <div className="flex flex-1 flex-col gap-3 p-2">
                        <div className="space-y-1">
                          <Link
                            href={item.href}
                            className="line-clamp-2 text-sm font-semibold text-white transition hover:text-white/80"
                          >
                            {item.title}
                          </Link>
                          <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <div className="relative size-6 overflow-hidden rounded-full">
                              <Image
                                src={item.avatar}
                                alt={item.channel}
                                fill
                                sizes="24px"
                                className="object-cover"
                              />
                            </div>
                            <span>{item.channel}</span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-neutral-400">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3.5 text-emerald-400" />
                            {item.watchedAt}
                          </span>
                          {typeof item.progress === "number" && (
                            <span className="flex items-center gap-1 text-neutral-300">
                              <Play className="size-3.5" />
                              {item.progress}% watched
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
