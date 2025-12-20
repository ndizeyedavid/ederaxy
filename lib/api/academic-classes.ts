import { apiFetch } from "@/lib/api/client";

export type AcademicClass = {
  _id: string;
  name: string;
  code?: string;
  levelId?: string;
  order?: number;
  combinationIds?: string[];
};

export async function listAcademicClasses(options?: {
  levelId?: string;
  includeCombinations?: boolean;
}) {
  const params = new URLSearchParams();
  if (options?.levelId) params.set("levelId", options.levelId);
  if (typeof options?.includeCombinations === "boolean") {
    params.set("includeCombinations", String(options.includeCombinations));
  }

  const path = params.size
    ? `/api/v1/academic-classes?${params.toString()}`
    : "/api/v1/academic-classes";

  const data = await apiFetch<any>(path, { method: "GET" });

  const items: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.classes)
    ? data.classes
    : Array.isArray(data?.items)
    ? data.items
    : [];

  const classes: AcademicClass[] = items.map((c) => ({
    _id: String(c._id ?? c.id ?? ""),
    name: String(c.name ?? ""),
    code: c.code ?? undefined,
    levelId: String(c.levelId ?? c.level ?? "") || undefined,
    order: typeof c.order === "number" ? c.order : Number(c.order ?? undefined),
    combinationIds: Array.isArray(c.combinationIds)
      ? c.combinationIds.map((x: any) => String(x))
      : undefined,
  }));

  return { classes };
}

export async function getAcademicClass(
  classId: string,
  options?: { includeCombinations?: boolean }
) {
  const params = new URLSearchParams();
  if (typeof options?.includeCombinations === "boolean") {
    params.set("includeCombinations", String(options.includeCombinations));
  }

  const path = params.size
    ? `/api/v1/academic-classes/${classId}?${params.toString()}`
    : `/api/v1/academic-classes/${classId}`;

  const data = await apiFetch<any>(path, { method: "GET" });
  const c = data?.class ?? data;

  const academicClass: AcademicClass = {
    _id: String(c._id ?? c.id ?? classId),
    name: String(c.name ?? ""),
    code: c.code ?? undefined,
    levelId: String(c.levelId ?? c.level ?? "") || undefined,
    order: typeof c.order === "number" ? c.order : Number(c.order ?? undefined),
    combinationIds: Array.isArray(c.combinationIds)
      ? c.combinationIds.map((x: any) => String(x))
      : undefined,
  };

  return { academicClass };
}
