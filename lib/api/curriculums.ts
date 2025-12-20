import { apiFetch } from "@/lib/api/client";
import type { Curriculum } from "@/lib/mock/teacherData";
import { getId } from "@/lib/api/normalize";

export type CurriculumListItem = {
  _id: string;
  name: string;
};

export async function listCurriculums() {
  const data = await apiFetch<any>("/api/v1/curriculums", { method: "GET" });

  const items: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.curriculums)
    ? data.curriculums
    : Array.isArray(data?.items)
    ? data.items
    : [];

  const curriculums: Curriculum[] = items.map((c) => ({
    _id: String(c._id ?? c.id ?? ""),
    title: String(c.name ?? c.title ?? ""),
    description: c.description ?? undefined,
    country: c.country ?? undefined,
    createdBy: getId(c.createdBy ?? c.teacherId ?? c.userId),
    createdAt: String(c.createdAt ?? new Date().toISOString()),
    updatedAt: String(c.updatedAt ?? c.createdAt ?? new Date().toISOString()),
  }));

  return { curriculums };
}

export async function createCurriculum(payload: {
  name: string;
  description?: string;
  country?: string;
}) {
  const data = await apiFetch<any>("/api/v1/curriculums", {
    method: "POST",
    body: payload,
  });

  const c = data?.curriculum ?? data;

  const curriculum: Curriculum = {
    _id: String(c._id ?? c.id ?? ""),
    title: String(c.name ?? c.title ?? payload.name),
    description: c.description ?? payload.description ?? undefined,
    country: c.country ?? payload.country ?? undefined,
    createdBy: getId(c.createdBy ?? c.teacherId ?? c.userId),
    createdAt: String(c.createdAt ?? new Date().toISOString()),
    updatedAt: String(c.updatedAt ?? c.createdAt ?? new Date().toISOString()),
  };

  return { curriculum };
}

export async function getCurriculums() {
  const res = await listCurriculums();
  const curriculums: CurriculumListItem[] = res.curriculums.map((c) => ({
    _id: c._id,
    name: c.title,
  }));
  return { curriculums };
}
