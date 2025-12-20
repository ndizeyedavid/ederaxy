import { apiFetch } from "@/lib/api/client";
import type { ClassCombination } from "@/lib/mock/teacherData";
import { getIdArray } from "@/lib/api/normalize";

export async function listClassCombinations(options?: {
  type?: string;
  includeSubjects?: boolean;
}) {
  const params = new URLSearchParams();
  if (options?.type) params.set("type", options.type);
  if (typeof options?.includeSubjects === "boolean") {
    params.set("includeSubjects", String(options.includeSubjects));
  }

  const path = params.size
    ? `/api/v1/class-combinations?${params.toString()}`
    : "/api/v1/class-combinations";

  const data = await apiFetch<any>(path, { method: "GET" });

  const items: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.combinations)
    ? data.combinations
    : Array.isArray(data?.items)
    ? data.items
    : [];

  const combinations: ClassCombination[] = items.map((combo) => ({
    _id: String(combo._id ?? combo.id ?? ""),
    title: String(combo.name ?? combo.title ?? ""),
    description: combo.description ?? undefined,
    subjects:
      getIdArray(combo.subjects ?? combo.subjectIds) ??
      (Array.isArray(combo.subjects)
        ? combo.subjects.map((s: any) => String(s))
        : Array.isArray(combo.subjectIds)
        ? combo.subjectIds.map((s: any) => String(s))
        : []),
    createdBy: String(combo.createdBy ?? combo.teacherId ?? combo.userId ?? ""),
    createdAt: String(combo.createdAt ?? new Date().toISOString()),
    updatedAt: String(
      combo.updatedAt ?? combo.createdAt ?? new Date().toISOString()
    ),
  }));

  return { combinations };
}

export async function createClassCombination(payload: {
  name: string;
  code: string;
  description?: string;
  type?: string;
  subjects?: string[];
}) {
  const data = await apiFetch<any>("/api/v1/class-combinations", {
    method: "POST",
    body: payload,
  });

  const combo = data?.combination ?? data;

  const combination: ClassCombination = {
    _id: String(combo._id ?? combo.id ?? ""),
    title: String(combo.name ?? combo.title ?? payload.name),
    description: combo.description ?? payload.description ?? undefined,
    subjects:
      getIdArray(combo.subjects ?? combo.subjectIds) ?? payload.subjects ?? [],
    createdBy: String(combo.createdBy ?? combo.teacherId ?? combo.userId ?? ""),
    createdAt: String(combo.createdAt ?? new Date().toISOString()),
    updatedAt: String(
      combo.updatedAt ?? combo.createdAt ?? new Date().toISOString()
    ),
  };

  return { combination };
}
