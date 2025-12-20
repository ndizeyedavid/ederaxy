import { apiFetch } from "@/lib/api/client";
import { setAccessToken, setRefreshToken } from "@/lib/api/token";

export type LoginRequest = {
  email: string;
  password: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type LoginResponseData = {
  AccessToken?: string;
  tokens?: {
    accessToken?: string;
    refreshToken?: string;
  };
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
  role: "student" | "teacher";
  dob?: string;
  nationalId?: string;
  profilePicture?: string | null;
  bio?: string;
  phone?: string;
  teacherTitle?: string;
  yearsExperience?: number;
  highestQualification?: string;
  subjects?: string[];
  schoolName?: string;
  schoolType?: string;
  country?: string;
  city?: string;
  preferredCurriculumId?: string;
  agreeToTerms?: boolean;
  termsVersion?: string;
};

export type User = {
  _id?: string;
  id?: string;
  fullName?: string;
  email?: string;
  role?: string;
  profilePicture?: string | null;
  [key: string]: any;
};

export async function login(payload: LoginRequest) {
  const data = await apiFetch<LoginResponseData>("/api/v1/auth/login", {
    method: "POST",
    body: payload,
  });

  const accessToken = data?.tokens?.accessToken ?? data?.AccessToken;
  const refreshToken = data?.tokens?.refreshToken;

  if (!accessToken) {
    throw new Error("Login succeeded but no access token was returned.");
  }

  setAccessToken(accessToken);
  if (refreshToken) setRefreshToken(refreshToken);
  return data;
}

export async function register(payload: RegisterRequest) {
  return apiFetch<{ user?: User }>("/api/v1/auth/register", {
    method: "POST",
    body: payload,
  });
}

export async function me() {
  return apiFetch<{ user: User }>("/api/v1/auth/me", {
    method: "GET",
  });
}

export async function uploadProfilePicture(file: File) {
  const formData = new FormData();
  formData.append("profilePicture", file);

  return apiFetch<{ user: User }>("/api/v1/auth/me/profile-picture", {
    method: "POST",
    body: formData,
    isFormData: true,
  });
}

export async function requestPasswordReset(payload: ForgotPasswordRequest) {
  return apiFetch<{
    message?: string;
  }>("/api/v1/auth/forgot-password", {
    method: "POST",
    body: payload,
  });
}
