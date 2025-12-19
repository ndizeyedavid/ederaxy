"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";

import { ModalShell } from "@/components/TeacherContent/ModalShell";
import { useTeacherContentStore } from "@/components/TeacherContent/TeacherContentProvider";
import type { Lesson, ObjectIdString, Video } from "@/lib/mock/teacherData";

function generateObjectId(): ObjectIdString {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 24);
  }

  return String(Date.now()).padStart(24, "0").slice(0, 24);
}

type UploadStage = "select" | "uploading" | "processing" | "ready" | "failed";

interface UploadLessonVideoModalProps {
  open: boolean;
  lessonId: ObjectIdString | null;
  onClose: () => void;
}

export function UploadLessonVideoModal({
  open,
  lessonId,
  onClose,
}: UploadLessonVideoModalProps) {
  const { lessons, setLessons, videos, setVideos } = useTeacherContentStore();

  const lesson: Lesson | null = useMemo(() => {
    if (!lessonId) return null;
    return lessons.find((l) => l._id === lessonId) ?? null;
  }, [lessonId, lessons]);

  const [stage, setStage] = useState<UploadStage>("select");
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [createdVideoId, setCreatedVideoId] = useState<ObjectIdString | null>(
    null
  );
  const [simulateFailure, setSimulateFailure] = useState(false);

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
    if (!open) {
      clearTimers();
      setStage("select");
      setProgress(0);
      setSelectedFile(null);
      setCreatedVideoId(null);
      setSimulateFailure(false);
    }

    return () => {
      clearTimers();
    };
  }, [open]);

  const startFlow = (file: File) => {
    if (!lessonId) return;

    clearTimers();

    const now = new Date().toISOString();
    const newVideoId = generateObjectId();

    setVideos((prev) => {
      const withoutOld = lesson?.video
        ? prev.filter((v) => v._id !== lesson.video)
        : prev;

      const payload: Video = {
        _id: newVideoId,
        lesson: lessonId,
        uploadedBy: "local-teacher",
        originalFileName: file.name,
        mimeType: file.type || "video/mp4",
        size: file.size,
        storageKey: `local/${newVideoId}/${file.name}`,
        originalPath: `/local/${newVideoId}/${file.name}`,
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
        l._id === lessonId
          ? {
              ...l,
              video: newVideoId,
              updatedAt: now,
            }
          : l
      )
    );

    setCreatedVideoId(newVideoId);

    setStage("uploading");
    setProgress(0);

    timerRef.current = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 7, 100);
        if (next >= 100) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }

          setStage("processing");

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

            if (simulateFailure) {
              setStage("failed");
              setVideos((prev) =>
                prev.map((v) =>
                  v._id === newVideoId
                    ? {
                        ...v,
                        status: "failed",
                        failureReason: "Transcoding failed (simulated).",
                        processingCompletedAt: finishedAt,
                        updatedAt: finishedAt,
                      }
                    : v
                )
              );
              return;
            }

            setStage("ready");
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
          }, 2200);
        }
        return next;
      });
    }, 180);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    if (!file) return;
    setSelectedFile(file);
    startFlow(file);
  };

  const activeVideo = useMemo(() => {
    if (!createdVideoId) return null;
    return videos.find((v) => v._id === createdVideoId) ?? null;
  }, [createdVideoId, videos]);

  const title = lesson ? `Upload video · ${lesson.title}` : "Upload video";

  return (
    <ModalShell
      open={open}
      title={title}
      subtitle={
        stage === "select"
          ? "Select a video file for this lesson."
          : stage === "uploading"
          ? "Uploading video (simulated)."
          : stage === "processing"
          ? "Processing & transcoding (simulated)."
          : stage === "ready"
          ? "Video is ready."
          : "Video upload failed."
      }
      onClose={onClose}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40"
          >
            Close
          </button>
        </>
      }
    >
      <div className="space-y-5">
        {stage === "select" ? (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-white/70">
                Choose an MP4/MOV/WEBM file. This is UI-only for now.
              </p>
            </div>

            <label className="block rounded-2xl border border-dashed border-white/15 bg-[#0f1117] px-6 py-8 text-center">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <span className="text-sm font-semibold text-white">
                Click to select video
              </span>
              <span className="mt-2 block text-xs text-white/50">
                The upload + processing is simulated and will update lesson
                video status.
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white/70">
              <input
                type="checkbox"
                checked={simulateFailure}
                onChange={(e) => setSimulateFailure(e.currentTarget.checked)}
                className="size-4 rounded border-white/30 bg-transparent text-emerald-400 focus:ring-emerald-500"
              />
              Simulate failure
            </label>
          </div>
        ) : null}

        {stage === "uploading" ? (
          <div className="rounded-2xl border border-white/10 bg-[#0f1117] p-5">
            <div className="flex items-center justify-between text-sm text-white/70">
              <span>{selectedFile?.name ?? "video"}</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-emerald-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-3 text-xs text-white/50">
              Linking video to lesson and creating an encoding job.
            </p>
          </div>
        ) : null}

        {stage === "processing" ? (
          <div className="rounded-2xl border border-white/10 bg-[#0f1117] p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Processing</p>
              <p className="text-xs text-white/50">
                {activeVideo?.jobId
                  ? `Job ${activeVideo.jobId}`
                  : "Job pending"}
              </p>
            </div>
            <p className="mt-2 text-sm text-white/60">
              We are generating HLS renditions and thumbnails.
            </p>
          </div>
        ) : null}

        {stage === "ready" ? (
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
            <p className="text-sm font-semibold text-emerald-100">
              Video ready
            </p>
            <p className="mt-2 text-sm text-emerald-100/70">
              Lesson status badge should now show Ready.
            </p>
          </div>
        ) : null}

        {stage === "failed" ? (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-5">
            <p className="text-sm font-semibold text-rose-100">Upload failed</p>
            <p className="mt-2 text-sm text-rose-100/70">
              {activeVideo?.failureReason ?? "Something went wrong."}
            </p>
          </div>
        ) : null}
      </div>
    </ModalShell>
  );
}
