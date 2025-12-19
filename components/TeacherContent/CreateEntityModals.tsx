"use client";

import { useMemo, useState, type FormEvent } from "react";

import { ModalShell } from "@/components/TeacherContent/ModalShell";
import type {
  AcademicLevel,
  Course,
  Curriculum,
  Lesson,
  LessonResource,
  ObjectIdString,
  Subject,
} from "@/lib/mock/teacherData";

function generateObjectId(): ObjectIdString {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 24);
  }

  return String(Date.now()).padStart(24, "0").slice(0, 24);
}

interface BaseModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateCurriculumModal({
  open,
  onClose,
  onCreate,
}: BaseModalProps & {
  onCreate: (curriculum: Curriculum) => void;
}) {
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const now = new Date().toISOString();
    const payload: Curriculum = {
      _id: generateObjectId(),
      title: title.trim(),
      description: description.trim() || undefined,
      country: country.trim() || undefined,
      createdBy: "local-teacher",
      createdAt: now,
      updatedAt: now,
    };

    onCreate(payload);
    setTitle("");
    setCountry("");
    setDescription("");
    onClose();
  };

  return (
    <ModalShell
      open={open}
      title="Create curriculum"
      subtitle="Curriculums group subjects and courses."
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
            form="create-curriculum-form"
            className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
          >
            Create
          </button>
        </>
      }
    >
      <form
        id="create-curriculum-form"
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
            placeholder="e.g. Rwanda REB"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Country (optional)
          </label>
          <input
            value={country}
            onChange={(e) => setCountry(e.currentTarget.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
            placeholder="e.g. Rwanda"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
            placeholder="Short curriculum description"
          />
        </div>
      </form>
    </ModalShell>
  );
}

export function CreateSubjectModal({
  open,
  onClose,
  curriculums,
  levels,
  onCreate,
  defaultCurriculumId,
}: BaseModalProps & {
  curriculums: Curriculum[];
  levels: AcademicLevel[];
  onCreate: (subject: Subject) => void;
  defaultCurriculumId?: ObjectIdString | null;
}) {
  const fallbackCurriculumId = curriculums[0]?._id ?? "";
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [curriculumId, setCurriculumId] = useState(
    defaultCurriculumId ?? fallbackCurriculumId
  );
  const [targetLevelIds, setTargetLevelIds] = useState<ObjectIdString[]>([]);

  const availableLevels = useMemo(
    () => levels.filter((level) => level.curriculum === curriculumId),
    [curriculumId, levels]
  );

  const toggleLevel = (id: ObjectIdString) => {
    setTargetLevelIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const now = new Date().toISOString();
    const payload: Subject = {
      _id: generateObjectId(),
      title: title.trim(),
      description: description.trim() || undefined,
      curriculum: curriculumId,
      targetLevels: targetLevelIds.length ? targetLevelIds : undefined,
      createdBy: "local-teacher",
      createdAt: now,
      updatedAt: now,
    };

    onCreate(payload);
    setTitle("");
    setDescription("");
    setCurriculumId(defaultCurriculumId ?? fallbackCurriculumId);
    setTargetLevelIds([]);
    onClose();
  };

  return (
    <ModalShell
      open={open}
      title="Create subject"
      subtitle="Subjects belong to curriculums and contain courses."
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
            form="create-subject-form"
            className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
          >
            Create
          </button>
        </>
      }
    >
      <form
        id="create-subject-form"
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Curriculum
          </label>
          <select
            value={curriculumId}
            onChange={(e) => setCurriculumId(e.currentTarget.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white focus:border-emerald-400/70 focus:outline-none"
          >
            {curriculums.map((c) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
            placeholder="e.g. Software Development"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
            placeholder="Short subject description"
          />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Target levels (optional)
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {availableLevels.map((level) => {
              const checked = targetLevelIds.includes(level._id);
              return (
                <label
                  key={level._id}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white/70"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleLevel(level._id)}
                    className="size-4 rounded border-white/30 bg-transparent text-emerald-400 focus:ring-emerald-500"
                  />
                  {level.title}
                </label>
              );
            })}
            {!availableLevels.length ? (
              <p className="text-sm text-white/50">
                No levels found for this curriculum.
              </p>
            ) : null}
          </div>
        </div>
      </form>
    </ModalShell>
  );
}

export function CreateCourseModal({
  open,
  onClose,
  subjects,
  onCreate,
  defaultSubjectId,
}: BaseModalProps & {
  subjects: Subject[];
  onCreate: (course: Course) => void;
  defaultSubjectId?: ObjectIdString | null;
}) {
  const fallbackSubjectId = subjects[0]?._id ?? "";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState(
    defaultSubjectId ?? fallbackSubjectId
  );
  const [isPublished, setIsPublished] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const now = new Date().toISOString();
    const payload: Course = {
      _id: generateObjectId(),
      title: title.trim(),
      description: description.trim() || undefined,
      subject: subjectId,
      teacher: "local-teacher",
      isPublished,
      createdAt: now,
      updatedAt: now,
    };

    onCreate(payload);
    setTitle("");
    setDescription("");
    setSubjectId(defaultSubjectId ?? fallbackSubjectId);
    setIsPublished(false);
    onClose();
  };

  return (
    <ModalShell
      open={open}
      title="Create course"
      subtitle="Courses belong to subjects and contain lessons."
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
            form="create-course-form"
            className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
          >
            Create
          </button>
        </>
      }
    >
      <form
        id="create-course-form"
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Subject
          </label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.currentTarget.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white focus:border-emerald-400/70 focus:outline-none"
          >
            {subjects.map((s) => (
              <option key={s._id} value={s._id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.currentTarget.value)}
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
            placeholder="Course title"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
            placeholder="Short course description"
          />
        </div>

        <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white/70">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.currentTarget.checked)}
            className="size-4 rounded border-white/30 bg-transparent text-emerald-400 focus:ring-emerald-500"
          />
          Published
        </label>
      </form>
    </ModalShell>
  );
}

export function CreateLessonModal({
  open,
  onClose,
  courseId,
  existingLessons,
  onCreate,
}: BaseModalProps & {
  courseId: ObjectIdString;
  existingLessons: Lesson[];
  onCreate: (lesson: Lesson) => void;
}) {
  const nextOrder = useMemo(() => {
    const maxOrder = existingLessons.reduce(
      (acc, lesson) => Math.max(acc, lesson.order),
      0
    );
    return maxOrder + 1;
  }, [existingLessons]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState<number>(nextOrder);
  const [resources, setResources] = useState<LessonResource[]>([]);

  const addResource = () => {
    setResources((prev) => [...prev, { label: "", url: "" }]);
  };

  const updateResource = (index: number, patch: Partial<LessonResource>) => {
    setResources((prev) =>
      prev.map((res, i) => (i === index ? { ...res, ...patch } : res))
    );
  };

  const removeResource = (index: number) => {
    setResources((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const now = new Date().toISOString();
    const cleanedResources = resources
      .map((r) => ({ label: r.label.trim(), url: r.url.trim() }))
      .filter((r) => r.label && r.url);

    const payload: Lesson = {
      _id: generateObjectId(),
      title: title.trim(),
      description: description.trim() || undefined,
      order,
      course: courseId,
      resources: cleanedResources.length ? cleanedResources : undefined,
      video: null,
      createdAt: now,
      updatedAt: now,
    };

    onCreate(payload);
    setTitle("");
    setDescription("");
    setOrder(nextOrder);
    setResources([]);
    onClose();
  };

  return (
    <ModalShell
      open={open}
      title="Create lesson"
      subtitle="Lessons belong to a course and may link to a video."
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
            form="create-lesson-form"
            className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
          >
            Create
          </button>
        </>
      }
    >
      <form
        id="create-lesson-form"
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
              placeholder="Lesson title"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
              Order
            </label>
            <input
              type="number"
              min={1}
              value={order}
              onChange={(e) => setOrder(Number(e.currentTarget.value))}
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white focus:border-emerald-400/70 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            rows={3}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
            placeholder="Lesson overview"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
              Resources (optional)
            </p>
            <button
              type="button"
              onClick={addResource}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
            >
              Add resource
            </button>
          </div>

          {resources.length ? (
            <div className="space-y-3">
              {resources.map((resource, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-2xl border border-white/10 bg-[#0f1117] p-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                >
                  <input
                    value={resource.label}
                    onChange={(e) =>
                      updateResource(index, { label: e.currentTarget.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
                    placeholder="Label (e.g. Slides)"
                  />
                  <input
                    value={resource.url}
                    onChange={(e) =>
                      updateResource(index, { url: e.currentTarget.value })
                    }
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
                    placeholder="URL (https://...)"
                  />
                  <button
                    type="button"
                    onClick={() => removeResource(index)}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/50">
              No resources yet. Add PDFs, slides, or external links.
            </p>
          )}
        </div>
      </form>
    </ModalShell>
  );
}
