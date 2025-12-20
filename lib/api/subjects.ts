import { apiFetch } from "@/lib/api/client";
import type { Subject } from "@/lib/mock/teacherData";
import { getId, getIdArray } from "@/lib/api/normalize";

export async function listSubjectsByCurriculum(curriculumId: string) {
  const data = await apiFetch<any>(`/api/v1/subjects/all/${curriculumId}`, {
    method: "GET",
  });

  const items: any[] = Array.isArray(data)
    ? data
    : Array.isArray(data?.subjects)
    ? data.subjects
    : Array.isArray(data?.items)
    ? data.items
    : [];

  const subjects: Subject[] = items.map((s) => ({
    _id: String(s._id ?? s.id ?? ""),
    title: String(s.title ?? s.name ?? ""),
    description: s.description ?? undefined,
    curriculum: getId(s.curriculumId ?? s.curriculum) || curriculumId,
    targetLevels: getIdArray(s.targetLevelIds ?? s.targetLevels),
    targetClasses: getIdArray(s.targetClassIds ?? s.targetClasses),
    targetCombinations: getIdArray(
      s.targetCombinationIds ?? s.targetCombinations
    ),
    createdBy: String(s.createdBy ?? s.teacherId ?? s.userId ?? ""),
    createdAt: String(s.createdAt ?? new Date().toISOString()),
    updatedAt: String(s.updatedAt ?? s.createdAt ?? new Date().toISOString()),
  }));

  return { subjects };
}

export async function createSubject(payload: {
  title: string;
  description?: string;
  curriculumId: string;
  targetLevelIds?: string[];
  targetClassIds?: string[];
  targetCombinationIds?: string[];
}) {
  const data = await apiFetch<any>("/api/v1/subjects", {
    method: "POST",
    body: payload,
  });

  const s = data?.subject ?? data;

  const subject: Subject = {
    _id: String(s._id ?? s.id ?? ""),
    title: String(s.title ?? s.name ?? payload.title),
    description: s.description ?? payload.description ?? undefined,
    curriculum: getId(s.curriculumId ?? s.curriculum) || payload.curriculumId,
    targetLevels:
      getIdArray(s.targetLevelIds ?? s.targetLevels) ?? payload.targetLevelIds,
    targetClasses:
      getIdArray(s.targetClassIds ?? s.targetClasses) ?? payload.targetClassIds,
    targetCombinations:
      getIdArray(s.targetCombinationIds ?? s.targetCombinations) ??
      payload.targetCombinationIds,
    createdBy: String(s.createdBy ?? s.teacherId ?? s.userId ?? ""),
    createdAt: String(s.createdAt ?? new Date().toISOString()),
    updatedAt: String(s.updatedAt ?? s.createdAt ?? new Date().toISOString()),
  };

  return { subject };
}
