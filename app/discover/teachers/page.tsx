"use client";

import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, BookOpen, Filter, Play } from "lucide-react";
import { useMemo } from "react";

const tagFilters = [
  "STEM",
  "Languages",
  "Coding",
  "Exam Prep",
  "Creative Arts",
  "Entrepreneurship",
  "Finance",
  "Life Skills",
];

export default function TeachersPage() {
  const recommendedTeachers = useMemo(
    () => [
      {
        id: "recommend-1",
        name: "Avery Njoroge",
        handle: "@techwithavery",
        bio: "Helps teens build real-world apps with AI-powered workflows.",
        subjects: ["AI", "Software Design"],
        avatar: "/users/5.jpeg",
        banner: "/banners/Mixed-languages.jpg",
        students: "38.2K learners",
        rating: "4.9",
        badges: ["Live projects", "Community"],
      },
      {
        id: "recommend-2",
        name: "Sana Rodriguez",
        handle: "@sciwithsana",
        bio: "Brings biology and chemistry alive with lab-in-a-box sessions.",
        subjects: ["Biology", "Chemistry"],
        avatar: "/users/2.jpeg",
        banner: "/banners/Mixed-languages.jpg",
        students: "24.6K learners",
        rating: "4.8",
        badges: ["Lab kits", "Study guides"],
      },
      {
        id: "recommend-3",
        name: "Jamal Everett",
        handle: "@jamalcoach",
        bio: "Mentors future founders with product strategy and pitching skills.",
        subjects: ["Business", "Public Speaking"],
        avatar: "/users/6.png",
        banner: "/banners/Mixed-languages.jpg",
        students: "18.4K learners",
        rating: "5.0",
        badges: ["Demo days", "Career clinics"],
      },
      {
        id: "recommend-4",
        name: "Dr. Mei Wong",
        handle: "@mathswithmei",
        bio: "Guides advanced math learners through olympiad-style problems.",
        subjects: ["Mathematics", "Data"],
        avatar: "/users/3.jpeg",
        banner: "/banners/Mixed-languages.jpg",
        students: "52.0K learners",
        rating: "4.9",
        badges: ["Competition prep", "1:1 clinics"],
      },
      {
        id: "recommend-5",
        name: "Lumi Anders",
        handle: "@creativewithlumi",
        bio: "Illustrator helping students tell stories through digital art.",
        subjects: ["Design", "Illustration"],
        avatar: "/users/1.jpg",
        banner: "/banners/Mixed-languages.jpg",
        students: "11.7K learners",
        rating: "4.7",
        badges: ["Portfolio reviews", "Template packs"],
      },
      {
        id: "recommend-6",
        name: "David Okafor",
        handle: "@okaforfinance",
        bio: "Teaches money literacy with real-life simulations and challenges.",
        subjects: ["Finance", "Life Skills"],
        avatar: "/users/4.jpg",
        banner: "/banners/Mixed-languages.jpg",
        students: "29.3K learners",
        rating: "4.9",
        badges: ["Budget games", "Weekly challenges"],
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
            <section className="relative overflow-hidden rounded-3xl border border-[#1f1f1f] bg-gradient-to-r from-[#151515] via-[#121212] to-[#0f0f0f] px-8 py-10 shadow-[0_24px_60px_rgba(0,0,0,0.35)]">
              <div className="absolute inset-y-0 right-0 hidden w-2/5 bg-[radial-gradient(circle_at_center,_rgba(76,201,240,0.15)_0%,_transparent_65%)] md:block" />
              <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:gap-10">
                <div className="flex-1 space-y-4">
                  <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                    Find your next mentor, coach, or subject expert
                  </h1>
                  <p className="max-w-2xl text-sm text-neutral-300">
                    Discover the teachers students rave about. Filter by
                    interests, see what they specialise in, and follow the ones
                    that match your learning path.
                  </p>
                  <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <div className="flex w-full items-center gap-2 rounded-full border border-[#2a2a2a] bg-[#151515] px-4">
                      <Input
                        placeholder="Search teachers, subjects or skills"
                        className="h-12 border-0 bg-transparent! text-sm text-white placeholder:text-neutral-500 focus-visible:ring-0"
                      />
                      <Button className="rounded-full bg-emerald-500 px-6 text-sm font-semibold text-black hover:bg-emerald-400">
                        Explore
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="hidden w-full max-w-xs flex-col gap-3 rounded-3xl border border-[#1f1f1f] bg-[#111111] p-5 md:flex">
                  <div className="flex items-center gap-3">
                    <div className="relative size-12 overflow-hidden rounded-2xl">
                      <Image
                        src="/users/6.png"
                        alt="Preview teacher"
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        Spotlight: Jamal Everett
                      </p>
                      <p className="text-xs text-neutral-400">
                        Business & Public Speaking
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-300">
                    "Jamal helped me close my first investor pitch. His weekly
                    clinics and feedback loops are unmatched."
                  </p>
                  <Button className="rounded-full bg-white px-3 text-xs font-semibold text-black hover:bg-white/90">
                    Watch success story
                  </Button>
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-white">
                  Trending categories
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {tagFilters.map((tag) => (
                  <button
                    key={tag}
                    className="rounded-full border border-[#232323] bg-[#151515] px-4 py-2 text-xs font-medium text-neutral-300 transition hover:border-emerald-500/50 hover:text-white"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">
                    Teachers students love right now
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Hand-picked based on retention, learner feedback, and live
                    session turnout.
                  </p>
                </div>
                <Button
                  variant="secondary"
                  className="rounded-full border border-[#2a2a2a] bg-[#151515] px-4 text-sm text-neutral-200 hover:bg-[#1e1e1e]"
                >
                  Follow all
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {recommendedTeachers.map((teacher) => (
                  <article
                    key={teacher.id}
                    className="group flex flex-col overflow-hidden rounded-3xl bg-[#111111] shadow-[0_20px_40px_rgba(0,0,0,0.35)] transition  hover:bg-[#141414]"
                  >
                    <div className="relative h-28 w-full overflow-hidden">
                      <Image
                        src={teacher.banner}
                        alt={`${teacher.name} banner`}
                        fill
                        sizes="(max-width: 768px) 100vw, 360px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/60 to-black/30" />
                      <div className="absolute bottom-4 left-5 flex items-center gap-3">
                        <div className="relative size-14 overflow-hidden rounded-xl border-2 border-[#111111] shadow-lg">
                          <Image
                            src={teacher.avatar}
                            alt={teacher.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1 text-sm font-semibold">
                            <span>{teacher.name}</span>
                            <BadgeCheck className="size-3.5 text-emerald-400" />
                          </div>
                          <p className="text-xs text-neutral-300">
                            {teacher.handle}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-10">
                      <p className="text-sm text-neutral-300 line-clamp-3">
                        {teacher.bio}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                        <span className="rounded-full border border-[#232323] px-3 py-1">
                          {teacher.students}
                        </span>
                        <span className="rounded-full border border-[#232323] px-3 py-1">
                          ⭐ {teacher.rating}
                        </span>
                        {teacher.subjects.map((subject) => (
                          <span
                            key={subject}
                            className="rounded-full border border-[#232323] bg-[#181818] px-3 py-1 text-neutral-300"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          asChild
                          className="flex-1 rounded-full bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90"
                        >
                          <Link href={`/${teacher.handle.replace("@", "")}`}>
                            Visit channel
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="rounded-full px-3 text-xs text-neutral-300 hover:text-white"
                        >
                          <Play className="size-4" />
                          Watch sample
                        </Button>
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
