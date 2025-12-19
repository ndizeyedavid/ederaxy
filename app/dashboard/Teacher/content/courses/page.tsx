"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { BookOpen, Layers, Plus } from "lucide-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import ContentNavigation from "@/components/Dashboard/ContentNavigation";
import { CreateCourseModal } from "@/components/TeacherContent/CreateEntityModals";
import { EntityHeader } from "@/components/TeacherContent/EntityHeader";
import { PublishedBadge } from "@/components/TeacherContent/PublishedBadge";
import { useTeacherContentStore } from "@/components/TeacherContent/TeacherContentProvider";
import type { Course } from "@/lib/mock/teacherData";

ModuleRegistry.registerModules([AllCommunityModule]);

interface CourseRow {
  id: string;
  title: string;
  description: string;
  curriculumTitle: string;
  subjectTitle: string;
  isPublished: boolean;
  lessonsCount: number;
  updatedAt: string;
}

function CourseCell({ data }: ICellRendererParams<CourseRow>) {
  const row = data!;
  return (
    <div className="space-y-1">
      <Link
        href={`/dashboard/Teacher/content/courses/${row.id}`}
        className="text-sm font-semibold text-white hover:text-white/80"
      >
        {row.title}
      </Link>
      <p className="line-clamp-2 text-xs text-white/50">{row.description}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/50">
        <span className="inline-flex items-center gap-1.5">
          <Layers className="size-3.5" />
          {row.curriculumTitle}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <BookOpen className="size-3.5" />
          {row.subjectTitle}
        </span>
      </div>
    </div>
  );
}

function UpdatedCell({ value }: ICellRendererParams<CourseRow, string>) {
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

function MetricCell({ value }: ICellRendererParams<CourseRow, number>) {
  return <span className="text-sm font-semibold text-white">{value}</span>;
}

function PublishedCell({ data }: ICellRendererParams<CourseRow>) {
  const row = data!;
  return <PublishedBadge isPublished={row.isPublished} />;
}

export default function ContentCoursesPage() {
  const searchParams = useSearchParams();
  const subjectId = searchParams.get("subjectId");

  const { courses, setCourses, subjects, curriculums, lessons } =
    useTeacherContentStore();
  const [isCreateOpen, setCreateOpen] = useState(false);

  const visibleCourses = useMemo(() => {
    if (!subjectId) return courses;
    return courses.filter((course) => course.subject === subjectId);
  }, [courses, subjectId]);

  const rows = useMemo<CourseRow[]>(() => {
    const toRow = (course: Course): CourseRow => {
      const subject = subjects.find((s) => s._id === course.subject) ?? null;
      const curriculum = subject
        ? curriculums.find((c) => c._id === subject.curriculum) ?? null
        : null;

      return {
        id: course._id,
        title: course.title,
        description: course.description ?? "No description provided.",
        curriculumTitle: curriculum?.title ?? "Curriculum",
        subjectTitle: subject?.title ?? "Subject",
        isPublished: course.isPublished,
        lessonsCount: lessons.filter((lesson) => lesson.course === course._id)
          .length,
        updatedAt: course.updatedAt,
      };
    };

    return visibleCourses.map(toRow);
  }, [visibleCourses]);

  const selectedSubjectTitle = useMemo(() => {
    if (!subjectId) return null;
    const subject = subjects.find((s) => s._id === subjectId) ?? null;
    return subject?.title ?? null;
  }, [subjectId, subjects]);

  const columnDefs = useMemo<ColDef<CourseRow>[]>(
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
        headerName: "Course",
        field: "title",
        cellRenderer: CourseCell,
        flex: 2,
        minWidth: 360,
      },
      {
        headerName: "Status",
        field: "isPublished",
        cellRenderer: PublishedCell,
        minWidth: 140,
      },
      {
        headerName: "Updated",
        field: "updatedAt",
        cellRenderer: UpdatedCell,
        minWidth: 150,
      },
      {
        headerName: "Lessons",
        field: "lessonsCount",
        cellRenderer: MetricCell,
        minWidth: 100,
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef<CourseRow>>(
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
        title="Courses"
        subtitle={
          selectedSubjectTitle
            ? `Courses under ${selectedSubjectTitle}.`
            : "Create courses under subjects, then structure lessons and videos."
        }
        actions={
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            <Plus className="size-4" />
            Create course
          </button>
        }
      />

      <ContentNavigation activeTab="Courses" />

      <section>
        <div className="ag-theme-quartz content-ag-grid h-[520px] rounded border border-white/5">
          <AgGridReact<CourseRow>
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

      <CreateCourseModal
        open={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        subjects={subjects}
        defaultSubjectId={subjectId}
        onCreate={(newCourse) => setCourses((prev) => [newCourse, ...prev])}
      />
    </section>
  );
}
