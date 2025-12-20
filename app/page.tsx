"use client";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import VideoCard from "@/components/VideoCard/VideoCard";
import Link from "next/link";
import {
  Search,
  Sparkles,
  Layers,
  GraduationCap,
  LibraryBig,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { listCourses } from "@/lib/api/courses";
import { listLessons } from "@/lib/api/lessons";

export default function Home() {
  const [recommendedLessonIds, setRecommendedLessonIds] = useState<string[]>(
    []
  );
  const [recommendedError, setRecommendedError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setRecommendedError(null);
        const { courses } = await listCourses();
        const topCourses = courses.slice(0, 6);

        const lessonIds: string[] = [];
        for (const c of topCourses) {
          try {
            const { lessons } = await listLessons({ courseId: c._id });
            const first = lessons[0];
            if (first?._id) lessonIds.push(first._id);
          } catch {
            continue;
          }
        }

        if (cancelled) return;
        setRecommendedLessonIds(lessonIds);
      } catch (err) {
        if (cancelled) return;
        setRecommendedError(
          err instanceof ApiError ? err.message : "Failed to load recommended"
        );
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="fixed top-12 left-0 h-screen z-30">
          <Sidebar />
        </div>
        {/* Main content area (with left margin for sidebar) */}
        <div className="flex-1 ml-60 overflow-y-auto bg-[#0f0f0f]">
          {/* Place your main content here */}
          <div className="mx-auto w-full max-w-6xl p-6 space-y-8">
            <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-linear-to-r from-[#161616] via-[#111111] to-[#0f0f0f] px-8 py-10 shadow-[0_22px_60px_rgba(0,0,0,0.35)]">
              <div className="absolute inset-y-0 right-0 hidden w-[45%] bg-[radial-gradient(circle_at_center,rgba(79,209,197,0.18)_0%,transparent_65%)] md:block" />
              <div className="relative z-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
                <div className="space-y-5">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80">
                    <Sparkles className="size-4 text-emerald-300" />
                    Learn faster with focused lessons
                  </div>

                  <div className="space-y-3">
                    <h1 className="text-3xl font-bold leading-tight text-white md:text-4xl">
                      Find subjects, courses, and lessons in seconds
                    </h1>
                    <p className="max-w-2xl text-sm text-white/60">
                      Start with a subject, pick a course, then watch
                      lesson-by-lesson. Built for students—fast and
                      straightforward.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/30 p-3">
                    <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#0f1117] px-5 py-3">
                      <Search className="size-4 text-white/50" />
                      <Input
                        type="search"
                        placeholder="Search subjects (e.g. Physics), courses (e.g. Algebra), teachers…"
                        className="h-8 border-0 bg-transparent! text-sm text-white placeholder:text-white/40 focus-visible:ring-0"
                      />
                      <Link
                        href="/browse"
                        className="rounded-full bg-emerald-500 px-5 py-2 text-xs font-semibold text-black transition hover:bg-emerald-400"
                      >
                        Explore
                      </Link>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href="/browse?tab=curriculums"
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
                      >
                        Curriculums
                      </Link>
                      <Link
                        href="/browse?tab=subjects"
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
                      >
                        Subjects
                      </Link>
                      <Link
                        href="/browse?tab=courses"
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
                      >
                        Courses
                      </Link>
                      <Link
                        href="/browse"
                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
                      >
                        For you
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  <Link
                    href="/browse?tab=curriculums"
                    className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-200">
                        <GraduationCap className="size-5" />
                      </div>
                      <span className="text-xs text-white/50">Start here</span>
                    </div>
                    <p className="mt-4 text-sm font-semibold text-white">
                      Pick your curriculum
                    </p>
                    <p className="mt-1 text-xs text-white/60">
                      REB, Cambridge, IB…
                    </p>
                  </Link>

                  <Link
                    href="/browse?tab=subjects"
                    className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-white/5 text-white/80">
                        <Layers className="size-5" />
                      </div>
                      <span className="text-xs text-white/50">Fast path</span>
                    </div>
                    <p className="mt-4 text-sm font-semibold text-white">
                      Jump to a subject
                    </p>
                    <p className="mt-1 text-xs text-white/60">
                      Math, Physics, Biology…
                    </p>
                  </Link>

                  <Link
                    href="/browse?tab=courses"
                    className="group rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-white/5 text-white/80">
                        <LibraryBig className="size-5" />
                      </div>
                      <span className="text-xs text-white/50">Binge-ready</span>
                    </div>
                    <p className="mt-4 text-sm font-semibold text-white">
                      Start a course
                    </p>
                    <p className="mt-1 text-xs text-white/60">
                      Lesson-by-lesson learning
                    </p>
                  </Link>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Recommended for you
                  </h2>
                  <p className="text-sm text-white/50">
                    Popular lessons students are watching now.
                  </p>
                </div>
                <Link
                  href="/browse"
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
                >
                  See more
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedError ? (
                  <div className="sm:col-span-2 lg:col-span-3 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
                    {recommendedError}
                  </div>
                ) : recommendedLessonIds.length ? (
                  recommendedLessonIds.map((lessonId) => (
                    <VideoCard key={lessonId} lessonId={lessonId} />
                  ))
                ) : (
                  <>
                    <VideoCard />
                    <VideoCard />
                    <VideoCard />
                    <VideoCard />
                    <VideoCard />
                    <VideoCard />
                  </>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
