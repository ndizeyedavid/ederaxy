import { getAccessToken } from "@/lib/api/token";

export type ApiEnvelope<T> = {
  status: "success" | "error";
  message?: string;
  data?: T;
};

export type ApiFieldIssue = {
  field?: string;
  message?: string;
};

export class ApiError extends Error {
  statusCode?: number;
  details?: ApiFieldIssue[];

  constructor(
    message: string,
    options?: { statusCode?: number; details?: ApiFieldIssue[] }
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = options?.statusCode;
    this.details = options?.details;
  }
}

function resolveApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "http://localhost:8080"
  );
}

function buildHeaders(options?: {
  token?: string | null;
  isJson?: boolean;
  headers?: HeadersInit;
}): HeadersInit {
  const token = options?.token ?? getAccessToken();

  const headers: Record<string, string> = {};
  if (options?.isJson) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  return {
    ...headers,
    ...(options?.headers ?? {}),
  };
}

export async function apiFetch<TData>(
  path: string,
  options?: {
    method?: string;
    token?: string | null;
    body?: any;
    headers?: HeadersInit;
    isFormData?: boolean;
  }
): Promise<TData> {
  const apiBase = resolveApiBaseUrl();
  const url = new URL(path, apiBase).href;

  const method = options?.method ?? (options?.body ? "POST" : "GET");
  const isFormData = Boolean(options?.isFormData);
  const isJson = Boolean(options?.body) && !isFormData;

  const response = await fetch(url, {
    method,
    headers: buildHeaders({
      token: options?.token,
      isJson,
      headers: options?.headers,
    }),
    body: options?.body
      ? isFormData
        ? (options.body as BodyInit)
        : JSON.stringify(options.body)
      : undefined,
  });

  let json: ApiEnvelope<any> | null = null;
  try {
    json = (await response.json()) as ApiEnvelope<any>;
  } catch {
    json = null;
  }

  const message =
    (json as any)?.message || (response.ok ? "Success" : "Request failed");

  const hasEnvelopeStatus =
    (json as any)?.status === "success" || (json as any)?.status === "error";

  if (!response.ok) {
    const details = (json as any)?.data?.details as ApiFieldIssue[] | undefined;
    throw new ApiError(message, { statusCode: response.status, details });
  }

  if (hasEnvelopeStatus && (json as any)?.status === "error") {
    const details = (json as any)?.data?.details as ApiFieldIssue[] | undefined;
    throw new ApiError(message, { statusCode: response.status, details });
  }

  if (hasEnvelopeStatus) {
    return ((json as any)?.data ?? null) as TData;
  }

  return (json as any as TData) ?? (null as TData);
}
