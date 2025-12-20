import { apiFetch } from "@/lib/api/client";

export type AcademicLevel = {
  _id: string;
  name: string;
  description?: string;
  stage?: string;
  curriculumId?: string;
  order?: number;
};

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

  const levels: AcademicLevel[] = items.map((l) => ({
    _id: String(l._id ?? l.id ?? ""),
    name: String(l.name ?? ""),
    description: l.description ?? undefined,
    stage: l.stage ?? undefined,
    curriculumId: String(l.curriculumId ?? l.curriculum ?? "") || undefined,
    order: typeof l.order === "number" ? l.order : Number(l.order ?? undefined),
  }));

  return { levels };
}

export async function getAcademicLevel(
  levelId: string,
  options?: { includeClasses?: boolean }
) {
  const params = new URLSearchParams();
  if (typeof options?.includeClasses === "boolean") {
    params.set("includeClasses", String(options.includeClasses));
  }

  const path = params.size
    ? `/api/v1/academic-levels/${levelId}?${params.toString()}`
    : `/api/v1/academic-levels/${levelId}`;

  const data = await apiFetch<any>(path, { method: "GET" });
  const l = data?.level ?? data;

  const level: AcademicLevel = {
    _id: String(l._id ?? l.id ?? levelId),
    name: String(l.name ?? ""),
    description: l.description ?? undefined,
    stage: l.stage ?? undefined,
    curriculumId: String(l.curriculumId ?? l.curriculum ?? "") || undefined,
    order: typeof l.order === "number" ? l.order : Number(l.order ?? undefined),
  };

  return { level };
}
