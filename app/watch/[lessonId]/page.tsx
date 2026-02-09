"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  Bookmark,
  Download,
  Play,
  Share2,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { ApiError } from "@/lib/api/client";
import { getLessonVideo, type LessonVideo } from "@/lib/api/video";
import { listLessons } from "@/lib/api/lessons";
import { listCourses } from "@/lib/api/courses";

function resolveBackendUrl(rawUrl?: string | null) {
  if (!rawUrl) return undefined;
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
    "http://localhost:8080";

  return `${apiBaseUrl}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
}

function getBestPreviewUrl(video: LessonVideo): string | undefined {
  const raw =
    video.variants?.[0]?.publicPlaylistPath ??
    video.hlsMasterPlaylistPath ??
    undefined;

  return resolveBackendUrl(raw);
}

export default function WatchLessonPage() {
  const params = useParams<{ lessonId: string }>();
  const lessonId = params?.lessonId ?? "";

  const [video, setVideo] = useState<LessonVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [lessonTitle, setLessonTitle] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [courseLessons, setCourseLessons] = useState<
    { _id: string; title: string }[]
  >([]);
  const [suggested, setSuggested] = useState<
    {
      lessonId: string;
      title: string;
      thumb?: string;
    }[]
  >([]);

  useEffect(() => {
    let cancelled = false;

    if (!lessonId) {
      setLoading(false);
      setError("Missing lesson id");
      return;
    }

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const videoRes = await getLessonVideo(lessonId);
        if (cancelled) return;
        setVideo(videoRes.video);

        // Derive lesson title + courseId using supported endpoints.
        const { courses } = await listCourses();
        let foundCourseId: string | null = null;
        let foundTitle: string | null = null;
        let foundLessons: { _id: string; title: string }[] = [];

        for (const c of courses) {
          try {
            const res = await listLessons({ courseId: c._id });
            const hit = res.lessons.find((l) => l._id === lessonId);
            if (hit) {
              foundCourseId = c._id;
              foundTitle = hit.title;
              foundLessons = res.lessons.map((l) => ({
                _id: l._id,
                title: l.title,
              }));
              break;
            }
          } catch {
            continue;
          }
        }

        if (cancelled) return;
        setCourseId(foundCourseId);
        setLessonTitle(foundTitle);
        setCourseLessons(foundLessons);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError(err instanceof Error ? err.message : "Failed to load video");
        }
        setVideo(null);
        setLessonTitle(null);
        setCourseId(null);
        setCourseLessons([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  useEffect(() => {
    let cancelled = false;

    if (!courseId) {
      setSuggested([]);
      return;
    }

    (async () => {
      try {
        const others = courseLessons
          .filter((l) => l._id && l._id !== lessonId)
          .slice(0, 7);

        const items = await Promise.all(
          others.map(async (l) => {
            try {
              const v = await getLessonVideo(l._id);
              return {
                lessonId: l._id,
                title: l.title,
                thumb: v.video.thumbnailUrl ?? undefined,
              };
            } catch {
              return { lessonId: l._id, title: l.title };
            }
          })
        );

        if (cancelled) return;
        setSuggested(items);
      } catch {
        if (!cancelled) setSuggested([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId, courseLessons, lessonId]);

  const status = video?.status ?? null;

  const previewUrl = useMemo(() => {
    if (!video) return undefined;
    return getBestPreviewUrl(video);
  }, [video]);

  const canPlay = Boolean(previewUrl) && status === "ready";

  const suggestedVideos = useMemo(
    () =>
      suggested.map((s) => ({
        id: s.lessonId,
        title: s.title,
        teacher: "",
        views: "",
        thumb: s.thumb ?? "/videos/ai-vs-ml-thumb.jpg",
        href: `/watch/${s.lessonId}`,
        duration: "",
        isRemoteThumb: Boolean(s.thumb),
      })),
    [suggested]
  );

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-[#0f0f0f] text-white">
      <Header />
      <div className="flex min-h-0 flex-1">
        <div className="fixed left-0 top-[72px] z-30 h-[calc(100vh-72px)]">
          <Sidebar />
        </div>

        <div className="ml-60 flex-1 overflow-y-auto px-10">
          <div className="mx-auto w-full max-w-[1280px] px-6 py-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
              <section className="min-w-0 space-y-4">
                <div className="text-xs text-neutral-400">
                  <span className="hover:text-white">Curriculum</span>
                  <span className="mx-2 text-neutral-600">›</span>
                  <span className="hover:text-white">Subject</span>
                  <span className="mx-2 text-neutral-600">›</span>
                  <span className="hover:text-white">Course</span>
                </div>

                <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
                  {loading ? (
                    <div className="aspect-video w-full animate-pulse bg-white/5" />
                  ) : error ? (
                    <div className="flex aspect-video flex-col items-center justify-center gap-2 px-6 text-center">
                      <p className="text-sm font-semibold text-white">
                        Could not load lesson video
                      </p>
                      <p className="text-sm text-white/60">{error}</p>
                      <Link
                        href="/browse"
                        className="mt-2 rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40"
                      >
                        Back to browse
                      </Link>
                    </div>
                  ) : !video ? (
                    <div className="flex aspect-video items-center justify-center text-sm text-white/70">
                      No video found for this lesson.
                    </div>
                  ) : !canPlay ? (
                    <div className="flex aspect-video flex-col items-center justify-center gap-2 px-6 text-center">
                      <p className="text-sm font-semibold text-white">
                        Video not ready
                      </p>
                      <p className="text-sm text-white/60">
                        {status === "processing" || status === "uploaded"
                          ? "This lesson video is still processing. Please check back soon."
                          : status === "failed"
                          ? video.failureReason || "Processing failed."
                          : "This lesson does not have a playable video yet."}
                      </p>
                    </div>
                  ) : (
                    <video
                      src={previewUrl}
                      controls
                      className="aspect-video w-full"
                    />
                  )}
                </div>

                <div className="space-y-3">
                  {loading ? (
                    <div className="space-y-2">
                      <div className="h-6 w-5/6 rounded bg-white/5" />
                      <div className="h-4 w-2/3 rounded bg-white/5" />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-xl font-semibold leading-snug text-white md:text-2xl">
                        {lessonTitle ?? "Lesson"}
                      </h1>
                      <p className="text-xs text-white/50">ID: {lessonId}</p>
                    </>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#111111] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative size-10 overflow-hidden rounded-full border border-white/10 bg-white/5">
                        <Image
                          src="/users/default-avatar.svg"
                          alt="Teacher"
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-white">
                          Teacher name
                        </span>
                        <span className="text-xs text-neutral-400">
                          9.35K subscribers
                        </span>
                      </div>
                      <button className="ml-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black transition hover:bg-neutral-200">
                        Subscribe
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex items-center overflow-hidden rounded-full bg-[#232323] text-sm">
                        <button className="flex items-center gap-2 px-4 py-2 hover:bg-[#2f2f2f]">
                          <ThumbsUp size={18} />
                          <span>1.1K</span>
                        </button>
                        <span className="h-6 w-px bg-[#3d3d3d]" />
                        <button className="flex items-center px-3 py-2 hover:bg-[#2f2f2f]">
                          <ThumbsDown size={18} />
                        </button>
                      </div>
                      <button className="flex items-center gap-2 rounded-full bg-[#232323] px-4 py-2 text-sm transition hover:bg-[#2f2f2f]">
                        <Bookmark size={18} /> Save
                      </button>
                      <button className="flex items-center gap-2 rounded-full bg-[#232323] px-4 py-2 text-sm transition hover:bg-[#2f2f2f]">
                        <Share2 size={18} /> Share
                      </button>
                      <button className="flex items-center gap-2 rounded-full bg-[#232323] px-4 py-2 text-sm transition hover:bg-[#2f2f2f]">
                        <Download size={18} /> Download
                      </button>
                      {previewUrl ? (
                        <a
                          href={previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/40"
                        >
                          Open video
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-white/50">
                  Note: If the backend serves HLS (.m3u8), some browsers require
                  HLS support to play it inline. Use “Open video” if the inline
                  player doesn’t start.
                </p>
              </section>

              <aside className="hidden lg:block">
                <div className="rounded-2xl border border-white/10 bg-[#111111]">
                  <div className="flex items-center justify-between px-4 py-4">
                    <p className="text-sm font-semibold text-white">Up next</p>
                    <span className="text-xs text-white/50">Autoplay</span>
                  </div>
                  <div className="space-y-3 px-4 pb-4">
                    {suggestedVideos.map((s) => (
                      <Link
                        key={s.id}
                        href={s.href}
                        className="group flex gap-3 rounded-xl p-2 transition hover:bg-white/5"
                      >
                        <div className="relative h-[74px] w-[132px] shrink-0 overflow-hidden rounded-xl border border-white/10">
                          <Image
                            src={s.thumb}
                            alt={s.title}
                            fill
                            sizes="132px"
                            unoptimized={
                              Boolean((s as any).isRemoteThumb) ||
                              s.thumb.startsWith("http")
                            }
                            className="object-cover"
                          />
                          <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                            <div className="absolute inset-0 bg-black/35" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="flex size-10 items-center justify-center rounded-full bg-black/70 ring-1 ring-white/10">
                                <Play
                                  className="size-4 text-white"
                                  fill="currentColor"
                                />
                              </div>
                            </div>
                          </div>
                          <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-2 py-0.5 text-[11px] font-semibold">
                            {s.duration}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 text-sm font-semibold text-white group-hover:text-white/90">
                            {s.title}
                          </p>
                          {s.teacher ? (
                            <p className="mt-1 text-xs text-neutral-400">
                              {s.teacher}
                            </p>
                          ) : null}
                          {s.views ? (
                            <p className="mt-1 text-xs text-neutral-500">
                              {s.views}
                            </p>
                          ) : null}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
