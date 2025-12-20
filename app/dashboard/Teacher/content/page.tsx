"use client";

import Link from "next/link";
import { useMemo } from "react";

import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Layers } from "lucide-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ContentNavigation from "@/components/Dashboard/ContentNavigation";
import { EntityHeader } from "@/components/TeacherContent/EntityHeader";
import { useTeacherContentStore } from "@/components/TeacherContent/TeacherContentProvider";
import { VideoStatusBadge } from "@/components/TeacherContent/VideoStatusBadge";
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
  status: VideoStatus | "none";
  durationSeconds: number | null;
  updatedAt: string;
  failureReason?: string;
}

function ThumbnailCell({ data }: ICellRendererParams<LessonVideoRow>) {
  const row = data!;
  const rawUrl = row.thumbnailUrl;

  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
    "http://localhost:8080";

  const url = rawUrl
    ? rawUrl.startsWith("http://") || rawUrl.startsWith("https://")
      ? rawUrl
      : `${apiBaseUrl}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`
    : undefined;

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
  const { courses, lessons, videos, subjects } = useTeacherContentStore();

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
        const video: Video | null = lesson.video
          ? videos.find((v) => v.lesson === lesson._id) ?? null
          : null;
        allRows.push({
          id: lesson._id,
          lessonId: lesson._id,
          lessonTitle: lesson.title,
          courseId: course._id,
          courseTitle: course.title,
          subjectTitle,
          thumbnailUrl: video?.thumbnailUrl,
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

      <section>
        <div className="ag-theme-quartz content-ag-grid h-[520px] rounded border border-white/5">
          <AgGridReact<LessonVideoRow>
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
      </section>

      <style jsx global>{`
        .content-ag-grid {
          --ag-background-color: #13151b;
          --ag-odd-row-background-color: rgba(255, 255, 255, 0.04);
          --ag-header-background-color: rgba(19, 21, 27, 0.92);
          --ag-border-color: rgba(255, 255, 255, 0.08);
          --ag-foreground-color: rgba(255, 255, 255, 0.9);
          --ag-wrapping-header-text-color: rgba(255, 255, 255, 0.45);
        }

        .content-ag-grid .ag-root-wrapper,
        .content-ag-grid .ag-root-wrapper-body,
        .content-ag-grid .ag-root {
          background: transparent;
          box-shadow: none;
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
