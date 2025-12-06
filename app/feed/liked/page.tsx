"use client";

import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heart, ListFilter, Play, PlayCircle, Sparkles } from "lucide-react";
import { useMemo } from "react";

const likedVideos = [
  {
    id: "liked-video-1",
    title: "Mastering persuasive essays in 5 key moves",
    channel: "Lina Fernandez",
    avatar: "/users/1.jpg",
    thumbnail: "/videos/ai-vs-ml-thumb.jpg",
    duration: "18:42",
    likedAt: "Liked 2 days ago",
    level: "Upper Secondary",
    views: "12.4K views",
    href: "/watch?v=essay-mastery",
    tags: ["Exam prep", "Languages"],
  },
  {
    id: "liked-video-2",
    title: "Crash course: JavaScript promises for beginners",
    channel: "Marcus Patel",
    avatar: "/users/2.jpeg",
    thumbnail: "/videos/ai-vs-ml-thumb.jpg",
    duration: "14:06",
    likedAt: "Liked yesterday",
    level: "Tertiary",
    views: "9.1K views",
    href: "/watch?v=promises",
    tags: ["Coding", "Revision"],
  },
  {
    id: "liked-video-3",
    title: "Visualising complex numbers with animations",
    channel: "Dr. Mei Wong",
    avatar: "/users/3.jpeg",
    thumbnail: "/videos/ai-vs-ml-thumb.jpg",
    duration: "21:18",
    likedAt: "Liked 5 days ago",
    level: "Senior Secondary",
    views: "7.6K views",
    href: "/watch?v=complex-visuals",
    tags: ["STEM"],
  },
  {
    id: "liked-video-4",
    title: "Design critique: crafting a compelling dashboard",
    channel: "Creative Sparks",
    avatar: "/users/4.jpg",
    thumbnail: "/videos/ai-vs-ml-thumb.jpg",
    duration: "25:03",
    likedAt: "Liked last week",
    level: "All levels",
    views: "15.2K views",
    href: "/watch?v=dashboard-design",
    tags: ["Creative", "Portfolio"],
  },
];

const likedShorts = [
  {
    id: "liked-short-1",
    title: "One-minute pitch framework",
    channel: "Jamal Everett",
    thumbnail: "/videos/ai-vs-ml-thumb.jpg",
    duration: "0:58",
    likedAt: "Liked today",
    href: "/clips/pitch-framework",
  },
  {
    id: "liked-short-2",
    title: "Study hack: colour-coding formulas",
    channel: "Study with Keisha",
    thumbnail: "/videos/ai-vs-ml-thumb.jpg",
    duration: "0:47",
    likedAt: "Liked yesterday",
    href: "/clips/study-hack",
  },
  {
    id: "liked-short-3",
    title: "Daily mindfulness reset",
    channel: "Lina Fernandez",
    thumbnail: "/videos/ai-vs-ml-thumb.jpg",
    duration: "1:02",
    likedAt: "Liked 3 days ago",
    href: "/clips/mindfulness",
  },
  {
    id: "liked-short-4",
    title: "Quick algebra tip: intercepts",
    channel: "Maths with Mei",
    thumbnail: "/videos/ai-vs-ml-thumb.jpg",
    duration: "0:53",
    likedAt: "Liked last week",
    href: "/clips/algebra-tip",
  },
];

export default function LikeVideosPage() {
  const quickFilters = useMemo(
    () => ["All", "Videos", "Shorts", "STEM", "Creative", "Exam prep"],
    []
  );

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-[#0f0f0f] text-white">
      <Header />
      <div className="flex min-h-0 flex-1">
        <div className="fixed left-0 top-[72px] z-30 h-[calc(100vh-72px)]">
          <Sidebar />
        </div>

        <div className="ml-60 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
            <section className="rounded-3xl bg-[#111111] px-6 py-7 shadow-[0_22px_60px_rgba(0,0,0,0.28)]">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-3">
                  <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight">
                    <span>Your liked videos & clips</span>
                    <Heart className="size-7 text-green-400" />
                  </h1>
                  <p className="max-w-2xl text-sm text-neutral-400">
                    Revisit the lessons that inspired you most. Resume long-form
                    sessions, binge short clips, or sort by subject to keep your
                    streak going.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-neutral-400">
                    <span className="rounded-full border border-[#242424] px-3 py-1">
                      {likedVideos.length} videos
                    </span>
                    <span className="rounded-full border border-[#242424] px-3 py-1">
                      {likedShorts.length} shorts
                    </span>
                  </div>
                </div>
                <div className="flex w-full flex-col gap-3 md:w-auto">
                  <div className="flex items-center gap-2 rounded-full border border-[#252525] bg-[#191919] px-4">
                    <ListFilter className="size-4 text-neutral-500" />
                    <Input
                      placeholder="Filter your liked list"
                      className="h-11 border-0 bg-transparent! text-sm text-white placeholder:text-neutral-500 focus-visible:ring-0"
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickFilters.map((filter) => (
                      <button
                        key={filter}
                        className="rounded-full border border-[#252525] bg-[#151515] px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-emerald-500/50 hover:text-white"
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Liked videos
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Long-form lessons and workshops you plan to revisit.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {likedVideos.map((video) => (
                  <article
                    key={video.id}
                    className=" flex gap-2 rounded-xl  p-0 shadow-[0_18px_40px_rgba(0,0,0,0.3)]  hover:bg-[#141414]"
                  >
                    <Link
                      href={video.href}
                      className="relative h-36 w-48 shrink-0 overflow-hidden rounded-2xl"
                    >
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        sizes="(max-width: 768px) 60vw, 192px"
                        className="object-cover"
                      />
                      <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-2 py-0.5 text-[10px] font-semibold">
                        {video.duration}
                      </span>
                    </Link>

                    <div className="flex flex-1 flex-col gap-3 p-2">
                      <div className="space-y-1.5">
                        <Link
                          href={video.href}
                          className="line-clamp-2 text-sm font-semibold text-white transition hover:text-white/80"
                        >
                          {video.title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                          <Link href="/@mellow" className="hover:text-white">
                            {video.channel}
                          </Link>
                          <span className="text-neutral-600">•</span>
                          <span>{video.level}</span>
                          <span className="text-neutral-600">•</span>
                          <span>{video.views}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-400">
                        <span>{video.likedAt}</span>
                        {video.tags.slice(1).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-[#252525] px-2 py-0.5 text-[10px] text-neutral-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto flex items-center gap-3">
                        <Button
                          asChild
                          className="rounded-full bg-white px-4 text-xs font-semibold text-black transition hover:bg-white/90"
                        >
                          <Link href={video.href}>Resume</Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="rounded-full px-3 text-xs text-neutral-300 hover:text-white"
                        >
                          Unlike
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Liked short clips
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Snackable inspiration and tips to keep momentum high.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {likedShorts.map((clip) => (
                  <article
                    key={clip.id}
                    className="flex flex-col overflow-hidden rounded-lg shadow-[0_18px_40px_rgba(0,0,0,0.28)]  hover:bg-[#141414]"
                  >
                    <Link
                      href={clip.href}
                      className="relative aspect-9/16 w-full overflow-hidden"
                    >
                      <Image
                        src={clip.thumbnail}
                        alt={clip.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 240px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col gap-3 px-4 py-4">
                      <div className="space-y-1">
                        <h3 className="line-clamp-2 text-lg  font-semibold text-white">
                          {clip.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-neutral-400">
                          <span>13.3K Views</span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
