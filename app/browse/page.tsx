"use client";

import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Compass, PlayCircle, Search, Sparkles, Tag } from "lucide-react";
import { useMemo } from "react";

const topicFilters = [
  "STEM",
  "Revision",
  "Creative",
  "Career",
  "Short lessons",
  "Exam prep",
  "Coding",
  "Languages",
  "Finance",
  "Life skills",
];

const featuredVideo = {
  title: "Level-up Algebra: graph transformations explained visually",
  description:
    "A 14-minute visual breakdown that moves from basic functions to real-world modelling. Perfect when you need a confidence boost before homework.",
  thumbnail: "/videos/ai-vs-ml-thumb.jpg",
  href: "/watch?v=algebra-boost",
  teacher: "Keisha Mbaye",
  level: "Secondary",
  duration: "14:21",
};

export default function BrowsePage() {
  const browseSections = useMemo(
    () => [
      {
        id: "fresh",
        title: "Fresh for you",
        description:
          "Quick, high-impact sessions based on what similar learners revisited this week.",
        cta: "View playlist",
        items: [
          {
            id: "fresh-1",
            title: "Design thinking crash course",
            teacher: "Lumi Anders",
            tag: "Creative",
            duration: "08:34",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch?v=design-thinking",
            level: "Secondary",
            sentiment: "Most bookmarked",
          },
          {
            id: "fresh-2",
            title: "React hooks for beginners",
            teacher: "Marcus Patel",
            tag: "Coding",
            duration: "12:05",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch?v=hooks",
            level: "Tertiary",
            sentiment: "Trending now",
          },
          {
            id: "fresh-3",
            title: "Chemistry lab prep: titrations explained",
            teacher: "Sana Rodriguez",
            tag: "STEM",
            duration: "09:19",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch?v=titrations",
            level: "Upper Secondary",
            sentiment: "Teacher favourite",
          },
        ],
      },
      {
        id: "quickwins",
        title: "Need-it-now topics",
        description:
          "Bite-sized videos under 10 minutes to help you nail tonight's homework.",
        cta: "Browse short lessons",
        items: [
          {
            id: "quick-1",
            title: "Speed reading strategies",
            teacher: "Avery Njoroge",
            tag: "Life skills",
            duration: "07:02",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch?v=speed-reading",
            level: "All levels",
            sentiment: "Popular this week",
          },
          {
            id: "quick-2",
            title: "Understanding ratios with recipes",
            teacher: "Dr. Mei Wong",
            tag: "Revision",
            duration: "05:48",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch?v=ratios",
            level: "Lower Secondary",
            sentiment: "Student pick",
          },
          {
            id: "quick-3",
            title: "Pitch your idea in 90 seconds",
            teacher: "Jamal Everett",
            tag: "Career",
            duration: "06:31",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch?v=pitch-idea",
            level: "Senior Secondary",
            sentiment: "Confidence booster",
          },
          {
            id: "quick-4",
            title: "Mindful study reset",
            teacher: "Lina Fernandez",
            tag: "Wellbeing",
            duration: "04:55",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch?v=mindful-reset",
            level: "All levels",
            sentiment: "Most replayed",
          },
        ],
      },
      {
        id: "deepdives",
        title: "Deep dives",
        description:
          "Long-form lessons to binge when you're ready to stay curious for longer.",
        cta: "Explore series",
        items: [
          {
            id: "deep-1",
            title: "Full-stack portfolio project walkthrough",
            teacher: "Marcus Patel",
            tag: "Coding",
            duration: "32:44",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch?v=portfolio",
            level: "Tertiary",
            sentiment: "Project based",
          },
          {
            id: "deep-2",
            title: "Climate change and resilient cities",
            teacher: "FutureNow Talks",
            tag: "Humanities",
            duration: "28:12",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch?v=climate",
            level: "Upper Secondary",
            sentiment: "Panel discussion",
          },
          {
            id: "deep-3",
            title: "Finance fundamentals for teens",
            teacher: "David Okafor",
            tag: "Finance",
            duration: "24:58",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch?v=finance",
            level: "Secondary",
            sentiment: "Starter kit",
          },
        ],
      },
    ],
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
            <section className="relative overflow-hidden rounded-3xl border border-[#1f1f1f] bg-linear-to-r from-[#161616] via-[#111111] to-[#0f0f0f] px-8 py-10 shadow-[0_22px_60px_rgba(0,0,0,0.35)]">
              <div className="absolute inset-y-0 right-0 hidden w-[45%] bg-[radial-gradient(circle_at_center,rgba(79,209,197,0.18)_0%,transparent_65%)] md:block" />
              <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-14">
                <div className="flex-1 space-y-6">
                  <div className="space-y-4">
                    <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                      Discover lessons that match the way you like to learn
                    </h1>
                    <p className="max-w-2xl text-sm text-neutral-300">
                      Filter by topic, duration, or vibe. Save the ones you plan
                      to watch later, and let the algorithm surface mentors
                      other students loved.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,420px)_auto]">
                    <div className="flex items-center gap-2 rounded-full border border-[#272727] bg-[#141414] px-4">
                      <Search className="size-4 text-neutral-500" />
                      <Input
                        placeholder="Search for a skill, subject, or teacher"
                        className="h-9 border-0 bg-transparent! text-sm text-white placeholder:text-neutral-500 focus-visible:ring-0"
                      />
                    </div>
                    <Button className="rounded-full bg-white px-6 text-sm font-semibold text-black hover:bg-white/90">
                      Start exploring
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {topicFilters.map((filter) => (
                      <button
                        key={filter}
                        className="group flex items-center gap-2 rounded-full border border-[#252525] bg-[#181818] px-3 py-2 text-xs font-medium text-neutral-300 transition hover:border-emerald-500/60 hover:text-white"
                      >
                        <Tag className="size-3 text-neutral-500 transition group-hover:text-emerald-300" />
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <Link
                  href={featuredVideo.href}
                  className="group relative flex w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-[#222222] bg-[#101010] shadow-[0_18px_48px_rgba(0,0,0,0.35)] transition hover:border-emerald-500/50 hover:bg-[#111111]"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={featuredVideo.thumbnail}
                      alt={featuredVideo.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                    <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold">
                      <PlayCircle className="size-3.5" />
                      {featuredVideo.duration}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 px-5 py-6">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-300">
                      <Sparkles className="size-3" />
                      Featured for you
                    </div>
                    <h2 className="text-lg font-semibold leading-snug text-white">
                      {featuredVideo.title}
                    </h2>
                    <p className="text-sm text-neutral-300 line-clamp-3">
                      {featuredVideo.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                      <span>{featuredVideo.teacher}</span>
                      <span className="text-neutral-600">•</span>
                      <span>{featuredVideo.level}</span>
                    </div>
                    <Button className="mt-2 w-full rounded-full bg-emerald-500 text-sm font-semibold text-black transition hover:bg-emerald-400">
                      Watch now
                    </Button>
                  </div>
                </Link>
              </div>
            </section>

            {browseSections.map((section) => (
              <section key={section.id} className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {section.title}
                    </h2>
                    <p className="text-sm text-neutral-400">
                      {section.description}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    className="rounded-full border border-[#272727] bg-[#151515] px-4 text-xs font-semibold text-neutral-200 hover:bg-[#1d1d1d]"
                  >
                    {section.cta}
                  </Button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-2">
                  {section.items.map((item) => (
                    <article
                      key={item.id}
                      className=" relative flex w-[260px] shrink-0 flex-col overflow-hidden rounded-3xl  bg-[#111111] shadow-[0_18px_40px_rgba(0,0,0,0.32)] transition hover:bg-[#141414]"
                    >
                      <Link
                        href={item.href}
                        className="relative h-40 w-full overflow-hidden"
                      >
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          sizes="260px"
                          className="object-cover "
                        />
                        <span className="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold">
                          {item.tag}
                        </span>
                        <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-0.5 text-[11px] font-semibold">
                          {item.duration}
                        </span>
                      </Link>

                      <div className="flex flex-1 flex-col gap-3 px-5 py-5">
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold leading-snug text-white line-clamp-2">
                            {item.title}
                          </h3>
                          <div className="flex flex-wrap items-center gap-1 text-xs text-neutral-400">
                            <Link href="/@mellow" className="hover:text-white">
                              {item.teacher}
                            </Link>
                            <span className="text-neutral-600">•</span>
                            <span>{item.level}</span>
                            <span className="text-neutral-600">•</span>
                            <span>3.2K Views</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-emerald-300">
                          <Sparkles className="size-3" />
                          {item.sentiment}
                        </div>

                        <div className="mt-auto flex items-center gap-3">
                          <Button
                            asChild
                            className="flex-1 rounded-full bg-white px-4 text-xs font-semibold text-black hover:bg-white/90"
                          >
                            <Link href={item.href}>Play</Link>
                          </Button>
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
