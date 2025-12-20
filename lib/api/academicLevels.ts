import { apiFetch } from "@/lib/api/client";
import type { AcademicLevel } from "@/lib/mock/teacherData";
import { getId } from "@/lib/api/normalize";

export async function listAcademicLevels(options?: {
  curriculumId?: string;
  includeClasses?: boolean;
}) {
  const params = new URLSearchParams();
  if (options?.curriculumId) params.set("curriculumId", options.curriculumId);
  if (typeof options?.includeClasses === "boolean") {
    params.set("includeClasses", String(options.includeClasses));
  }

  const path = params.size
    ? `/api/v1/academic-levels?${params.toString()}`
    : "/api/v1/academic-levels";

  const data = await apiFetch<any>(path, { method: "GET" });

  const items: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.levels)
    ? data.levels
    : Array.isArray(data?.items)
    ? data.items
    : [];

  const levels: AcademicLevel[] = items.map((lvl) => ({
    _id: String(lvl._id ?? lvl.id ?? ""),
    title: String(lvl.name ?? lvl.title ?? ""),
    description: lvl.description ?? undefined,
    curriculum: getId(lvl.curriculumId ?? lvl.curriculum),
    order: Number(lvl.order ?? 0),
    createdBy: String(lvl.createdBy ?? lvl.teacherId ?? lvl.userId ?? ""),
    createdAt: String(lvl.createdAt ?? new Date().toISOString()),
    updatedAt: String(
      lvl.updatedAt ?? lvl.createdAt ?? new Date().toISOString()
    ),
  }));

  return { levels };
}

export async function createAcademicLevel(payload: {
  name: string;
  description?: string;
  stage: string;
  curriculumId: string;
  order?: number;
}) {
  const data = await apiFetch<any>("/api/v1/academic-levels", {
    method: "POST",
    body: payload,
  });

  const lvl = data?.level ?? data;

  const level: AcademicLevel = {
    _id: String(lvl._id ?? lvl.id ?? ""),
    title: String(lvl.name ?? lvl.title ?? payload.name),
    description: lvl.description ?? payload.description ?? undefined,
    curriculum:
      getId(lvl.curriculumId ?? lvl.curriculum) || payload.curriculumId,
    order: Number(lvl.order ?? payload.order ?? 0),
    createdBy: String(lvl.createdBy ?? lvl.teacherId ?? lvl.userId ?? ""),
    createdAt: String(lvl.createdAt ?? new Date().toISOString()),
    updatedAt: String(
      lvl.updatedAt ?? lvl.createdAt ?? new Date().toISOString()
    ),
  };

  return { level };
}
