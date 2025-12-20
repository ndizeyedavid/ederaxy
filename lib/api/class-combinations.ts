import { apiFetch } from "@/lib/api/client";

export type ClassCombination = {
  _id: string;
  name: string;
  code?: string;
  type?: string;
  subjects?: string[];
};

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

  const combinations: ClassCombination[] = items.map((c) => ({
    _id: String(c._id ?? c.id ?? ""),
    name: String(c.name ?? ""),
    code: c.code ?? undefined,
    type: c.type ?? undefined,
    subjects: Array.isArray(c.subjects)
      ? c.subjects.map((x: any) => String(x))
      : undefined,
  }));

  return { combinations };
}

export async function getClassCombination(
  combinationId: string,
  options?: { includeSubjects?: boolean }
) {
  const params = new URLSearchParams();
  if (typeof options?.includeSubjects === "boolean") {
    params.set("includeSubjects", String(options.includeSubjects));
  }

  const path = params.size
    ? `/api/v1/class-combinations/${combinationId}?${params.toString()}`
    : `/api/v1/class-combinations/${combinationId}`;

  const data = await apiFetch<any>(path, { method: "GET" });
  const c = data?.combination ?? data;

  const combination: ClassCombination = {
    _id: String(c._id ?? c.id ?? combinationId),
    name: String(c.name ?? ""),
    code: c.code ?? undefined,
    type: c.type ?? undefined,
    subjects: Array.isArray(c.subjects)
      ? c.subjects.map((x: any) => String(x))
      : undefined,
  };

  return { combination };
}
