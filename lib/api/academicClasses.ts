import { apiFetch } from "@/lib/api/client";
import type { AcademicClass } from "@/lib/mock/teacherData";
import { getId } from "@/lib/api/normalize";

export async function listAcademicClasses(options?: {
  levelId?: string;
  includeCombinations?: boolean;
}) {
  const params = new URLSearchParams();
  if (options?.levelId) {
    params.set("levelId", options.levelId);
    params.set("academicLevelId", options.levelId);
  }
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
    : Array.isArray(data?.academicClasses)
    ? data.academicClasses
    : Array.isArray(data?.data?.classes)
    ? data.data.classes
    : Array.isArray(data?.items)
    ? data.items
    : [];

  const classes: AcademicClass[] = items.map((cls) => ({
    _id: String(cls._id ?? cls.id ?? ""),
    title: String(cls.name ?? cls.title ?? ""),
    description: cls.description ?? undefined,
    curriculum:
      getId(cls.curriculumId ?? cls.curriculum) || getId(cls.level?.curriculum),
    academicLevel: getId(
      cls.levelId ?? cls.academicLevelId ?? cls.academicLevel ?? cls.level
    ),
    createdBy: String(cls.createdBy ?? cls.teacherId ?? cls.userId ?? ""),
    createdAt: String(cls.createdAt ?? new Date().toISOString()),
    updatedAt: String(
      cls.updatedAt ?? cls.createdAt ?? new Date().toISOString()
    ),
  }));

  return { classes };
}

export async function createAcademicClass(payload: {
  name: string;
  code: string;
  description?: string;
  levelId: string;
  curriculumId?: string;
  order?: number;
  combinationIds?: string[];
}) {
  const data = await apiFetch<any>("/api/v1/academic-classes", {
    method: "POST",
    body: {
      ...payload,
      academicLevelId: payload.levelId,
      curriculumId: payload.curriculumId,
    },
  });

  const cls = data?.class ?? data;

  const academicClass: AcademicClass = {
    _id: String(cls._id ?? cls.id ?? ""),
    title: String(cls.name ?? cls.title ?? payload.name),
    description: cls.description ?? payload.description ?? undefined,
    curriculum:
      getId(cls.curriculumId ?? cls.curriculum) ||
      getId(cls.level?.curriculum) ||
      payload.curriculumId ||
      "",
    academicLevel:
      getId(
        cls.levelId ?? cls.academicLevelId ?? cls.academicLevel ?? cls.level
      ) || payload.levelId,
    createdBy: String(cls.createdBy ?? cls.teacherId ?? cls.userId ?? ""),
    createdAt: String(cls.createdAt ?? new Date().toISOString()),
    updatedAt: String(
      cls.updatedAt ?? cls.createdAt ?? new Date().toISOString()
    ),
  };

  return { academicClass };
}
