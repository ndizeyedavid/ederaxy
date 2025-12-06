"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";

export interface LessonDetailsStats {
  views: string;
  date: string;
  grade: string;
  lesson: string;
  unit: string;
}

export interface LessonResourceCard {
  title: string;
  byline: string;
  thumbnailSrc: string;
  actionLabel?: string;
}

export interface LessonTabConfig {
  id: string;
  label: string;
  icon: LucideIcon;
  content: ReactNode;
}

interface LessonDetailsPanelProps {
  stats: LessonDetailsStats;
  tabs: LessonTabConfig[];
}

export default function LessonDetailsPanel({
  stats,
  tabs,
}: LessonDetailsPanelProps) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.id ?? "");

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <section className="rounded-2xl bg-[#181818] px-5 py-5 text-neutral-200">
      <div className="space-y-1 text-sm">
        <p>
          <span className="font-semibold text-white">{stats.views}</span>
          <span className="text-neutral-400"> · {stats.date}</span>
        </p>
        <p>
          <span className="font-semibold text-white">Grade:</span> {stats.grade}
        </p>
        <p>
          <span className="font-semibold text-white">Lesson:</span>{" "}
          {stats.lesson}
        </p>
        <p>
          <span className="font-semibold text-white">Unit:</span> {stats.unit}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? "border-[#5b5b5b] bg-[#2a2a2a] text-white"
                  : "border-[#3a3a3a] text-white hover:bg-[#2a2a2a]"
              }`}
            >
              <Icon size={18} /> {tab.label}
            </button>
          );
        })}
      </div>

      {activeContent && (
        <div className="mt-4 rounded-2xl border border-[#2a2a2a] bg-[#202020] p-4 text-sm text-neutral-200">
          {activeContent}
        </div>
      )}

      {/* <button className="mt-4 text-sm font-medium text-white hover:text-neutral-300">
        Show less
      </button> */}
    </section>
  );
}
