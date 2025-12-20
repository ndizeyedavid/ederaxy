import { mkdir, writeFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

function sanitizeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const { lessonId } = await params;

  const formData = await request.formData();
  const file = formData.get("file");
  const label = String(formData.get("label") ?? "").trim();

  if (!file || !(file instanceof File)) {
    return Response.json(
      { status: "error", message: "Missing file" },
      { status: 400 }
    );
  }

  if (!label) {
    return Response.json(
      { status: "error", message: "Missing label" },
      { status: 400 }
    );
  }

  const safeOriginal = sanitizeFileName(file.name || "resource");
  const uniquePrefix =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : String(Date.now());

  const storedFileName = `${uniquePrefix}_${safeOriginal}`;

  const uploadDir = path.join(
    process.cwd(),
    "public",
    "uploads",
    "lessons",
    lessonId,
    "resources"
  );
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, storedFileName);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const publicUrl = `/uploads/lessons/${lessonId}/resources/${storedFileName}`;

  return Response.json({
    status: "success",
    message: "Resource uploaded",
    data: {
      url: publicUrl,
      label,
      originalFileName: file.name,
      mimeType: file.type,
      size: file.size,
    },
  });
}
