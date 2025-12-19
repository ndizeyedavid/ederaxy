"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";

import { ModalShell } from "@/components/TeacherContent/ModalShell";
import { useTeacherContentStore } from "@/components/TeacherContent/TeacherContentProvider";
import type {
  Lesson,
  LessonResource,
  ObjectIdString,
} from "@/lib/mock/teacherData";

interface AddLessonResourceModalProps {
  open: boolean;
  lessonId: ObjectIdString | null;
  onClose: () => void;
}

export function AddLessonResourceModal({
  open,
  lessonId,
  onClose,
}: AddLessonResourceModalProps) {
  const { lessons, setLessons } = useTeacherContentStore();

  const lesson: Lesson | null = useMemo(() => {
    if (!lessonId) return null;
    return lessons.find((l) => l._id === lessonId) ?? null;
  }, [lessonId, lessons]);

  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (!open) {
      setLabel("");
      setUrl("");
    }
  }, [open]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!lessonId) return;

    const cleaned: LessonResource = {
      label: label.trim(),
      url: url.trim(),
    };

    const now = new Date().toISOString();

    setLessons((prev) =>
      prev.map((l) => {
        if (l._id !== lessonId) return l;

        const existing = l.resources ?? [];
        return {
          ...l,
          resources: [...existing, cleaned],
          updatedAt: now,
        };
      })
    );

    onClose();
  };

  return (
    <ModalShell
      open={open}
      title={lesson ? `Add resource · ${lesson.title}` : "Add resource"}
      subtitle="Attach slides, PDFs, or external links to this lesson."
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-lesson-resource-form"
            className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
          >
            Add
          </button>
        </>
      }
    >
      <form
        id="add-lesson-resource-form"
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Label
          </label>
          <input
            value={label}
            onChange={(e) => setLabel(e.currentTarget.value)}
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
            placeholder="e.g. Slides, Worksheet, Notes"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            URL
          </label>
          <input
            value={url}
            onChange={(e) => setUrl(e.currentTarget.value)}
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
            placeholder="https://..."
          />
          <p className="mt-2 text-xs text-white/40">
            Tip: use a shareable link (Google Drive, Dropbox, etc.).
          </p>
        </div>
      </form>
    </ModalShell>
  );
}
