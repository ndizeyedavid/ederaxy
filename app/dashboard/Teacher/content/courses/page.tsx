"use client";

import Image from "next/image";
import { useMemo } from "react";

import { AgGridReact } from "ag-grid-react";
import type { ColDef, ICellRendererParams } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Filter, Globe2, Upload, Users } from "lucide-react";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import Link from "next/link";
import ContentNavigation from "@/components/Dashboard/ContentNavigation";

ModuleRegistry.registerModules([AllCommunityModule]);

interface VideoRow {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
  visibility: string;
  target: string;
  date: string;
  status: string;
  lessons: number;
  Plays: string;
}

const videoRows: VideoRow[] = [
  {
    id: "vid-1",
    title: "Making a 2D game in GODOT",
    description:
      "Build a platformer level from scratch, covering tilemaps, player movement, enemies, and polish techniques for a smooth final experience.",
    thumbnail: "/videos/ai-vs-ml-thumb.jpg",
    duration: "0:50",
    visibility: "Public",
    target: "O'Level",
    date: "Aug 15, 2025",
    status: "Published",
    lessons: 4,
    Plays: "-",
  },
  {
    id: "vid-2",
    title: "Algebra mastery recap",
    description:
      "A quick walkthrough of common algebra misconceptions with animations and practice prompts to send to your cohort.",
    thumbnail: "/videos/ai-vs-ml-thumb.jpg",
    duration: "12:03",
    visibility: "Private",
    target: "Primary",
    date: "Aug 10, 2025",
    status: "Published",
    lessons: 12,
    Plays: "18",
  },
  {
    id: "vid-3",
    title: "STEM lab prep walkthrough",
    description:
      "Set expectations for tomorrow’s solar energy lab and show students how to prep their science notebooks.",
    thumbnail: "/videos/ai-vs-ml-thumb.jpg",
    duration: "07:48",
    visibility: "Unlisted",
    target: "Primary",
    date: "Aug 4, 2025",
    status: "Processing",
    lessons: 28,
    Plays: "32",
  },
];

function VideoCell({ data }: ICellRendererParams<VideoRow>) {
  const row = data!;
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-16 w-full">
        <div className="absolute inset-0  scale-[0.97] rounded  bg-[#424651] blur-[0.2px]" />
        <div className="absolute inset-0 translate-y-[2px] scale-[0.985] rounded bg-[#767d93]" />
        <Image
          src={row.thumbnail}
          alt={row.title}
          fill
          className="object-cover rounded pt-1"
        />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-semibold text-white">{row.title}</p>
        <p className="line-clamp-2 text-xs text-white/50">{row.description}</p>
      </div>
    </div>
  );
}

function targetCell({ data }: ICellRendererParams<VideoRow>) {
  const row = data!;
  return <span className="text-sm text-white/80">{row.target}</span>;
}

function DateCell({ data }: ICellRendererParams<VideoRow>) {
  const row = data!;
  return (
    <div className="space-y-1 text-sm text-white">
      <p>{row.date}</p>
      <p className="text-xs text-white/50">{row.status}</p>
    </div>
  );
}

function MetricCell({ value }: ICellRendererParams<VideoRow, number | string>) {
  return <span className="text-sm font-semibold text-white">{value}</span>;
}

export default function ContentCoursesPage() {
  const columnDefs = useMemo<ColDef<VideoRow>[]>(
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
        cellRenderer: VideoCell,
        flex: 2,
        minWidth: 360,
      },
      {
        headerName: "Target Audience",
        field: "target",
        cellRenderer: targetCell,
        minWidth: 190,
      },
      {
        headerName: "Date",
        field: "date",
        cellRenderer: DateCell,
        minWidth: 150,
      },
      {
        headerName: "Lessons",
        field: "lessons",
        cellRenderer: MetricCell,
        minWidth: 100,
      },
      {
        headerName: "Plays",
        field: "Plays",
        cellRenderer: MetricCell,
        minWidth: 100,
      },
    ],
    []
  );

  const defaultColDef = useMemo<ColDef<VideoRow>>(
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
      <header className="flex items-center justify-between text-white">
        <h1 className="text-xl font-bold ">Channel Content</h1>
      </header>

      <ContentNavigation activeTab="Courses" />

      <section>
        <div className="ag-theme-quartz content-ag-grid h-[520px] rounded border border-white/5">
          <AgGridReact<VideoRow>
            rowData={videoRows}
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
