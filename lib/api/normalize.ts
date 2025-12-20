export type IdLike = string | { _id?: string | null } | null | undefined;

export function getId(value: IdLike): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && typeof value._id === "string")
    return value._id;
  return "";
}

export function getIdArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  return value
    .map((v) => {
      if (typeof v === "string") return v;
      if (v && typeof v === "object" && typeof (v as any)._id === "string") {
        return String((v as any)._id);
      }
      return "";
    })
    .filter(Boolean);
}
