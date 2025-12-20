export const ACCESS_TOKEN_STORAGE_KEY = "AccessToken";
export const REFRESH_TOKEN_STORAGE_KEY = "RefreshToken";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
}

export function clearAccessToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setRefreshToken(token: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
}

export function clearRefreshToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}
