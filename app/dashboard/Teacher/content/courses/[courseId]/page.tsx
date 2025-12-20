"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, FileText, Plus, Upload } from "lucide-react";

import ContentNavigation from "@/components/Dashboard/ContentNavigation";
import { AddLessonResourceModal } from "@/components/TeacherContent/AddLessonResourceModal";
import { CreateLessonModal } from "@/components/TeacherContent/CreateEntityModals";
import { EntityHeader } from "@/components/TeacherContent/EntityHeader";
import { useTeacherContentStore } from "@/components/TeacherContent/TeacherContentProvider";
import { UploadLessonVideoModal } from "@/components/TeacherContent/UploadLessonVideoModal";
import { VideoStatusBadge } from "@/components/TeacherContent/VideoStatusBadge";
import type { Lesson, Video } from "@/lib/mock/teacherData";
import { listLessons } from "@/lib/api/lessons";
import { getLessonVideo } from "@/lib/api/video";
import { ApiError } from "@/lib/api/client";

function LessonRow({
  lesson,
  onUpload,
  onAddResource,
}: {
  lesson: Lesson;
  onUpload: (lessonId: Lesson["_id"]) => void;
  onAddResource: (lessonId: Lesson["_id"]) => void;
}) {
  const { videos } = useTeacherContentStore();
  const video: Video | null =
    videos.find((v) => v.lesson === lesson._id) ?? null;
  const status = video?.status ?? "none";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0f1117] p-5 text-white">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
              Lesson {lesson.order}
            </span>
            <VideoStatusBadge
              status={status}
              failureReason={video?.failureReason}
            />
          </div>
          <p className="text-base font-semibold">{lesson.title}</p>
          {lesson.description ? (
            <p className="text-sm text-white/50">{lesson.description}</p>
          ) : null}

          {lesson.resources?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {lesson.resources.map((resource) => (
                <a
                  key={resource.url}
                  href={resource.url}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70 hover:bg-white/10"
                >
                  <FileText className="size-4" />
                  {resource.label}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onUpload(lesson._id)}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
          >
            <Upload className="size-4" />
            Upload video
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
            onClick={() => onAddResource(lesson._id)}
          >
            <Plus className="size-4" />
            Add resource
          </button>
        </div>
      </div>

      {video && status !== "none" ? (
        <div className="mt-4 grid gap-3 rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-white/70 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
              Upload
            </p>
            <p className="font-semibold text-white">{video.originalFileName}</p>
            <p className="text-white/50">
              {(video.size / (1024 * 1024)).toFixed(1)} MB · {video.mimeType}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
              Processing
            </p>
            <p className="text-white/50">
              {video.jobId ? `Job ${video.jobId}` : "Job pending"}
            </p>
            {video.duration ? (
              <p className="text-white/50">Duration: {video.duration}s</p>
            ) : null}
            {video.failureReason ? (
              <p className="text-rose-200">{video.failureReason}</p>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function CourseDetailPage() {
  const params = useParams<{ courseId: string }>();
  const courseId = params?.courseId ?? null;

  const {
    courses,
    subjects,
    lessons: allLessons,
    setLessons,
    setVideos,
  } = useTeacherContentStore();
  const [isCreateLessonOpen, setCreateLessonOpen] = useState(false);
  const [uploadLessonId, setUploadLessonId] = useState<Lesson["_id"] | null>(
    null
  );
  const [resourceLessonId, setResourceLessonId] = useState<
    Lesson["_id"] | null
  >(null);

  const course = useMemo(() => {
    if (!courseId) return null;
    return courses.find((c) => c._id === courseId) ?? null;
  }, [courseId, courses]);

  const subject = useMemo(() => {
    if (!course) return null;
    return subjects.find((s) => s._id === course.subject) ?? null;
  }, [course, subjects]);

  const courseLessons = useMemo(() => {
    if (!courseId) return [];
    return allLessons
      .filter((lesson) => lesson.course === courseId)
      .slice()
      .sort((a, b) => a.order - b.order);
  }, [allLessons, courseId]);

  useEffect(() => {
    let cancelled = false;
    if (!courseId) return;

    (async () => {
      try {
        const res = await listLessons({ courseId });
        if (cancelled) return;

        setLessons((prev) => {
          const next = new Map<string, Lesson>();
          prev.forEach((l) => next.set(l._id, l));
          res.lessons.forEach((l) => next.set(l._id, l));
          return Array.from(next.values());
        });
      } catch {
        if (cancelled) return;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [courseId, setLessons]);

  useEffect(() => {
    let cancelled = false;
    if (!courseId) return;

    const lessonIds = allLessons
      .filter((lesson) => lesson.course === courseId)
      .map((lesson) => lesson._id);

    if (!lessonIds.length) return;

    (async () => {
      const results = await Promise.allSettled(
        lessonIds.map(async (lessonId) => {
          const res = await getLessonVideo(lessonId);
          return res.video;
        })
      );

      if (cancelled) return;

      const fetched: Video[] = [];
      results.forEach((r) => {
        if (r.status === "fulfilled") {
          const v = r.value as any;
          fetched.push({
            _id: String(v._id ?? v.id ?? ""),
            lesson: String(v.lesson ?? v.lessonId ?? ""),
            uploadedBy: String(v.uploadedBy ?? v.createdBy ?? v.userId ?? ""),
            originalFileName: String(v.originalFileName ?? v.fileName ?? ""),
            mimeType: String(v.mimeType ?? v.contentType ?? ""),
            size: Number(v.size ?? 0),
            thumbnailUrl: v.thumbnailUrl ? String(v.thumbnailUrl) : undefined,
            thumbnailOriginalFileName: v.thumbnailOriginalFileName
              ? String(v.thumbnailOriginalFileName)
              : undefined,
            storageKey: String(v.storageKey ?? ""),
            originalPath: String(v.originalPath ?? ""),
            hlsDirectory: String(v.hlsDirectory ?? ""),
            hlsMasterPlaylistPath:
              v.hlsMasterPlaylistPath === null ||
              typeof v.hlsMasterPlaylistPath === "string"
                ? v.hlsMasterPlaylistPath
                : null,
            variants: Array.isArray(v.variants) ? v.variants : [],
            duration:
              v.duration === null || typeof v.duration === "number"
                ? v.duration
                : null,
            status: String(v.status ?? "uploaded") as any,
            failureReason: v.failureReason
              ? String(v.failureReason)
              : undefined,
            jobId: v.jobId ? String(v.jobId) : undefined,
            processingStartedAt: v.processingStartedAt
              ? String(v.processingStartedAt)
              : undefined,
            processingCompletedAt: v.processingCompletedAt
              ? String(v.processingCompletedAt)
              : undefined,
            createdAt: String(v.createdAt ?? new Date().toISOString()),
            updatedAt: String(
              v.updatedAt ?? v.createdAt ?? new Date().toISOString()
            ),
          });
        }
        if (r.status === "rejected") {
          const err = r.reason;
          if (err instanceof ApiError && err.statusCode === 404) return;
        }
      });

      if (!fetched.length) return;

      setVideos((prev) => {
        const next = new Map<string, Video>();
        prev.forEach((v) => next.set(v._id, v));
        fetched.forEach((v) => next.set(v._id, v));
        return Array.from(next.values());
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [allLessons, courseId, setVideos]);

  if (!course) {
    return (
      <section className="space-y-6">
        <EntityHeader
          title="Course not found"
          subtitle="This course might have been removed or you do not have access."
          actions={
            <Link
              href="/dashboard/Teacher/content/courses"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
            >
              <ArrowLeft className="size-4" />
              Back to courses
            </Link>
          }
        />
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <EntityHeader
        title={course.title}
        subtitle={
          subject ? `${subject.title} · Lessons & video status` : undefined
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCreateLessonOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              <Plus className="size-4" />
              Create lesson
            </button>
            <Link
              href="/dashboard/Teacher/content/courses"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
            >
              <ArrowLeft className="size-4" />
              Courses
            </Link>
          </div>
        }
      />

      <ContentNavigation activeTab="Courses" />

      <div className="grid gap-4">
        {courseLessons.map((lesson) => (
          <LessonRow
            key={lesson._id}
            lesson={lesson}
            onUpload={(id) => setUploadLessonId(id)}
            onAddResource={(id) => setResourceLessonId(id)}
          />
        ))}
      </div>

      {courseId ? (
        <CreateLessonModal
          open={isCreateLessonOpen}
          onClose={() => setCreateLessonOpen(false)}
          courseId={courseId}
          existingLessons={courseLessons}
          onCreate={(newLesson) => setLessons((prev) => [...prev, newLesson])}
        />
      ) : null}

      <UploadLessonVideoModal
        open={Boolean(uploadLessonId)}
        lessonId={uploadLessonId}
        onClose={() => setUploadLessonId(null)}
      />

      <AddLessonResourceModal
        open={Boolean(resourceLessonId)}
        lessonId={resourceLessonId}
        onClose={() => setResourceLessonId(null)}
      />
    </section>
  );
}
