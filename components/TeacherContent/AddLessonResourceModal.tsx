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

  const apiBase =
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:8080";

  const lesson: Lesson | null = useMemo(() => {
    if (!lessonId) return null;
    return lessons.find((l) => l._id === lessonId) ?? null;
  }, [lessonId, lessons]);

  const [label, setLabel] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setLabel("");
      setFile(null);
      setPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return null;
      });
      setUploading(false);
      setError(null);
    }
  }, [open]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return null;
      });
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return url;
    });

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!lessonId) return;

    setError(null);

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("label", label.trim());
      formData.append("resource", file);

      const response = await fetch(
        `${apiBase}/api/v1/lessons/${lessonId}/resources`,
        {
          method: "POST",
          body: formData,
        }
      );

      const json = (await response.json()) as {
        status: "success" | "error";
        message?: string;
        data?: { url: string; label: string };
      };

      if (!response.ok || json.status !== "success" || !json.data?.url) {
        throw new Error(json.message || "Upload failed.");
      }

      const cleaned: LessonResource = {
        label: json.data.label ?? label.trim(),
        url: json.data.url,
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
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
            disabled={isUploading}
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="add-lesson-resource-form"
            disabled={isUploading}
            className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
          >
            {isUploading ? "Uploading..." : "Upload"}
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
            File
          </label>
          <input
            type="file"
            onChange={(e) => {
              setError(null);
              setFile(e.currentTarget.files?.[0] ?? null);
            }}
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
          />
          <p className="mt-2 text-xs text-white/40">
            Uploads are stored locally for now and served from the app.
          </p>
        </div>

        {file ? (
          <div className="space-y-3 rounded-2xl border border-white/10 bg-[#0f1117] p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">Preview</p>
                <p className="mt-1 text-xs text-white/50">
                  {file.name} · {(file.size / (1024 * 1024)).toFixed(2)} MB ·{" "}
                  {file.type || "application/octet-stream"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                disabled={isUploading}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
              >
                Remove
              </button>
            </div>

            {previewUrl && file.type.startsWith("image/") ? (
              <img
                src={previewUrl}
                alt={file.name}
                className="max-h-64 w-full rounded-xl border border-white/10 object-contain"
              />
            ) : null}

            {previewUrl && file.type === "application/pdf" ? (
              <iframe
                src={previewUrl}
                title={file.name}
                className="h-72 w-full rounded-xl border border-white/10 bg-black/30"
              />
            ) : null}

            {!file.type.startsWith("image/") &&
            file.type !== "application/pdf" ? (
              <p className="text-sm text-white/60">
                No inline preview available for this file type.
              </p>
            ) : null}
          </div>
        ) : null}

        {error ? <p className="text-sm text-rose-200">{error}</p> : null}
      </form>
    </ModalShell>
  );
}
