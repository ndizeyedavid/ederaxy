"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import { ArrowRight, Loader2, Upload, X } from "lucide-react";

const STEPS = [
  { key: "details", label: "Details" },
  { key: "elements", label: "Study Material" },
  { key: "checks", label: "Checks" },
  { key: "visibility", label: "Visibility" },
] as const;

type UploadStage = "select" | "uploading" | "details";

type AudienceOption = "General" | "Kids";

type VisibilityOption = "Public" | "Unlisted" | "Private";

interface UploadFormState {
  title: string;
  description: string;
  playlist: string;
  tags: string;
  audience: AudienceOption;
  visibility: VisibilityOption;
  allowComments: boolean;
}

const INITIAL_UPLOAD_FORM_STATE: UploadFormState = {
  title: "",
  description: "",
  playlist: "",
  tags: "",
  audience: "General",
  visibility: "Public",
  allowComments: true,
};

export interface UploadLessonModalProps {
  open: boolean;
  onClose: () => void;
  onComplete?: (payload: { form: UploadFormState; file: File | null }) => void;
}

export function UploadLessonModal({
  open,
  onClose,
  onComplete,
}: UploadLessonModalProps) {
  const [uploadStage, setUploadStage] = useState<UploadStage>("select");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formState, setFormState] = useState<UploadFormState>(
    INITIAL_UPLOAD_FORM_STATE
  );
  const [isDragOver, setIsDragOver] = useState(false);

  const uploadTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const activeStepIndex = useMemo(() => {
    switch (uploadStage) {
      case "details":
        return 0;
      case "uploading":
      case "select":
      default:
        return 0;
    }
  }, [uploadStage]);

  const resetUploadFlow = useCallback(() => {
    setUploadStage("select");
    setUploadProgress(0);
    setSelectedFile(null);
    setFormState(INITIAL_UPLOAD_FORM_STATE);
    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
  }, []);

  useEffect(() => {
    if (!open) {
      resetUploadFlow();
    }
  }, [open, resetUploadFlow]);

  useEffect(
    () => () => {
      if (uploadTimerRef.current) {
        clearInterval(uploadTimerRef.current);
      }
    },
    []
  );

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return null;
      });
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  const startSimulatedUpload = useCallback(() => {
    if (uploadTimerRef.current) {
      clearInterval(uploadTimerRef.current);
    }

    setUploadStage("uploading");
    setUploadProgress(0);

    uploadTimerRef.current = setInterval(() => {
      setUploadProgress((previous) => {
        const nextValue = Math.min(previous + 8, 100);
        if (nextValue >= 100) {
          if (uploadTimerRef.current) {
            clearInterval(uploadTimerRef.current);
            uploadTimerRef.current = null;
          }
          setUploadStage("details");
        }
        return nextValue;
      });
    }, 350);
  }, []);

  const handleFileSelection = useCallback(
    (file: File | null) => {
      if (!file) return;
      setSelectedFile(file);
      setFormState((previous) => ({
        ...previous,
        title: file.name.replace(/\.[^/.]+$/, ""),
      }));
      startSimulatedUpload();
    },
    [startSimulatedUpload]
  );

  const handleFileInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] ?? null;
      handleFileSelection(file);
    },
    [handleFileSelection]
  );

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setIsDragOver(false);
      const file = event.dataTransfer.files?.[0] ?? null;
      handleFileSelection(file);
    },
    [handleFileSelection]
  );

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleFormFieldChange = useCallback(
    (
      event:
        | ChangeEvent<HTMLInputElement>
        | ChangeEvent<HTMLTextAreaElement>
        | ChangeEvent<HTMLSelectElement>
    ) => {
      const target = event.currentTarget;
      const { name, value } = target;

      const isCheckbox =
        target instanceof HTMLInputElement && target.type === "checkbox";

      setFormState((previous) => ({
        ...previous,
        [name]: isCheckbox ? target.checked : value,
      }));
    },
    []
  );

  const handleUploadFormSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onComplete?.({ form: formState, file: selectedFile });
      onClose();
    },
    [formState, onClose, onComplete, selectedFile]
  );

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[2200] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4 py-6">
      <div
        className="absolute inset-0"
        onClick={handleClose}
        aria-hidden="true"
      />
      <div className="relative z-[1] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-[#14161d] shadow-[0_50px_140px_rgba(0,0,0,0.65)] h-[600px] overflow-y-auto">
        <header className="space-y-4 border-b border-white/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/50">
                Upload lesson
              </p>
              <h2 className="text-xl font-semibold text-white">
                {uploadStage === "select"
                  ? "Select video file"
                  : uploadStage === "uploading"
                  ? "Uploading your lesson"
                  : "Lesson details"}
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-full bg-white/5 p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
              aria-label="Close upload modal"
            >
              <X className="size-5" />
            </button>
          </div>

          <nav className="flex items-center gap-6 overflow-x-auto text-xs font-semibold uppercase tracking-[0.28em] text-white/40 md:justify-center">
            {STEPS.map((step, index) => {
              const isActive = index === activeStepIndex;
              const isCompleted = index < activeStepIndex;

              return (
                <div
                  key={step.key}
                  className="flex items-center gap-3 whitespace-nowrap"
                >
                  <div
                    className={`flex size-6 items-center justify-center rounded-full border text-[0.65rem] ${
                      isActive
                        ? "border-emerald-400 bg-emerald-500/20 text-emerald-200"
                        : isCompleted
                        ? "border-emerald-500 bg-emerald-500 text-emerald-950"
                        : "border-white/20 text-white/40"
                    }`}
                  >
                    <span className="relative left-[1px]">{index + 1}</span>
                  </div>
                  <span className={isActive ? "text-white" : ""}>
                    {step.label}
                  </span>
                  {index < STEPS.length - 1 && (
                    <span
                      className="hidden h-px w-10 bg-white/10 md:block"
                      aria-hidden="true"
                    />
                  )}
                </div>
              );
            })}
          </nav>
        </header>

        <div className="grid gap-0 md:grid-cols-[minmax(0,1fr)]">
          {uploadStage === "select" && (
            <div className="flex flex-col items-center gap-6 px-8 py-16 text-center text-white">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`flex w-full max-w-xl flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-white/15 bg-[#0f1117] px-10 py-14 transition ${
                  isDragOver ? "border-emerald-400/80 bg-emerald-500/10" : ""
                }`}
              >
                <div className="flex size-16 items-center justify-center rounded-full bg-white/5 text-white/70">
                  <Upload className="size-7" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    Drag and drop video files to upload
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    MP4, MOV or WEBM • 4K up to 12 hours • Files stay private
                    until you publish.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Select files
                  <ArrowRight className="size-4" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                />
              </div>
              <p className="max-w-md text-xs text-white/40">
                By uploading you confirm you have rights to use the content and
                it adheres to Ederaxy classroom guidelines.
              </p>
            </div>
          )}

          {uploadStage === "uploading" && (
            <div className="grid gap-10 px-8 py-12 text-white md:grid-cols-[minmax(0,1fr)_280px]">
              <div className="space-y-5">
                <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
                  <div className="flex items-center gap-3 text-sm text-white/70">
                    <Loader2 className="size-5 animate-spin text-emerald-300" />
                    Uploading...
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span>{selectedFile?.name ?? "video.mp4"}</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-emerald-400 transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-white/40">
                      You can start filling in the lesson details while we
                      finish processing.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/30 p-6 text-sm text-white/70">
                <p className="font-semibold text-white">Processing preview</p>
                <p className="mt-2 text-xs text-white/50">
                  Stay on this page while we prepare the upload for streaming
                  quality.
                </p>
              </div>
            </div>
          )}

          {uploadStage === "details" && (
            <form
              className="grid gap-8 px-8 py-10 text-white md:grid-cols-[minmax(0,1fr)_320px]"
              onSubmit={handleUploadFormSubmit}
            >
              <div className="space-y-6">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
                    Title
                  </label>
                  <input
                    name="title"
                    value={formState.title}
                    onChange={handleFormFieldChange}
                    required
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
                    placeholder="Name your lesson"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formState.description}
                    onChange={handleFormFieldChange}
                    rows={4}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
                    placeholder="Explain what students will learn, required materials, or extension activities."
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
                      Playlist
                    </label>
                    <input
                      name="playlist"
                      value={formState.playlist}
                      onChange={handleFormFieldChange}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
                      placeholder="Add to a playlist"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
                      Tags
                    </label>
                    <input
                      name="tags"
                      value={formState.tags}
                      onChange={handleFormFieldChange}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-400/70 focus:outline-none"
                      placeholder="Separate tags with commas"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
                      Audience
                    </label>
                    <select
                      name="audience"
                      value={formState.audience}
                      onChange={handleFormFieldChange}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white focus:border-emerald-400/70 focus:outline-none"
                    >
                      <option value="General">General audience</option>
                      <option value="Kids">Made for kids</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-[0.26em] text-white/50">
                      Visibility
                    </label>
                    <select
                      name="visibility"
                      value={formState.visibility}
                      onChange={handleFormFieldChange}
                      className="mt-2 w-full rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white focus:border-emerald-400/70 focus:outline-none"
                    >
                      <option value="Public">Public</option>
                      <option value="Unlisted">Unlisted</option>
                      <option value="Private">Private</option>
                    </select>
                  </div>
                </div>
                <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0f1117] px-4 py-3 text-sm text-white/70">
                  <input
                    type="checkbox"
                    name="allowComments"
                    checked={formState.allowComments}
                    onChange={handleFormFieldChange}
                    className="size-4 rounded border-white/30 bg-transparent text-emerald-400 focus:ring-emerald-500"
                  />
                  Allow comments and discussion prompts
                </label>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:border-white/40"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-emerald-400 px-6 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
                  >
                    Save & Publish
                  </button>
                </div>
              </div>

              <aside className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0f1117]">
                  <div className="aspect-video bg-black/40">
                    {previewUrl ? (
                      <video
                        src={previewUrl}
                        controls
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-white/40">
                        Preview generating...
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 px-4 py-3 text-sm text-white/70">
                    <p className="font-semibold text-white">
                      {formState.title ||
                        selectedFile?.name ||
                        "Untitled lesson"}
                    </p>
                    <p className="text-xs text-white/50">
                      {selectedFile
                        ? `${(selectedFile.size / (1024 * 1024)).toFixed(
                            1
                          )} MB · ${selectedFile.type || "video/mp4"}`
                        : "Upload ready"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-[#0f1117] p-4 text-xs text-white/60">
                  <p className="text-sm font-semibold text-white">
                    Processing status
                  </p>
                  <p className="mt-1">
                    Once saved, transcripts and auto-thumbnails will generate
                    within a few minutes. Lesson analytics begin as soon as the
                    video is published.
                  </p>
                </div>
              </aside>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
