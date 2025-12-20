"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BookOpen, GraduationCap, Layers } from "lucide-react";

import ContentNavigation from "@/components/Dashboard/ContentNavigation";
import { CreateSubjectModal } from "@/components/TeacherContent/CreateEntityModals";
import { EntityCard } from "@/components/TeacherContent/EntityCard";
import { EntityHeader } from "@/components/TeacherContent/EntityHeader";
import { useTeacherContentStore } from "@/components/TeacherContent/TeacherContentProvider";

export default function ContentSubjectsPage() {
  const searchParams = useSearchParams();
  const curriculumId = searchParams.get("curriculumId");

  const {
    curriculums,
    levels,
    classes,
    combinations,
    subjects,
    setSubjects,
    courses,
  } = useTeacherContentStore();
  const [isCreateOpen, setCreateOpen] = useState(false);

  const activeCurriculum = useMemo(() => {
    if (!curriculumId) return null;
    return (
      curriculums.find((curriculum) => curriculum._id === curriculumId) ?? null
    );
  }, [curriculumId]);

  const visibleSubjects = useMemo(() => {
    if (!curriculumId) return subjects;
    return subjects.filter((subject) => subject.curriculum === curriculumId);
  }, [curriculumId, subjects]);

  const subtitle = activeCurriculum
    ? `Subjects under ${activeCurriculum.title}.`
    : "Create subjects under a curriculum, then build courses.";

  return (
    <section className="space-y-6">
      <EntityHeader
        title="Subjects"
        subtitle={subtitle}
        actions={
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Create subject
          </button>
        }
      />

      <ContentNavigation activeTab="Subjects" />

      {activeCurriculum ? (
        <div className="rounded-2xl border border-white/10 bg-[#0f1117] p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/40">
            Active curriculum
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="text-base font-semibold">
              {activeCurriculum.title}
            </span>
            {activeCurriculum.country ? (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                {activeCurriculum.country}
              </span>
            ) : null}
            <Link
              href="/dashboard/Teacher/content/curriculums"
              className="text-sm font-semibold text-emerald-200 hover:text-emerald-100"
            >
              Change
            </Link>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleSubjects.map((subject) => {
          const curriculum =
            curriculums.find((c) => c._id === subject.curriculum) ?? null;

          const coursesCount = courses.filter(
            (course) => course.subject === subject._id
          ).length;

          const targetLevels = (subject.targetLevels ?? [])
            .map((id) => levels.find((l) => l._id === id)?.title)
            .filter(Boolean)
            .slice(0, 2) as string[];

          return (
            <Link
              key={subject._id}
              href={`/dashboard/Teacher/content/courses?subjectId=${subject._id}`}
              className="block"
            >
              <EntityCard
                title={subject.title}
                description={subject.description}
                meta={
                  curriculum ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/70">
                      <Layers className="size-4" />
                      {curriculum.title}
                    </span>
                  ) : null
                }
                footer={
                  <div className="space-y-2">
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span className="inline-flex items-center gap-2">
                        <BookOpen className="size-4" />
                        {coursesCount} courses
                      </span>
                      {targetLevels.length ? (
                        <span className="inline-flex items-center gap-2">
                          <GraduationCap className="size-4" />
                          {targetLevels.join(", ")}
                          {subject.targetLevels &&
                          subject.targetLevels.length > 2
                            ? " +" + (subject.targetLevels.length - 2)
                            : ""}
                        </span>
                      ) : null}
                    </div>
                  </div>
                }
              />
            </Link>
          );
        })}
      </div>

      <CreateSubjectModal
        open={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        curriculums={curriculums}
        levels={levels}
        classes={classes}
        combinations={combinations}
        defaultCurriculumId={curriculumId}
        onCreate={(newSubject) => setSubjects((prev) => [newSubject, ...prev])}
      />
    </section>
  );
}
