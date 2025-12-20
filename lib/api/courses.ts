import { apiFetch } from "@/lib/api/client";
import type { Course } from "@/lib/mock/teacherData";
import { getId } from "@/lib/api/normalize";

export async function listCourses(options?: {
  subjectId?: string;
  teacherId?: string;
}) {
  const params = new URLSearchParams();
  if (options?.subjectId) params.set("subjectId", options.subjectId);
  if (options?.teacherId) params.set("teacherId", options.teacherId);

  const path = params.size
    ? `/api/v1/courses?${params.toString()}`
    : "/api/v1/courses";

  const data = await apiFetch<any>(path, { method: "GET" });

  const items: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.courses)
    ? data.courses
    : Array.isArray(data?.items)
    ? data.items
    : [];

  const courses: Course[] = items.map((c) => ({
    _id: String(c._id ?? c.id ?? ""),
    title: String(c.title ?? ""),
    description: c.description ?? undefined,
    subject: getId(c.subjectId ?? c.subject) || options?.subjectId || "",
    teacher: getId(c.teacherId ?? c.teacher ?? c.createdBy),
    isPublished: Boolean(c.isPublished ?? false),
    createdAt: String(c.createdAt ?? new Date().toISOString()),
    updatedAt: String(c.updatedAt ?? c.createdAt ?? new Date().toISOString()),
  }));

  return { courses };
}

export async function createCourse(payload: {
  title: string;
  description?: string;
  subjectId: string;
  isPublished?: boolean;
}) {
  const data = await apiFetch<any>("/api/v1/courses", {
    method: "POST",
    body: payload,
  });

  const c = data?.course ?? data;

  const course: Course = {
    _id: String(c._id ?? c.id ?? ""),
    title: String(c.title ?? payload.title),
    description: c.description ?? payload.description ?? undefined,
    subject: getId(c.subjectId ?? c.subject) || payload.subjectId,
    teacher: getId(c.teacherId ?? c.teacher ?? c.createdBy),
    isPublished: Boolean(c.isPublished ?? payload.isPublished ?? false),
    createdAt: String(c.createdAt ?? new Date().toISOString()),
    updatedAt: String(c.updatedAt ?? c.createdAt ?? new Date().toISOString()),
  };

  return { course };
}
