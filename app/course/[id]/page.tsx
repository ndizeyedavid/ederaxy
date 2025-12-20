"use client";

import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import CourseVideoCard from "@/components/VideoCard/CourseVideoCard";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { getCourse } from "@/lib/api/courses";
import { listLessons } from "@/lib/api/lessons";

export default function Page() {
  const params = useParams<{ id: string }>();
  const courseId = params?.id ?? "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [course, setCourse] = useState<{
    _id: string;
    title: string;
    description?: string | null;
  } | null>(null);
  const [lessons, setLessons] = useState<
    { _id: string; title: string; order: number; description?: string | null }[]
  >([]);

  useEffect(() => {
    let cancelled = false;

    if (!courseId) {
      setLoading(false);
      setError("Missing course id");
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { course: c } = await getCourse(courseId);
        if (cancelled) return;
        setCourse({
          _id: c._id,
          title: c.title,
          description: c.description ?? null,
        });

        const res = await listLessons({ courseId });
        if (cancelled) return;
        setLessons(
          res.lessons
            .slice()
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
            .map((l) => ({
              _id: l._id,
              title: l.title,
              order: l.order ?? 0,
              description: l.description ?? null,
            }))
        );
      } catch (err) {
        if (cancelled) return;
        setError(
          err instanceof ApiError ? err.message : "Failed to load course"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const courseTitle = course?.title ?? "Course";
  const courseDescription = course?.description ?? null;

  const courseVideos = useMemo(
    () =>
      lessons.map((l, idx) => ({
        index: idx + 1,
        title: l.title,
        duration: "",
        views: "",
        published: "",
        grade: "",
        lesson: "",
        unit: courseTitle,
        lessonId: l._id,
      })),
    [courseTitle, lessons]
  );

  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col  text-white bg-[#0f0f0f]">
      <Header />

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="fixed top-12 left-0 h-screen z-30">
          <Sidebar />
        </div>

        <div className="flex-1 ml-60 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8 lg:py-10">
            <div className="grid gap-8 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]">
              <div className="lg:sticky lg:top-8">
                <div className="rounded-3xl border border-white/10 bg-[#111111] p-6 shadow-[0_18px_40px_rgba(0,0,0,0.32)]">
                  <div className="text-xs font-semibold text-emerald-300">
                    Course
                  </div>
                  <h1 className="mt-2 text-2xl font-bold leading-tight text-white">
                    {courseTitle}
                  </h1>
                  {courseDescription ? (
                    <p className="mt-3 text-sm text-white/60">
                      {courseDescription}
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      {lessons.length} lessons
                    </span>
                    <Link
                      href="/browse?tab=courses"
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 transition hover:bg-white/10"
                    >
                      Back to courses
                    </Link>
                  </div>
                </div>
              </div>
              <section className="flex flex-col gap-4">
                {error ? (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
                    {error}
                  </div>
                ) : null}

                {loading ? (
                  <div className="grid gap-3">
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="h-[132px] animate-pulse rounded-2xl border border-white/10 bg-white/5"
                      />
                    ))}
                  </div>
                ) : courseVideos.length ? (
                  courseVideos.map((video) => (
                    <CourseVideoCard key={video.lessonId} {...video} />
                  ))
                ) : (
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/60">
                    No lessons found for this course yet.
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
