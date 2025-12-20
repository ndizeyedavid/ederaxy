"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Layers, Play, X } from "lucide-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ContentNavigation from "@/components/Dashboard/ContentNavigation";
import { EntityHeader } from "@/components/TeacherContent/EntityHeader";
import { useTeacherContentStore } from "@/components/TeacherContent/TeacherContentProvider";
import { VideoStatusBadge } from "@/components/TeacherContent/VideoStatusBadge";
import { ApiError } from "@/lib/api/client";
import { getLessonVideo } from "@/lib/api/video";
import type {
  Course,
  Lesson,
  Video,
  VideoStatus,
} from "@/lib/mock/teacherData";

ModuleRegistry.registerModules([AllCommunityModule]);

interface LessonVideoRow {
  id: string;
  lessonId: string;
  lessonTitle: string;
  courseId: string;
  courseTitle: string;
  subjectTitle: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  status: VideoStatus | "none";
  durationSeconds: number | null;
  updatedAt: string;
  failureReason?: string;
}

function resolveBackendUrl(rawUrl?: string | null) {
  if (!rawUrl) return undefined;
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://"))
    return rawUrl;

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
    "http://localhost:8080";

  return `${apiBaseUrl}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
}

function ThumbnailCell({ data }: ICellRendererParams<LessonVideoRow>) {
  const row = data!;
  const url = resolveBackendUrl(row.thumbnailUrl);

  return url ? (
    <img
      src={url}
      alt="thumbnail"
      className="h-12 w-20 rounded-lg border border-white/10 object-cover"
    />
  ) : (
    <div className="h-12 w-20 rounded-lg border border-white/10 bg-white/5" />
  );
}

function LessonVideoCell({ data }: ICellRendererParams<LessonVideoRow>) {
  const row = data!;

  return (
    <div className="space-y-1">
      <Link
        href={`/dashboard/Teacher/content/courses/${row.courseId}`}
        className="text-sm font-semibold text-white hover:text-white/80"
      >
        {row.lessonTitle}
      </Link>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/50">
        <span className="inline-flex items-center gap-1.5">
          <Layers className="size-3.5" />
          {row.courseTitle} · {row.subjectTitle}
        </span>
      </div>
    </div>
  );
}

function StatusCell({ data }: ICellRendererParams<LessonVideoRow>) {
  const row = data!;
  return (
    <VideoStatusBadge status={row.status} failureReason={row.failureReason} />
  );
}

function DurationCell({
  value,
}: ICellRendererParams<LessonVideoRow, number | null>) {
  if (!value) return <span className="text-sm text-white/60">-</span>;
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60);
  const text = `${minutes}:${String(seconds).padStart(2, "0")}`;
  return <span className="text-sm font-semibold text-white">{text}</span>;
}

function UpdatedCell({ value }: ICellRendererParams<LessonVideoRow, string>) {
  if (!value) {
    return <span className="text-sm text-white/60">-</span>;
  }

  const date = new Date(value);
  const text = Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
  return (
    <div className="space-y-1 text-sm text-white">
      <p>{text}</p>
      <p className="text-xs text-white/50">Updated</p>
    </div>
  );
}

export default function ContentVideosPage() {
  const { courses, lessons, videos, subjects, setVideos } =
    useTeacherContentStore();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewTitle, setPreviewTitle] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const knownByLesson = new Set(videos.map((v) => v.lesson));
    const lessonIds = lessons
      .map((l) => l._id)
      .filter((id) => id && !knownByLesson.has(id));

    if (!lessonIds.length) return;

    const toVideo = (v: any): Video => {
      return {
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
        failureReason: v.failureReason ? String(v.failureReason) : undefined,
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
      };
    };

    const run = async () => {
      const concurrency = 5;
      const pending = [...lessonIds];
      const fetched: Video[] = [];

      const worker = async () => {
        while (pending.length) {
          const lessonId = pending.shift();
          if (!lessonId) continue;
          try {
            const res = await getLessonVideo(lessonId);
            fetched.push(toVideo(res.video as any));
          } catch (err) {
            if (err instanceof ApiError && err.statusCode === 404) continue;
          }
        }
      };

      await Promise.all(Array.from({ length: concurrency }, () => worker()));

      if (cancelled || !fetched.length) return;

      setVideos((prev) => {
        const next = new Map<string, Video>();
        prev.forEach((v) => next.set(v._id, v));
        fetched.forEach((v) => next.set(v._id, v));
        return Array.from(next.values());
      });
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [lessons, setVideos, videos]);

  const rows = useMemo<LessonVideoRow[]>(() => {
    const resolveCourseContext = (course: Course) => {
      const subject = subjects.find((s) => s._id === course.subject) ?? null;
      const subjectTitle = subject?.title ?? "Subject";
      return { subjectTitle };
    };

    const allRows: LessonVideoRow[] = [];

    courses.forEach((course) => {
      const { subjectTitle } = resolveCourseContext(course);
      const courseLessons = lessons.filter(
        (lesson) => lesson.course === course._id
      );

      courseLessons.forEach((lesson: Lesson) => {
        const video: Video | null =
          videos.find((v) => v.lesson === lesson._id) ?? null;

        const rawPreview =
          (video?.variants?.[0]?.publicPlaylistPath as string | undefined) ??
          (video?.hlsMasterPlaylistPath as string | null | undefined) ??
          (video?.originalPath as string | undefined) ??
          undefined;

        allRows.push({
          id: lesson._id,
          lessonId: lesson._id,
          lessonTitle: lesson.title,
          courseId: course._id,
          courseTitle: course.title,
          subjectTitle,
          thumbnailUrl: video?.thumbnailUrl,
          previewUrl: resolveBackendUrl(rawPreview),
          status: video?.status ?? "none",
          durationSeconds: video?.duration ?? null,
          updatedAt: (video?.updatedAt ?? lesson.updatedAt) as string,
          failureReason: video?.failureReason,
        });
      });
    });

    return allRows.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [courses, lessons, subjects, videos]);

  const columnDefs = useMemo<ColDef<LessonVideoRow>[]>(
    () => [
      {
        headerName: "",
        // @ts-ignore
        field: "selection",
        // checkboxSelection: true,
        // headerCheckboxSelection: true,
        maxWidth: 56,
        sortable: false,
        resizable: false,
        suppressMenu: true,
        filter: true,
        pinned: "left",
      },
      {
        headerName: "Thumbnail",
        field: "thumbnailUrl",
        cellRenderer: ThumbnailCell,
        minWidth: 140,
        sortable: false,
      },
      {
        headerName: "Preview",
        field: "previewUrl",
        minWidth: 120,
        sortable: false,
        cellRenderer: ({ data }: ICellRendererParams<LessonVideoRow>) => {
          const row = data!;
          const canPreview = Boolean(row.previewUrl) && row.status !== "none";
          if (!canPreview) {
            return <span className="text-sm text-white/40">-</span>;
          }

          return (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
              onClick={() => {
                setPreviewTitle(row.lessonTitle);
                setPreviewUrl(row.previewUrl ?? null);
                setPreviewOpen(true);
              }}
            >
              <Play className="size-3.5" />
              Preview
            </button>
          );
        },
      },
      {
        headerName: "Lesson",
        field: "lessonTitle",
        cellRenderer: LessonVideoCell,
        flex: 2,
        minWidth: 360,
      },
      {
        headerName: "Status",
        field: "status",
        cellRenderer: StatusCell,
        minWidth: 150,
      },
      {
        headerName: "Duration",
        field: "durationSeconds",
        cellRenderer: DurationCell,
        minWidth: 110,
      },
      {
        headerName: "Updated",
        field: "updatedAt",
        cellRenderer: UpdatedCell,
        minWidth: 150,
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef<LessonVideoRow>>(
    () => ({
      sortable: true,
      resizable: true,
      flex: 1,
      wrapText: true,
      autoHeight: true,
      cellClass: "content-grid-cell",
      headerClass: "content-grid-header",
    }),
    []
  );

  return (
    <section className="space-y-6">
      <EntityHeader
        title="Lesson videos"
        subtitle="All lesson videos across your courses. Track processing status and jump back to the course lessons view."
      />

      <ContentNavigation activeTab="Videos" />

      <div className="ag-theme-quartz content-ag-grid h-[520px] rounded border border-white/5">
        <AgGridReact
          rowData={rows}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowHeight={104}
          headerHeight={52}
          suppressCellFocus
          suppressDragLeaveHidesColumns
          theme="legacy"
        />
      </div>

      {previewOpen && previewUrl ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-[#0f1117] text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{previewTitle}</p>
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-white/60 hover:text-white"
                >
                  Open in new tab
                </a>
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-2 transition hover:border-white/20 hover:bg-white/10"
                onClick={() => {
                  setPreviewOpen(false);
                  setPreviewUrl(null);
                  setPreviewTitle("");
                }}
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5">
              <video
                src={previewUrl}
                controls
                className="aspect-video w-full rounded-xl border border-white/10 bg-black"
              />
              <p className="mt-3 text-xs text-white/50">
                If your backend serves HLS (.m3u8), some browsers require HLS
                support to play it inline. Use “Open in new tab” if the inline
                player doesn’t start.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <style jsx global>{`
        .content-ag-grid {
          --ag-background-color: #13151b;
          --ag-odd-row-background-color: rgba(255, 255, 255, 0.04);
          --ag-header-background-color: rgba(19, 21, 27, 0.92);
          --ag-border-color: rgba(255, 255, 255, 0.08);
          --ag-foreground-color: rgba(255, 255, 255, 0.9);
          --ag-wrapping-header-text-color: rgba(255, 255, 255, 0.45);
          background: var(--ag-background-color);
        }

        .content-ag-grid .ag-root-wrapper,
        .content-ag-grid .ag-root-wrapper-body,
        .content-ag-grid .ag-root {
          background: var(--ag-background-color) !important;
          box-shadow: none;
        }

        .content-ag-grid .ag-body-viewport,
        .content-ag-grid .ag-center-cols-viewport,
        .content-ag-grid .ag-header,
        .content-ag-grid .ag-header-viewport,
        .content-ag-grid .ag-header-row,
        .content-ag-grid .ag-body-horizontal-scroll {
          background: var(--ag-background-color) !important;
        }

        .content-ag-grid .ag-header-cell {
          padding: 12px 16px;
        }

        .content-ag-grid .ag-row,
        .content-ag-grid .ag-row-hover.ag-row {
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .content-ag-grid .ag-row-hover .ag-cell {
          background-color: rgba(255, 255, 255, 0.06) !important;
        }

        .content-grid-header {
          color: rgba(255, 255, 255, 0.35) !important;
          font-size: 12px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
        }

        .content-grid-cell {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          display: flex;
          align-items: center;
        }

        .content-ag-grid .ag-checkbox-input-wrapper {
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
        }

        .content-ag-grid .ag-checkbox-input-wrapper.ag-checked::after {
          color: #ffffff;
        }
      `}</style>
    </section>
  );
}
