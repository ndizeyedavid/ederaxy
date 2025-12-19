"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";

import {
  CreateCourseModal,
  CreateLevelModal,
  CreateCurriculumModal,
  CreateClassModal,
  CreateCombinationModal,
  CreateLessonModal,
  CreateSubjectModal,
} from "@/components/TeacherContent/CreateEntityModals";
import { EntityHeader } from "@/components/TeacherContent/EntityHeader";
import { useTeacherContentStore } from "@/components/TeacherContent/TeacherContentProvider";
import type {
  Course,
  Curriculum,
  Lesson,
  AcademicLevel,
  AcademicClass,
  ClassCombination,
  ObjectIdString,
  Subject,
  Video,
} from "@/lib/mock/teacherData";

type WizardStep =
  | "curriculum"
  | "level"
  | "class"
  | "combination"
  | "subject"
  | "course"
  | "lesson"
  | "video"
  | "review"
  | "submitting"
  | "done";

function generateObjectId(): ObjectIdString {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 24);
  }

  return String(Date.now()).padStart(24, "0").slice(0, 24);
}

function StepPill({
  active,
  title,
  index,
}: {
  active: boolean;
  title: string;
  index: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={
          active
            ? "flex size-8 items-center justify-center rounded-full bg-emerald-400 text-sm font-semibold text-emerald-950"
            : "flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-semibold text-white/60"
        }
      >
        {index}
      </div>
      <p
        className={
          active ? "text-sm font-semibold text-white" : "text-sm text-white/50"
        }
      >
        {title}
      </p>
    </div>
  );
}

export default function UploadVideoWizardPage() {
  const {
    curriculums,
    setCurriculums,
    levels,
    setLevels,
    classes,
    setClasses,
    combinations,
    setCombinations,
    subjects,
    setSubjects,
    courses,
    setCourses,
    lessons,
    setLessons,
    videos,
    setVideos,
  } = useTeacherContentStore();

  const [step, setStep] = useState<WizardStep>("curriculum");

  const [selectedCurriculumId, setSelectedCurriculumId] = useState<
    ObjectIdString | ""
  >(curriculums[0]?._id ?? "");

  const [selectedLevelId, setSelectedLevelId] = useState<ObjectIdString | "">(
    ""
  );
  const [selectedClassId, setSelectedClassId] = useState<ObjectIdString | "">(
    ""
  );
  const [selectedCombinationId, setSelectedCombinationId] = useState<
    ObjectIdString | ""
  >("");

  const [selectedSubjectId, setSelectedSubjectId] = useState<
    ObjectIdString | ""
  >("");
  const [selectedCourseId, setSelectedCourseId] = useState<ObjectIdString | "">(
    ""
  );
  const [selectedLessonId, setSelectedLessonId] = useState<ObjectIdString | "">(
    ""
  );

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string | null>(
    null
  );

  const [isCreateCurriculumOpen, setCreateCurriculumOpen] = useState(false);
  const [isCreateLevelOpen, setCreateLevelOpen] = useState(false);
  const [isCreateClassOpen, setCreateClassOpen] = useState(false);
  const [isCreateCombinationOpen, setCreateCombinationOpen] = useState(false);
  const [isCreateSubjectOpen, setCreateSubjectOpen] = useState(false);
  const [isCreateCourseOpen, setCreateCourseOpen] = useState(false);
  const [isCreateLessonOpen, setCreateLessonOpen] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (phaseTimerRef.current) {
      clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearTimers();
      setThumbnailPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return null;
      });
    };
  }, []);

  const availableSubjects = useMemo(() => {
    if (!selectedCurriculumId) return [];
    return subjects.filter((s) => {
      if (s.curriculum !== selectedCurriculumId) return false;

      if (selectedLevelId) {
        const allowed = s.targetLevels;
        if (allowed?.length && !allowed.includes(selectedLevelId)) return false;
      }

      if (selectedClassId) {
        const allowed = s.targetClasses;
        if (allowed?.length && !allowed.includes(selectedClassId)) return false;
      }

      if (selectedCombinationId) {
        const allowed = s.targetCombinations;
        if (allowed?.length && !allowed.includes(selectedCombinationId))
          return false;
      }

      return true;
    });
  }, [
    selectedClassId,
    selectedCombinationId,
    selectedCurriculumId,
    selectedLevelId,
    subjects,
  ]);

  const availableLevels = useMemo(() => {
    if (!selectedCurriculumId) return [];
    return levels
      .filter((l) => l.curriculum === selectedCurriculumId)
      .slice()
      .sort((a, b) => a.order - b.order);
  }, [levels, selectedCurriculumId]);

  const availableClasses = useMemo(() => {
    if (!selectedCurriculumId) return [];
    const filtered = classes.filter(
      (c) => c.curriculum === selectedCurriculumId
    );
    if (!selectedLevelId) return filtered;
    return filtered.filter((c) => c.academicLevel === selectedLevelId);
  }, [classes, selectedCurriculumId, selectedLevelId]);

  const availableCombinations = useMemo(() => {
    if (!selectedCurriculumId) return [];

    const subjectCurriculumById = new Map<ObjectIdString, ObjectIdString>();
    subjects.forEach((s) => {
      subjectCurriculumById.set(s._id, s.curriculum);
    });

    return combinations.filter((combo) =>
      combo.subjects.some(
        (id) => subjectCurriculumById.get(id) === selectedCurriculumId
      )
    );
  }, [combinations, selectedCurriculumId, subjects]);

  const availableCourses = useMemo(() => {
    if (!selectedSubjectId) return [];
    return courses.filter((c) => c.subject === selectedSubjectId);
  }, [courses, selectedSubjectId]);

  const availableLessons = useMemo(() => {
    if (!selectedCourseId) return [];
    return lessons
      .filter((l) => l.course === selectedCourseId)
      .slice()
      .sort((a, b) => a.order - b.order);
  }, [lessons, selectedCourseId]);

  const selectedCurriculum = useMemo(
    () => curriculums.find((c) => c._id === selectedCurriculumId) ?? null,
    [curriculums, selectedCurriculumId]
  );
  const selectedLevel = useMemo(
    () => levels.find((l) => l._id === selectedLevelId) ?? null,
    [levels, selectedLevelId]
  );
  const selectedClass = useMemo(
    () => classes.find((c) => c._id === selectedClassId) ?? null,
    [classes, selectedClassId]
  );
  const selectedCombination = useMemo(
    () => combinations.find((c) => c._id === selectedCombinationId) ?? null,
    [combinations, selectedCombinationId]
  );
  const selectedSubject = useMemo(
    () => subjects.find((s) => s._id === selectedSubjectId) ?? null,
    [selectedSubjectId, subjects]
  );
  const selectedCourse = useMemo(
    () => courses.find((c) => c._id === selectedCourseId) ?? null,
    [courses, selectedCourseId]
  );
  const selectedLesson = useMemo(
    () => lessons.find((l) => l._id === selectedLessonId) ?? null,
    [lessons, selectedLessonId]
  );

  const handleCurriculumChange = (id: string) => {
    setSelectedCurriculumId(id);
    setSelectedLevelId("");
    setSelectedClassId("");
    setSelectedCombinationId("");
    setSelectedSubjectId("");
    setSelectedCourseId("");
    setSelectedLessonId("");
  };

  const handleSubjectChange = (id: string) => {
    setSelectedSubjectId(id);
    setSelectedCourseId("");
    setSelectedLessonId("");
  };

  const handleCourseChange = (id: string) => {
    setSelectedCourseId(id);
    setSelectedLessonId("");
  };

  const handleVideoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    setVideoFile(file);
  };

  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;

    setThumbnailFile(file);

    setThumbnailPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const canGoNextFromCurriculum = Boolean(selectedCurriculumId);
  const canGoNextFromLevel = true;
  const canGoNextFromClass = true;
  const canGoNextFromCombination = true;
  const canGoNextFromSubject = Boolean(selectedSubjectId);
  const canGoNextFromCourse = Boolean(selectedCourseId);
  const canGoNextFromLesson = Boolean(selectedLessonId);
  const canGoNextFromVideo = Boolean(videoFile && thumbnailFile);

  const next = () => {
    setSubmitError(null);
    if (step === "curriculum") {
      if (!canGoNextFromCurriculum) return;
      setStep("level");
      return;
    }
    if (step === "level") {
      if (!canGoNextFromLevel) return;
      setStep("class");
      return;
    }
    if (step === "class") {
      if (!canGoNextFromClass) return;
      setStep("combination");
      return;
    }
    if (step === "combination") {
      if (!canGoNextFromCombination) return;
      setStep("subject");
      return;
    }
    if (step === "subject") {
      if (!canGoNextFromSubject) return;
      setStep("course");
      return;
    }
    if (step === "course") {
      if (!canGoNextFromCourse) return;
      setStep("lesson");
      return;
    }
    if (step === "lesson") {
      if (!canGoNextFromLesson) return;
      setStep("video");
      return;
    }
    if (step === "video") {
      if (!canGoNextFromVideo) return;
      setStep("review");
    }
  };

  const back = () => {
    setSubmitError(null);
    if (step === "level") return setStep("curriculum");
    if (step === "class") return setStep("level");
    if (step === "combination") return setStep("class");
    if (step === "subject") return setStep("combination");
    if (step === "course") return setStep("subject");
    if (step === "lesson") return setStep("course");
    if (step === "video") return setStep("lesson");
    if (step === "review") return setStep("video");
  };

  const submit = () => {
    setSubmitError(null);

    if (!selectedLessonId) {
      setSubmitError("Please choose a lesson.");
      return;
    }
    if (!videoFile) {
      setSubmitError("Please select a video file.");
      return;
    }
    if (!thumbnailFile) {
      setSubmitError("Please select a thumbnail image.");
      return;
    }

    clearTimers();

    const now = new Date().toISOString();
    const newVideoId = generateObjectId();

    const persistedThumbnailUrl = thumbnailPreviewUrl ?? undefined;

    setVideos((prev) => {
      const existingLesson =
        lessons.find((l) => l._id === selectedLessonId) ?? null;
      const withoutOld = existingLesson?.video
        ? prev.filter((v) => v._id !== existingLesson.video)
        : prev;

      const payload: Video = {
        _id: newVideoId,
        lesson: selectedLessonId,
        uploadedBy: "local-teacher",
        originalFileName: videoFile.name,
        mimeType: videoFile.type || "video/mp4",
        size: videoFile.size,
        thumbnailUrl: persistedThumbnailUrl,
        thumbnailOriginalFileName: thumbnailFile.name,
        storageKey: `local/${newVideoId}/${videoFile.name}`,
        originalPath: `/local/${newVideoId}/${videoFile.name}`,
        hlsDirectory: `/local/${newVideoId}/hls`,
        hlsMasterPlaylistPath: null,
        variants: [],
        duration: null,
        status: "uploaded",
        createdAt: now,
        updatedAt: now,
      };

      return [payload, ...withoutOld];
    });

    setLessons((prev) =>
      prev.map((l) =>
        l._id === selectedLessonId
          ? {
              ...l,
              video: newVideoId,
              updatedAt: now,
            }
          : l
      )
    );

    setStep("submitting");
    setProgress(0);

    timerRef.current = setInterval(() => {
      setProgress((p) => {
        const nextProgress = Math.min(p + 7, 100);
        if (nextProgress >= 100) {
          clearTimers();

          const startedAt = new Date().toISOString();
          setVideos((prev) =>
            prev.map((v) =>
              v._id === newVideoId
                ? {
                    ...v,
                    status: "processing",
                    processingStartedAt: startedAt,
                    jobId: `job_${newVideoId.slice(-6)}`,
                    updatedAt: startedAt,
                  }
                : v
            )
          );

          phaseTimerRef.current = setTimeout(() => {
            const finishedAt = new Date().toISOString();
            setVideos((prev) =>
              prev.map((v) =>
                v._id === newVideoId
                  ? {
                      ...v,
                      status: "ready",
                      duration: 60,
                      hlsMasterPlaylistPath: `/local/${newVideoId}/hls/master.m3u8`,
                      variants: [
                        {
                          resolution: "720p",
                          bandwidth: 2800000,
                          playlistPath: `/local/${newVideoId}/hls/720p.m3u8`,
                          publicPlaylistPath: `/local/${newVideoId}/hls/720p.m3u8`,
                        },
                        {
                          resolution: "360p",
                          bandwidth: 800000,
                          playlistPath: `/local/${newVideoId}/hls/360p.m3u8`,
                          publicPlaylistPath: `/local/${newVideoId}/hls/360p.m3u8`,
                        },
                      ],
                      processingCompletedAt: finishedAt,
                      updatedAt: finishedAt,
                    }
                  : v
              )
            );

            setStep("done");
          }, 2200);
        }
        return nextProgress;
      });
    }, 180);
  };

  const steps = [
    { key: "curriculum", title: "Curriculum" },
    { key: "level", title: "Level" },
    { key: "class", title: "Class" },
    { key: "combination", title: "Combination" },
    { key: "subject", title: "Subject" },
    { key: "course", title: "Course" },
    { key: "lesson", title: "Lesson" },
    { key: "video", title: "Video" },
    { key: "review", title: "Review" },
  ] as const;

  const activeIndex = useMemo(() => {
    const idx = steps.findIndex((s) => s.key === step);
    return idx >= 0 ? idx : steps.length - 1;
  }, [step, steps]);

  const reviewRows: { label: string; value: string }[] = useMemo(() => {
    return [
      {
        label: "Curriculum",
        value: selectedCurriculum?.title ?? "-",
      },
      {
        label: "Level",
        value: selectedLevel?.title ?? "-",
      },
      {
        label: "Class",
        value: selectedClass?.title ?? "-",
      },
      {
        label: "Combination",
        value: selectedCombination?.title ?? "-",
      },
      {
        label: "Subject",
        value: selectedSubject?.title ?? "-",
      },
      {
        label: "Course",
        value: selectedCourse?.title ?? "-",
      },
      {
        label: "Lesson",
        value: selectedLesson?.title ?? "-",
      },
      {
        label: "Video file",
        value: videoFile?.name ?? "-",
      },
      {
        label: "Thumbnail",
        value: thumbnailFile?.name ?? "-",
      },
    ];
  }, [
    selectedCourse?.title,
    selectedCurriculum?.title,
    selectedLevel?.title,
    selectedClass?.title,
    selectedCombination?.title,
    selectedLesson?.title,
    selectedSubject?.title,
    thumbnailFile?.name,
    videoFile?.name,
  ]);

  return (
    <section className="space-y-6">
      <EntityHeader
        title="Upload lesson video"
        subtitle="Create or pick the curriculum hierarchy, upload the video + thumbnail, review, then submit."
      />

      <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="space-y-4 rounded-3xl border border-white/10 bg-[#14161d] p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
            Steps
          </p>
          <div className="space-y-4">
            {steps.map((s, idx) => (
              <StepPill
                key={s.key}
                active={idx === activeIndex}
                title={s.title}
                index={idx + 1}
              />
            ))}
          </div>
          <div className="pt-4">
            <Link
              href="/dashboard/Teacher/content"
              className="text-sm font-semibold text-white/70 transition hover:text-white"
            >
              Back to videos
            </Link>
          </div>
        </aside>

        <main className="rounded-3xl border border-white/10 bg-[#14161d] p-6">
          {step === "curriculum" ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Choose curriculum
                  </h2>
                  <p className="mt-1 text-sm text-white/50">
                    Curriculums group subjects and courses.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCreateCurriculumOpen(true)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  Create new
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
                  Curriculum
                </label>
                <select
                  value={selectedCurriculumId}
                  onChange={(e) =>
                    handleCurriculumChange(e.currentTarget.value)
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white focus:border-emerald-400/70 focus:outline-none"
                >
                  {curriculums.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : null}

          {step === "level" ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Target level
                  </h2>
                  <p className="mt-1 text-sm text-white/50">
                    Optional: select a target level to narrow down subjects.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCreateLevelOpen(true)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  Create new
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
                  Level
                </label>
                <select
                  value={selectedLevelId}
                  onChange={(e) => {
                    setSelectedLevelId(e.currentTarget.value);
                    setSelectedClassId("");
                    setSelectedSubjectId("");
                    setSelectedCourseId("");
                    setSelectedLessonId("");
                  }}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white focus:border-emerald-400/70 focus:outline-none"
                >
                  <option value="">All levels</option>
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
            </div>
          ) : null}

          {step === "class" ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Target class
                  </h2>
                  <p className="mt-1 text-sm text-white/50">
                    Optional: select a class to narrow down subjects.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCreateClassOpen(true)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  Create new
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
                  Class
                </label>
                <select
                  value={selectedClassId}
                  onChange={(e) => {
                    setSelectedClassId(e.currentTarget.value);
                    setSelectedSubjectId("");
                    setSelectedCourseId("");
                    setSelectedLessonId("");
                  }}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white focus:border-emerald-400/70 focus:outline-none"
                >
                  <option value="">All classes</option>
                  {availableClasses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
                {!availableClasses.length ? (
                  <p className="mt-2 text-sm text-white/50">
                    No classes found for this curriculum/level.
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === "combination" ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Target combination
                  </h2>
                  <p className="mt-1 text-sm text-white/50">
                    Optional: select a combination to narrow down subjects.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCreateCombinationOpen(true)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  Create new
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
                  Combination
                </label>
                <select
                  value={selectedCombinationId}
                  onChange={(e) => {
                    setSelectedCombinationId(e.currentTarget.value);
                    setSelectedSubjectId("");
                    setSelectedCourseId("");
                    setSelectedLessonId("");
                  }}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white focus:border-emerald-400/70 focus:outline-none"
                >
                  <option value="">All combinations</option>
                  {availableCombinations.map((combo) => (
                    <option key={combo._id} value={combo._id}>
                      {combo.title}
                    </option>
                  ))}
                </select>
                {!availableCombinations.length ? (
                  <p className="mt-2 text-sm text-white/50">
                    No combinations found for this curriculum.
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === "subject" ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Choose subject
                  </h2>
                  <p className="mt-1 text-sm text-white/50">
                    Subjects belong to the selected curriculum (and are filtered
                    by targets).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCreateSubjectOpen(true)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  Create new
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
                  Subject
                </label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => handleSubjectChange(e.currentTarget.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white focus:border-emerald-400/70 focus:outline-none"
                >
                  <option value="" disabled>
                    Select a subject
                  </option>
                  {availableSubjects.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.title}
                    </option>
                  ))}
                </select>
                {!availableSubjects.length ? (
                  <p className="mt-2 text-sm text-white/50">
                    No subjects found for the chosen curriculum/targets.
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === "course" ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Choose course
                  </h2>
                  <p className="mt-1 text-sm text-white/50">
                    Courses belong to the selected subject.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCreateCourseOpen(true)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  Create new
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
                  Course
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => handleCourseChange(e.currentTarget.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white focus:border-emerald-400/70 focus:outline-none"
                >
                  <option value="" disabled>
                    Select a course
                  </option>
                  {availableCourses.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.title}
                    </option>
                  ))}
                </select>
                {!availableCourses.length ? (
                  <p className="mt-2 text-sm text-white/50">
                    No courses found for this subject.
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === "lesson" ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Choose lesson
                  </h2>
                  <p className="mt-1 text-sm text-white/50">
                    Lessons belong to the selected course.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setCreateLessonOpen(true)}
                  disabled={!selectedCourseId}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10"
                >
                  Create new
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
                  Lesson
                </label>
                <select
                  value={selectedLessonId}
                  onChange={(e) => setSelectedLessonId(e.currentTarget.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white focus:border-emerald-400/70 focus:outline-none"
                >
                  <option value="" disabled>
                    Select a lesson
                  </option>
                  {availableLessons.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.order}. {l.title}
                    </option>
                  ))}
                </select>
                {!availableLessons.length ? (
                  <p className="mt-2 text-sm text-white/50">
                    No lessons found for this course.
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === "video" ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Upload video & thumbnail
                </h2>
                <p className="mt-1 text-sm text-white/50">
                  Video upload is simulated for now.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
                      Video file (required)
                    </p>
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoChange}
                      className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
                    />
                    <p className="mt-2 text-xs text-white/40">
                      {videoFile ? videoFile.name : "No video selected"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
                      Thumbnail (required)
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white file:mr-4 file:rounded-full file:border-0 file:bg-white file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black"
                    />
                    <p className="mt-2 text-xs text-white/40">
                      {thumbnailFile
                        ? thumbnailFile.name
                        : "No thumbnail selected"}
                    </p>
                  </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f1117]">
                  <div className="aspect-video bg-black/30">
                    {thumbnailPreviewUrl ? (
                      <img
                        src={thumbnailPreviewUrl}
                        alt={thumbnailFile?.name ?? "thumbnail"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-white/40">
                        Thumbnail preview
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-3 text-xs text-white/50">
                    {thumbnailFile
                      ? thumbnailFile.name
                      : "No thumbnail selected"}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {step === "review" ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Review</h2>
                <p className="mt-1 text-sm text-white/50">
                  Confirm details before submitting.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0f1117] p-5">
                <div className="grid gap-4 md:grid-cols-2">
                  {reviewRows.map((row) => (
                    <div key={row.label}>
                      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
                        {row.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {row.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {submitError ? (
                <p className="text-sm text-rose-200">{submitError}</p>
              ) : null}
            </div>
          ) : null}

          {step === "submitting" ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Uploading (simulated)
                </h2>
                <p className="mt-1 text-sm text-white/50">
                  Creating the video record and starting processing.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#0f1117] p-5">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>{videoFile?.name ?? "video"}</span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {step === "done" ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Done</h2>
                <p className="mt-1 text-sm text-white/50">
                  The video has been added to the selected lesson.
                </p>
              </div>

              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                <p className="text-sm font-semibold text-emerald-100">
                  Video ready (simulated)
                </p>
                <p className="mt-2 text-sm text-emerald-100/70">
                  You can now view it in the course lessons page or in the
                  lesson videos table.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {selectedCourseId ? (
                  <Link
                    href={`/dashboard/Teacher/content/courses/${selectedCourseId}`}
                    className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
                  >
                    Go to course
                  </Link>
                ) : null}
                <Link
                  href="/dashboard/Teacher/content"
                  className="rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-white transition hover:border-white/40"
                >
                  Go to videos
                </Link>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/5 pt-6">
            <button
              type="button"
              onClick={back}
              disabled={
                step === "curriculum" ||
                step === "submitting" ||
                step === "done"
              }
              className="rounded-full border border-white/20 px-6 py-2 text-sm font-semibold text-white transition hover:border-white/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            {step === "review" ? (
              <button
                type="button"
                onClick={submit}
                className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
              >
                Submit
              </button>
            ) : step === "submitting" || step === "done" ? (
              <div />
            ) : (
              <button
                type="button"
                onClick={next}
                disabled={
                  (step === "curriculum" && !canGoNextFromCurriculum) ||
                  (step === "level" && !canGoNextFromLevel) ||
                  (step === "class" && !canGoNextFromClass) ||
                  (step === "combination" && !canGoNextFromCombination) ||
                  (step === "subject" && !canGoNextFromSubject) ||
                  (step === "course" && !canGoNextFromCourse) ||
                  (step === "lesson" && !canGoNextFromLesson) ||
                  (step === "video" && !canGoNextFromVideo)
                }
                className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            )}
          </div>
        </main>
      </div>

      <CreateCurriculumModal
        open={isCreateCurriculumOpen}
        onClose={() => setCreateCurriculumOpen(false)}
        onCreate={(curriculum: Curriculum) => {
          setCurriculums((prev) => [curriculum, ...prev]);
          setSelectedCurriculumId(curriculum._id);
          setSelectedLevelId("");
          setSelectedClassId("");
          setSelectedCombinationId("");
          setSelectedSubjectId("");
          setSelectedCourseId("");
          setSelectedLessonId("");
        }}
      />

      <CreateLevelModal
        open={isCreateLevelOpen}
        onClose={() => setCreateLevelOpen(false)}
        curriculums={curriculums}
        defaultCurriculumId={selectedCurriculumId || null}
        onCreate={(level: AcademicLevel) => {
          setLevels((prev) => [level, ...prev]);
          setSelectedCurriculumId(level.curriculum);
          setSelectedLevelId(level._id);
          setSelectedClassId("");
          setSelectedSubjectId("");
          setSelectedCourseId("");
          setSelectedLessonId("");
        }}
      />

      <CreateClassModal
        open={isCreateClassOpen}
        onClose={() => setCreateClassOpen(false)}
        curriculums={curriculums}
        levels={levels}
        defaultCurriculumId={selectedCurriculumId || null}
        defaultLevelId={selectedLevelId || null}
        onCreate={(academicClass: AcademicClass) => {
          setClasses((prev) => [academicClass, ...prev]);
          setSelectedCurriculumId(academicClass.curriculum);
          setSelectedLevelId(academicClass.academicLevel);
          setSelectedClassId(academicClass._id);
          setSelectedSubjectId("");
          setSelectedCourseId("");
          setSelectedLessonId("");
        }}
      />

      <CreateCombinationModal
        open={isCreateCombinationOpen}
        onClose={() => setCreateCombinationOpen(false)}
        subjects={subjects.filter((s) => s.curriculum === selectedCurriculumId)}
        onCreate={(combination: ClassCombination) => {
          setCombinations((prev) => [combination, ...prev]);
          setSelectedCombinationId(combination._id);
          setSelectedSubjectId("");
          setSelectedCourseId("");
          setSelectedLessonId("");
        }}
      />

      <CreateSubjectModal
        open={isCreateSubjectOpen}
        onClose={() => setCreateSubjectOpen(false)}
        curriculums={curriculums}
        levels={levels}
        classes={classes}
        combinations={combinations}
        defaultCurriculumId={selectedCurriculumId || null}
        onCreate={(subject: Subject) => {
          setSubjects((prev) => [subject, ...prev]);
          setSelectedCurriculumId(subject.curriculum);
          setSelectedLevelId("");
          setSelectedClassId("");
          setSelectedCombinationId("");
          setSelectedSubjectId(subject._id);
          setSelectedCourseId("");
          setSelectedLessonId("");
        }}
      />

      <CreateCourseModal
        open={isCreateCourseOpen}
        onClose={() => setCreateCourseOpen(false)}
        subjects={availableSubjects.length ? availableSubjects : subjects}
        defaultSubjectId={selectedSubjectId || null}
        onCreate={(course: Course) => {
          setCourses((prev) => [course, ...prev]);
          setSelectedCourseId(course._id);
          setSelectedLessonId("");
        }}
      />

      <CreateLessonModal
        open={isCreateLessonOpen && Boolean(selectedCourseId)}
        onClose={() => setCreateLessonOpen(false)}
        courseId={selectedCourseId as ObjectIdString}
        existingLessons={availableLessons}
        onCreate={(lesson: Lesson) => {
          setLessons((prev) => [lesson, ...prev]);
          setSelectedLessonId(lesson._id);
        }}
      />
    </section>
  );
}
