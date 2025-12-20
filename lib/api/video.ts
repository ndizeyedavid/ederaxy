import { apiFetch } from "@/lib/api/client";
import { ApiError } from "@/lib/api/client";

export type VideoStatus = "uploaded" | "processing" | "ready" | "failed";

export type VideoVariant = {
  resolution: string;
  bandwidth: number;
  playlistPath: string;
  publicPlaylistPath: string;
};

export type LessonVideo = {
  id: string;
  lesson: string;
  status: VideoStatus;
  hlsMasterPlaylistPath: string | null;
  variants: VideoVariant[];
  duration: number | null;
  thumbnailUrl?: string;
  failureReason?: string;
  jobId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export async function uploadLessonVideo(lessonId: string, file: File) {
  const form = new FormData();
  form.append("video", file);

  return apiFetch<{ video: LessonVideo }>(`/api/v1/lessons/${lessonId}/video`, {
    method: "POST",
    body: form,
    isFormData: true,
  });
}

export async function uploadLessonThumbnail(lessonId: string, file: File) {
  const form = new FormData();
  form.append("thumbnail", file);

  try {
    return await apiFetch<{ video: LessonVideo }>(
      `/api/v1/lessons/${lessonId}/video/thumbnail`,
      {
        method: "POST",
        body: form,
        isFormData: true,
      }
    );
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) {
      try {
        return await apiFetch<{ video: LessonVideo }>(
          `/api/v1/lessons/${lessonId}/thumbnail`,
          {
            method: "POST",
            body: form,
            isFormData: true,
          }
        );
      } catch (inner) {
        if (inner instanceof ApiError && inner.statusCode === 404) {
          return apiFetch<{ video: LessonVideo }>(
            `/api/v1/lessons/${lessonId}/video-thumbnail`,
            {
              method: "POST",
              body: form,
              isFormData: true,
            }
          );
        }
        throw inner;
      }
    }
    throw err;
  }
}

export async function getLessonVideo(lessonId: string) {
  return apiFetch<{ video: LessonVideo }>(`/api/v1/lessons/${lessonId}/video`, {
    method: "GET",
  });
}
