"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";

import {
  CreateCourseModal,
  CreateLevelModal,
  CreateCurriculumModal,
  CreateClassModal,
  CreateLessonModal,
  CreateSubjectModal,
} from "@/components/TeacherContent/CreateEntityModals";
import { EntityHeader } from "@/components/TeacherContent/EntityHeader";
import { useTeacherContentStore } from "@/components/TeacherContent/TeacherContentProvider";
import { ApiError } from "@/lib/api/client";
import { listAcademicLevels } from "@/lib/api/academicLevels";
import { listAcademicClasses } from "@/lib/api/academicClasses";
import { listSubjectsByCurriculum } from "@/lib/api/subjects";
import { listCourses } from "@/lib/api/courses";
import { listLessons } from "@/lib/api/lessons";
import {
  getLessonVideo,
  uploadLessonThumbnail,
  uploadLessonVideo,
} from "@/lib/api/video";
import type {
  Course,
  Curriculum,
  Lesson,
  AcademicLevel,
  AcademicClass,
  ObjectIdString,
  Subject,
  Video,
} from "@/lib/mock/teacherData";

type WizardStep =
  | "curriculum"
  | "level"
  | "class"
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
  >("");

  const [selectedLevelId, setSelectedLevelId] = useState<ObjectIdString | "">(
    ""
  );
  const [selectedClassId, setSelectedClassId] = useState<ObjectIdString | "">(
    ""
  );

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
  const [isCreateSubjectOpen, setCreateSubjectOpen] = useState(false);
  const [isCreateCourseOpen, setCreateCourseOpen] = useState(false);
  const [isCreateLessonOpen, setCreateLessonOpen] = useState(false);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isUploading, setUploading] = useState(false);
  const [uploadStageLabel, setUploadStageLabel] = useState<string | null>(null);
  const [lastCheckedAt, setLastCheckedAt] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!selectedCurriculumId) {
      setLevels([]);
      setClasses([]);
      setSubjects([]);
      setCourses([]);
      setLessons([]);
      return;
    }

    (async () => {
      try {
        const [levelsRes, subjectsRes] = await Promise.all([
          listAcademicLevels({ curriculumId: selectedCurriculumId }),
          listSubjectsByCurriculum(selectedCurriculumId),
        ]);
        if (cancelled) return;
        setLevels(levelsRes.levels);
        setSubjects(subjectsRes.subjects);
      } catch {
        if (cancelled) return;
        setLevels([]);
        setSubjects([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    selectedCurriculumId,
    setClasses,
    setCourses,
    setLessons,
    setLevels,
    setSubjects,
  ]);

  useEffect(() => {
    let cancelled = false;

    if (!selectedLevelId) {
      setClasses([]);
      return;
    }

    (async () => {
      try {
        const res = await listAcademicClasses({ levelId: selectedLevelId });
        if (cancelled) return;
        setClasses(res.classes);
      } catch {
        if (cancelled) return;
        setClasses([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedLevelId, setClasses]);

  useEffect(() => {
    let cancelled = false;

    if (!selectedSubjectId) {
      setCourses([]);
      setLessons([]);
      return;
    }

    (async () => {
      try {
        const res = await listCourses({ subjectId: selectedSubjectId });
        if (cancelled) return;
        setCourses(res.courses);
      } catch {
        if (cancelled) return;
        setCourses([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedSubjectId, setCourses, setLessons]);

  useEffect(() => {
    let cancelled = false;

    if (!selectedCourseId) {
      setLessons([]);
      return;
    }

    (async () => {
      try {
        const res = await listLessons({ courseId: selectedCourseId });
        if (cancelled) return;
        setLessons(res.lessons);
      } catch {
        if (cancelled) return;
        setLessons([]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedCourseId, setLessons]);

  const clearTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const cancelUpload = () => {
    clearTimers();
    setUploading(false);
    setUploadStageLabel(null);
    setLastCheckedAt(null);
    setStep("review");
    setSubmitError("Upload cancelled. You can adjust files and try again.");
  };

  const activeVideo = useMemo(() => {
    if (!selectedLessonId) return null;
    const linkedLesson =
      lessons.find((l) => l._id === selectedLessonId) ?? null;
    if (linkedLesson?.video) {
      return videos.find((v) => v._id === linkedLesson.video) ?? null;
    }
    return videos.find((v) => v.lesson === selectedLessonId) ?? null;
  }, [lessons, selectedLessonId, videos]);

  const statusPill = (status: string) => {
    const base =
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold";
    if (status === "ready") return `${base} bg-emerald-400/20 text-emerald-200`;
    if (status === "failed") return `${base} bg-rose-500/20 text-rose-200`;
    if (status === "processing")
      return `${base} bg-amber-500/20 text-amber-200`;
    return `${base} bg-white/10 text-white/70`;
  };

  const upsertVideoInStore = (
    videoFromApi: {
      id: string;
      lesson: string;
      status: "uploaded" | "processing" | "ready" | "failed";
      hlsMasterPlaylistPath: string | null;
      variants: {
        resolution: string;
        bandwidth: number;
        playlistPath: string;
        publicPlaylistPath: string;
      }[];
      duration: number | null;
      thumbnailUrl?: string;
      failureReason?: string;
      jobId?: string;
      createdAt?: string;
      updatedAt?: string;
    },
    fileContext?: { videoFile?: File | null; thumbnailFile?: File | null }
  ) => {
    const now = new Date().toISOString();

    const payload: Video = {
      _id: videoFromApi.id,
      lesson: videoFromApi.lesson,
      uploadedBy: "api-teacher",
      originalFileName:
        fileContext?.videoFile?.name ?? videoFromApi.id ?? "video",
      mimeType: fileContext?.videoFile?.type || "video/mp4",
      size: fileContext?.videoFile?.size ?? 0,
      thumbnailUrl: videoFromApi.thumbnailUrl,
      thumbnailOriginalFileName: fileContext?.thumbnailFile?.name,
      storageKey: "",
      originalPath: "",
      hlsDirectory: "",
      hlsMasterPlaylistPath: videoFromApi.hlsMasterPlaylistPath ?? null,
      variants: (videoFromApi.variants ?? []).map((v) => ({
        resolution: v.resolution,
        bandwidth: v.bandwidth,
        playlistPath: v.playlistPath,
        publicPlaylistPath: v.publicPlaylistPath,
      })),
      duration: videoFromApi.duration ?? null,
      status: videoFromApi.status,
      failureReason: videoFromApi.failureReason,
      jobId: videoFromApi.jobId,
      createdAt: videoFromApi.createdAt ?? now,
      updatedAt: videoFromApi.updatedAt ?? now,
    };

    setVideos((prev) => {
      const withoutOld = prev.filter((v) => v._id !== payload._id);
      return [payload, ...withoutOld];
    });

    setLessons((prev) =>
      prev.map((l) =>
        l._id === videoFromApi.lesson
          ? {
              ...l,
              video: payload._id,
              updatedAt: now,
            }
          : l
      )
    );
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

      return true;
    });
  }, [selectedClassId, selectedCurriculumId, selectedLevelId, subjects]);

  const availableLevels = useMemo(() => {
    if (!selectedCurriculumId) return [];
    return levels
      .filter((l) => l.curriculum === selectedCurriculumId)
      .sort((a, b) => a.order - b.order);
  }, [levels, selectedCurriculumId]);

  const availableClasses = useMemo(() => {
    if (!selectedCurriculumId) return [];

    if (selectedLevelId) {
      return classes.filter((c) => c.academicLevel === selectedLevelId);
    }

    const levelById = new Map(levels.map((l) => [l._id, l] as const));
    return classes.filter((c) => {
      const parentLevel = levelById.get(c.academicLevel);
      return parentLevel?.curriculum === selectedCurriculumId;
    });
  }, [classes, levels, selectedCurriculumId, selectedLevelId]);

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
    if (step === "subject") return setStep("class");
    if (step === "course") return setStep("subject");
    if (step === "lesson") return setStep("course");
    if (step === "video") return setStep("lesson");
    if (step === "review") return setStep("video");
  };

  const submit = async () => {
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

    setUploading(true);
    clearTimers();

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => setTimeout(resolve, ms));

    const waitForVideoAvailability = async () => {
      const attempts = 10;
      for (let i = 0; i < attempts; i += 1) {
        try {
          const latest = await getLessonVideo(selectedLessonId);
          upsertVideoInStore(latest.video, { videoFile, thumbnailFile });
          return;
        } catch (err) {
          if (!(err instanceof ApiError)) throw err;
          await sleep(800);
        }
      }
    };

    try {
      setStep("submitting");
      setUploadStageLabel("Uploading video");
      setProgress(15);
      setLastCheckedAt(new Date().toISOString());

      const uploaded = await uploadLessonVideo(selectedLessonId, videoFile);
      upsertVideoInStore(uploaded.video, { videoFile, thumbnailFile });

      await waitForVideoAvailability();

      setUploadStageLabel("Uploading thumbnail");
      setProgress(40);
      setLastCheckedAt(new Date().toISOString());

      const uploadThumbnailWithRetry = async () => {
        const attempts = 10;
        for (let i = 0; i < attempts; i += 1) {
          try {
            const thumb = await uploadLessonThumbnail(
              selectedLessonId,
              thumbnailFile
            );
            return thumb;
          } catch (err) {
            if (err instanceof ApiError) {
              const msg = err.message?.toLowerCase?.() ?? "";
              if (
                err.statusCode === 404 ||
                msg.includes("video is not available")
              ) {
                await sleep(800);
                await waitForVideoAvailability();
                continue;
              }
            }
            throw err;
          }
        }
        throw new ApiError("Video is not available", { statusCode: 404 });
      };

      const thumb = await uploadThumbnailWithRetry();
      upsertVideoInStore(thumb.video, { videoFile, thumbnailFile });

      setUploadStageLabel("Processing");
      setProgress(55);
      setLastCheckedAt(new Date().toISOString());

      timerRef.current = setInterval(async () => {
        try {
          const latest = await getLessonVideo(selectedLessonId);
          upsertVideoInStore(latest.video, { videoFile, thumbnailFile });
          setLastCheckedAt(new Date().toISOString());

          setProgress((prev) => {
            if (
              latest.video.status === "processing" ||
              latest.video.status === "uploaded"
            ) {
              return Math.min(prev + 3, 95);
            }
            return prev;
          });

          if (latest.video.status === "ready") {
            clearTimers();
            setProgress(100);
            setStep("done");
            setUploading(false);
            setUploadStageLabel("Ready");
            setLastCheckedAt(new Date().toISOString());
          }

          if (latest.video.status === "failed") {
            clearTimers();
            setUploading(false);
            setStep("review");
            setUploadStageLabel(null);
            setLastCheckedAt(null);
            setSubmitError(latest.video.failureReason || "Processing failed.");
          }
        } catch (err) {
          clearTimers();
          setUploading(false);
          setStep("review");
          setUploadStageLabel(null);
          setLastCheckedAt(null);
          setSubmitError(
            err instanceof Error ? err.message : "Polling failed."
          );
        }
      }, 7000);
    } catch (err) {
      setUploading(false);
      setStep("review");
      setUploadStageLabel(null);
      setLastCheckedAt(null);
      if (err instanceof ApiError) {
        setSubmitError(err.message);
        return;
      }
      setSubmitError(err instanceof Error ? err.message : "Upload failed.");
    }
  };

  const steps = [
    { key: "curriculum", title: "Curriculum" },
    { key: "level", title: "Level" },
    { key: "class", title: "Class" },
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
    selectedLesson?.title,
    selectedSubject?.title,
    thumbnailFile?.name,
    videoFile?.name,
  ]);

  const breadcrumbSteps = useMemo(() => {
    return [
      {
        key: "curriculum" as const,
        label: "Curriculum",
        value: selectedCurriculum?.title ?? "Not selected",
      },
      {
        key: "level" as const,
        label: "Level",
        value: selectedLevel?.title ?? (selectedCurriculumId ? "All" : "-"),
      },
      {
        key: "class" as const,
        label: "Class",
        value: selectedClass?.title ?? (selectedCurriculumId ? "All" : "-"),
      },
      {
        key: "subject" as const,
        label: "Subject",
        value: selectedSubject?.title ?? "Not selected",
      },
      {
        key: "course" as const,
        label: "Course",
        value: selectedCourse?.title ?? "Not selected",
      },
      {
        key: "lesson" as const,
        label: "Lesson",
        value: selectedLesson?.title ?? "Not selected",
      },
      {
        key: "video" as const,
        label: "Files",
        value: videoFile && thumbnailFile ? "Selected" : "Not selected",
      },
    ];
  }, [
    selectedClass?.title,
    selectedCourse?.title,
    selectedCurriculum?.title,
    selectedCurriculumId,
    selectedLesson?.title,
    selectedLevel?.title,
    selectedSubject?.title,
    thumbnailFile,
    videoFile,
  ]);

  const breadcrumbIndexByKey = useMemo(() => {
    const order = [
      "curriculum",
      "level",
      "class",
      "subject",
      "course",
      "lesson",
      "video",
      "review",
    ] as const;
    const map = new Map<string, number>();
    order.forEach((k, idx) => map.set(k, idx));
    return map;
  }, []);

  const currentBreadcrumbIndex =
    breadcrumbIndexByKey.get(step) ?? breadcrumbIndexByKey.size;

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
          <div className="mb-6 rounded-2xl border border-white/10 bg-[#0f1117] px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
              Your selections
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {breadcrumbSteps.map((crumb) => {
                const crumbIndex =
                  breadcrumbIndexByKey.get(crumb.key) ??
                  breadcrumbIndexByKey.size;
                const canJumpBack = crumbIndex < currentBreadcrumbIndex;

                return (
                  <button
                    key={crumb.key}
                    type="button"
                    onClick={() => {
                      if (!canJumpBack) return;
                      setStep(crumb.key);
                    }}
                    disabled={!canJumpBack}
                    className={
                      canJumpBack
                        ? "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-left text-xs text-white/80 transition hover:border-white/20 hover:bg-white/10"
                        : "rounded-full border border-white/10 bg-white/5 px-3 py-1 text-left text-xs text-white/40"
                    }
                  >
                    <span className="font-semibold text-white/60">
                      {crumb.label}:
                    </span>{" "}
                    <span className="font-semibold">{crumb.value}</span>
                  </button>
                );
              })}
            </div>
          </div>
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
                  <option value="" disabled>
                    Choose an option
                  </option>
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
                    Choose an option
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
                  Choose the source video and an image thumbnail.
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
                      disabled={isUploading}
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
                      disabled={isUploading}
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
                <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4">
                  <p className="text-sm font-semibold text-rose-100">
                    Upload failed
                  </p>
                  <p className="mt-2 text-sm text-rose-100/70">{submitError}</p>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === "submitting" ? (
            <div className="space-y-5">
              <div>
                <h2 className="text-lg font-semibold text-white">Uploading</h2>
                <p className="mt-1 text-sm text-white/50">
                  {uploadStageLabel
                    ? `${uploadStageLabel}...`
                    : "Uploading and starting processing."}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0f1117] px-5 py-4">
                <div className="flex items-center gap-3">
                  <span
                    className={statusPill(activeVideo?.status ?? "uploaded")}
                  >
                    {(activeVideo?.status ?? "uploaded").toUpperCase()}
                  </span>
                  {activeVideo?.jobId ? (
                    <span className="text-xs text-white/50">
                      Job {activeVideo.jobId}
                    </span>
                  ) : null}
                </div>
                {lastCheckedAt ? (
                  <span className="text-xs text-white/50">
                    Last checked {new Date(lastCheckedAt).toLocaleTimeString()}
                  </span>
                ) : (
                  <span className="text-xs text-white/50">Starting…</span>
                )}
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
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-white/50">
                    We will keep checking until the video is ready.
                  </p>
                  <button
                    type="button"
                    onClick={cancelUpload}
                    className="rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/40"
                  >
                    Cancel
                  </button>
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
                  Video ready
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
                disabled={isUploading}
                className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            ) : step === "submitting" || step === "done" ? (
              <div />
            ) : (
              <button
                type="button"
                onClick={next}
                disabled={
                  isUploading ||
                  (step === "curriculum" && !canGoNextFromCurriculum) ||
                  (step === "level" && !canGoNextFromLevel) ||
                  (step === "class" && !canGoNextFromClass) ||
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
          setSelectedCurriculumId((prev) => academicClass.curriculum || prev);
          setSelectedLevelId((prev) => academicClass.academicLevel || prev);
          setSelectedClassId(academicClass._id);
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
