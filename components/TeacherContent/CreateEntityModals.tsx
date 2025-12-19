"use client";

import { useMemo, useState, type FormEvent } from "react";

import { ModalShell } from "@/components/TeacherContent/ModalShell";
import { ApiError } from "@/lib/api/client";
import { createCurriculum } from "@/lib/api/curriculums";
import { createAcademicLevel } from "@/lib/api/academicLevels";
import { createAcademicClass } from "@/lib/api/academicClasses";
import { createClassCombination } from "@/lib/api/classCombinations";
import { createSubject } from "@/lib/api/subjects";
import { createCourse } from "@/lib/api/courses";
import { createLesson } from "@/lib/api/lessons";
import type {
  AcademicClass,
  AcademicLevel,
  ClassCombination,
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
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await createCurriculum({
        name: title.trim(),
        description: description.trim() || undefined,
        country: country.trim() || undefined,
      });
      onCreate(res.curriculum);
      setTitle("");
      setCountry("");
      setDescription("");
      onClose();
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Create failed.");
    } finally {
      setSubmitting(false);
    }
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
            disabled={isSubmitting}
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-curriculum-form"
            disabled={isSubmitting}
            className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </>
      }
    >
      {submitError ? (
        <p className="text-sm font-semibold text-rose-200">{submitError}</p>
      ) : null}
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

export function CreateLevelModal({
  open,
  onClose,
  curriculums,
  onCreate,
  defaultCurriculumId,
}: BaseModalProps & {
  curriculums: Curriculum[];
  onCreate: (level: AcademicLevel) => void;
  defaultCurriculumId?: ObjectIdString | null;
}) {
  const fallbackCurriculumId = curriculums[0]?._id ?? "";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [curriculumId, setCurriculumId] = useState(
    defaultCurriculumId ?? fallbackCurriculumId
  );
  const [stage, setStage] = useState("");
  const [order, setOrder] = useState<number>(1);
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await createAcademicLevel({
        name: title.trim(),
        description: description.trim() || undefined,
        stage: stage.trim(),
        curriculumId,
        order,
      });
      onCreate(res.level);
      setTitle("");
      setDescription("");
      setStage("");
      setCurriculumId(defaultCurriculumId ?? fallbackCurriculumId);
      setOrder(1);
      onClose();
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Create failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      open={open}
      title="Create level"
      subtitle="Levels belong to curriculums and contain classes."
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-level-form"
            disabled={isSubmitting}
            className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </>
      }
    >
      {submitError ? (
        <p className="text-sm font-semibold text-rose-200">{submitError}</p>
      ) : null}
      <form
        id="create-level-form"
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
              placeholder="e.g. O'Level"
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
            Stage
          </label>
          <input
            value={stage}
            onChange={(e) => setStage(e.currentTarget.value)}
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
            placeholder="e.g. olevel"
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
            placeholder="Short level description"
          />
        </div>
      </form>
    </ModalShell>
  );
}

export function CreateClassModal({
  open,
  onClose,
  curriculums,
  levels,
  onCreate,
  defaultCurriculumId,
  defaultLevelId,
}: BaseModalProps & {
  curriculums: Curriculum[];
  levels: AcademicLevel[];
  onCreate: (academicClass: AcademicClass) => void;
  defaultCurriculumId?: ObjectIdString | null;
  defaultLevelId?: ObjectIdString | null;
}) {
  const fallbackCurriculumId = curriculums[0]?._id ?? "";

  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [curriculumId, setCurriculumId] = useState(
    defaultCurriculumId ?? fallbackCurriculumId
  );

  const availableLevels = useMemo(
    () => levels.filter((l) => l.curriculum === curriculumId),
    [curriculumId, levels]
  );

  const fallbackLevelId =
    defaultLevelId ?? availableLevels[0]?._id ?? levels[0]?._id ?? "";
  const [levelId, setLevelId] = useState<ObjectIdString | string>(
    fallbackLevelId
  );

  const [isSubmitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await createAcademicClass({
        name: title.trim(),
        code: code.trim(),
        description: description.trim() || undefined,
        levelId: String(levelId),
      });

      onCreate(res.academicClass);
      setTitle("");
      setCode("");
      setDescription("");
      setCurriculumId(defaultCurriculumId ?? fallbackCurriculumId);
      setLevelId(fallbackLevelId);
      onClose();
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Create failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      open={open}
      title="Create class"
      subtitle="Classes belong to a level within a curriculum."
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-class-form"
            disabled={isSubmitting}
            className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </>
      }
    >
      {submitError ? (
        <p className="text-sm font-semibold text-rose-200">{submitError}</p>
      ) : null}
      <form
        id="create-class-form"
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Curriculum
          </label>
          <select
            value={curriculumId}
            onChange={(e) => {
              const nextId = e.currentTarget.value;
              setCurriculumId(nextId);
              const nextLevels = levels.filter((l) => l.curriculum === nextId);
              setLevelId(nextLevels[0]?._id ?? "");
            }}
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
            Level
          </label>
          <select
            value={levelId}
            onChange={(e) => setLevelId(e.currentTarget.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white focus:border-emerald-400/70 focus:outline-none"
          >
            {availableLevels.map((l) => (
              <option key={l._id} value={l._id}>
                {l.title}
              </option>
            ))}
          </select>
          {!availableLevels.length ? (
            <p className="mt-2 text-sm text-white/50">
              No levels found for this curriculum.
            </p>
          ) : null}
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
            placeholder="e.g. S1"
          />
        </div>

        <div>
          <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Code
          </label>
          <input
            value={code}
            onChange={(e) => setCode(e.currentTarget.value)}
            required
            className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
            placeholder="e.g. S1"
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
            placeholder="Short class description"
          />
        </div>
      </form>
    </ModalShell>
  );
}

export function CreateCombinationModal({
  open,
  onClose,
  subjects,
  onCreate,
}: BaseModalProps & {
  subjects: Subject[];
  onCreate: (combination: ClassCombination) => void;
}) {
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [subjectIds, setSubjectIds] = useState<ObjectIdString[]>([]);
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const toggleSubject = (id: ObjectIdString) => {
    setSubjectIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await createClassCombination({
        name: title.trim(),
        code: code.trim(),
        type: type.trim() || undefined,
        description: description.trim() || undefined,
        subjects: subjectIds,
      });

      onCreate(res.combination);
      setTitle("");
      setCode("");
      setType("");
      setDescription("");
      setSubjectIds([]);
      onClose();
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Create failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalShell
      open={open}
      title="Create combination"
      subtitle="Combinations group subjects (e.g. STEM)."
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-combination-form"
            disabled={isSubmitting}
            className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </>
      }
    >
      {submitError ? (
        <p className="text-sm font-semibold text-rose-200">{submitError}</p>
      ) : null}
      <form
        id="create-combination-form"
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
            placeholder="e.g. S1 STEM"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
              Code
            </label>
            <input
              value={code}
              onChange={(e) => setCode(e.currentTarget.value)}
              required
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
              placeholder="e.g. MPC"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
              Type
            </label>
            <input
              value={type}
              onChange={(e) => setType(e.currentTarget.value)}
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
              placeholder="User-defined"
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
            placeholder="Short combination description"
          />
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Subjects (required)
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {subjects.map((s) => {
              const checked = subjectIds.includes(s._id);
              return (
                <label
                  key={s._id}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white/70"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSubject(s._id)}
                    className="size-4 rounded border-white/30 bg-transparent text-emerald-400 focus:ring-emerald-500"
                    required={subjectIds.length === 0}
                  />
                  {s.title}
                </label>
              );
            })}
            {!subjects.length ? (
              <p className="text-sm text-white/50">No subjects found.</p>
            ) : null}
          </div>
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
  classes,
  combinations,
  onCreate,
  defaultCurriculumId,
}: BaseModalProps & {
  curriculums: Curriculum[];
  levels: AcademicLevel[];
  classes: AcademicClass[];
  combinations: ClassCombination[];
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
  const [targetClassIds, setTargetClassIds] = useState<ObjectIdString[]>([]);
  const [targetCombinationIds, setTargetCombinationIds] = useState<
    ObjectIdString[]
  >([]);

  const availableLevels = useMemo(
    () => levels.filter((level) => level.curriculum === curriculumId),
    [curriculumId, levels]
  );

  const toggleLevel = (id: ObjectIdString) => {
    setTargetLevelIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const availableClasses = useMemo(
    () => classes.filter((c) => c.curriculum === curriculumId),
    [classes, curriculumId]
  );

  const availableCombinations = useMemo(() => combinations, [combinations]);

  const toggleClass = (id: ObjectIdString) => {
    setTargetClassIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleCombination = (id: ObjectIdString) => {
    setTargetCombinationIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const [isSubmitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await createSubject({
        title: title.trim(),
        description: description.trim() || undefined,
        curriculumId,
        targetLevelIds,
        targetClassIds,
        targetCombinationIds,
      });

      onCreate(res.subject);
      setTitle("");
      setDescription("");
      setCurriculumId(defaultCurriculumId ?? fallbackCurriculumId);
      setTargetLevelIds([]);
      setTargetClassIds([]);
      setTargetCombinationIds([]);
      onClose();
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Create failed.");
    } finally {
      setSubmitting(false);
    }
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
            disabled={isSubmitting}
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-subject-form"
            disabled={isSubmitting}
            className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </>
      }
    >
      {submitError ? (
        <p className="text-sm font-semibold text-rose-200">{submitError}</p>
      ) : null}
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
            onChange={(e) => {
              setCurriculumId(e.currentTarget.value);
              setTargetLevelIds([]);
              setTargetClassIds([]);
              setTargetCombinationIds([]);
            }}
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

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Target classes (optional)
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {availableClasses.map((academicClass) => {
              const checked = targetClassIds.includes(academicClass._id);
              return (
                <label
                  key={academicClass._id}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white/70"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleClass(academicClass._id)}
                    className="size-4 rounded border-white/30 bg-transparent text-emerald-400 focus:ring-emerald-500"
                  />
                  {academicClass.title}
                </label>
              );
            })}
            {!availableClasses.length ? (
              <p className="text-sm text-white/50">
                No classes found for this curriculum.
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Target combinations (optional)
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {availableCombinations.map((combo) => {
              const checked = targetCombinationIds.includes(combo._id);
              return (
                <label
                  key={combo._id}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white/70"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleCombination(combo._id)}
                    className="size-4 rounded border-white/30 bg-transparent text-emerald-400 focus:ring-emerald-500"
                  />
                  {combo.title}
                </label>
              );
            })}
            {!availableCombinations.length ? (
              <p className="text-sm text-white/50">No combinations found.</p>
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
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await createCourse({
        title: title.trim(),
        description: description.trim() || undefined,
        subjectId,
        isPublished,
      });

      onCreate(res.course);
      setTitle("");
      setDescription("");
      setSubjectId(defaultSubjectId ?? fallbackSubjectId);
      setIsPublished(false);
      onClose();
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Create failed.");
    } finally {
      setSubmitting(false);
    }
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
            disabled={isSubmitting}
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-course-form"
            disabled={isSubmitting}
            className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </>
      }
    >
      {submitError ? (
        <p className="text-sm font-semibold text-rose-200">{submitError}</p>
      ) : null}
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
  const [isSubmitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const cleanedResources = resources
      .map((r) => ({ label: r.label.trim(), url: r.url.trim() }))
      .filter((r) => r.label && r.url);

    setSubmitError(null);
    setSubmitting(true);
    try {
      const res = await createLesson({
        title: title.trim(),
        description: description.trim() || undefined,
        order,
        courseId,
        resources: cleanedResources.length ? cleanedResources : undefined,
      });

      onCreate(res.lesson);
      setTitle("");
      setDescription("");
      setOrder(nextOrder);
      setResources([]);
      onClose();
    } catch (err) {
      setSubmitError(err instanceof ApiError ? err.message : "Create failed.");
    } finally {
      setSubmitting(false);
    }
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
            disabled={isSubmitting}
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-lesson-form"
            disabled={isSubmitting}
            className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
          >
            {isSubmitting ? "Creating..." : "Create"}
          </button>
        </>
      }
    >
      {submitError ? (
        <p className="text-sm font-semibold text-rose-200">{submitError}</p>
      ) : null}
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
