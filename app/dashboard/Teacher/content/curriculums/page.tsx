"use client";

import Link from "next/link";
import { BookOpen, Layers, MapPin } from "lucide-react";

import ContentNavigation from "@/components/Dashboard/ContentNavigation";
import { CreateCurriculumModal } from "@/components/TeacherContent/CreateEntityModals";
import { EntityCard } from "@/components/TeacherContent/EntityCard";
import { EntityHeader } from "@/components/TeacherContent/EntityHeader";
import { useTeacherContentStore } from "@/components/TeacherContent/TeacherContentProvider";
import { useState } from "react";

export default function ContentCurriculumsPage() {
  const { curriculums, setCurriculums, levels, subjects } =
    useTeacherContentStore();
  const [isCreateOpen, setCreateOpen] = useState(false);

  return (
    <section className="space-y-6">
      <EntityHeader
        title="Curriculums"
        subtitle="Organize content by curriculum, then create subjects and courses."
        actions={
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Create curriculum
          </button>
        }
      />

      <ContentNavigation activeTab="Curriculums" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {curriculums.map((curriculum) => {
          const levelsCount = levels.filter(
            (level) => level.curriculum === curriculum._id
          ).length;
          const subjectsCount = subjects.filter(
            (subject) => subject.curriculum === curriculum._id
          ).length;

          return (
            <Link
              key={curriculum._id}
              href={`/dashboard/Teacher/content/subjects?curriculumId=${curriculum._id}`}
              className="block"
            >
              <EntityCard
                title={curriculum.title}
                description={curriculum.description}
                meta={
                  curriculum.country ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                      <MapPin className="size-4" />
                      {curriculum.country}
                    </span>
                  ) : null
                }
                footer={
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span className="inline-flex items-center gap-2">
                      <Layers className="size-4" />
                      {levelsCount} levels
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <BookOpen className="size-4" />
                      {subjectsCount} subjects
                    </span>
                  </div>
                }
              />
            </Link>
          );
        })}
      </div>

      <CreateCurriculumModal
        open={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={(newCurriculum) =>
          setCurriculums((prev) => [newCurriculum, ...prev])
        }
      />
    </section>
  );
}
