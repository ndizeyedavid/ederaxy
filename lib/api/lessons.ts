import { ApiError, apiFetch } from "@/lib/api/client";
import type { Lesson, LessonResource } from "@/lib/mock/teacherData";
import { getId } from "@/lib/api/normalize";

export async function listLessons(options?: { courseId?: string }) {
  if (!options?.courseId) {
    return { lessons: [] };
  }

  const courseId = options.courseId;
  const params = new URLSearchParams();
  params.set("courseId", courseId);

  const fetchItems = async (path: string) => {
    const data = await apiFetch<any>(path, { method: "GET" });
    const items: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.lessons)
      ? data.lessons
      : Array.isArray(data?.items)
      ? data.items
      : [];
    return items;
  };

  let items: any[] = [];
  try {
    items = await fetchItems(`/api/v1/lessons?${params.toString()}`);
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) {
      items = await fetchItems(`/api/v1/lessons/all/${courseId}`);
    } else {
      throw err;
    }
  }

  const lessons: Lesson[] = items.map((l) => ({
    _id: String(l._id ?? l.id ?? ""),
    title: String(l.title ?? ""),
    description: l.description ?? undefined,
    order: Number(l.order ?? 1),
    course: getId(l.courseId ?? l.course) || courseId,
    resources: Array.isArray(l.resources)
      ? (l.resources as any[]).map((r) => ({
          label: String(r.label ?? ""),
          url: String(r.url ?? ""),
        }))
      : undefined,
    video: getId(l.videoId ?? l.video) || null,
    createdAt: String(l.createdAt ?? new Date().toISOString()),
    updatedAt: String(l.updatedAt ?? l.createdAt ?? new Date().toISOString()),
  }));

  return { lessons };
}

export async function createLesson(payload: {
  title: string;
  description?: string;
  courseId: string;
  order: number;
  resources?: LessonResource[];
}) {
  const data = await apiFetch<any>("/api/v1/lessons", {
    method: "POST",
    body: payload,
  });

  const l = data?.lesson ?? data;

  const lesson: Lesson = {
    _id: String(l._id ?? l.id ?? ""),
    title: String(l.title ?? payload.title),
    description: l.description ?? payload.description ?? undefined,
    order: Number(l.order ?? payload.order ?? 1),
    course: getId(l.courseId ?? l.course) || payload.courseId,
    resources: Array.isArray(l.resources)
      ? (l.resources as any[]).map((r) => ({
          label: String(r.label ?? ""),
          url: String(r.url ?? ""),
        }))
      : payload.resources,
    video: getId(l.videoId ?? l.video) || null,
    createdAt: String(l.createdAt ?? new Date().toISOString()),
    updatedAt: String(l.updatedAt ?? l.createdAt ?? new Date().toISOString()),
  };

  return { lesson };
}
