/**
 * Centralized LocalStorage access. Keeping every key name in one place
 * avoids typos scattered across the codebase and makes it easy to see
 * exactly what the app persists client-side.
 */
const KEYS = {
  access: "nursify_access_token",
  refresh: "nursify_refresh_token",
  theme: "nursify_theme",
} as const;

export type ThemeValue = "light" | "dark";

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(KEYS.access);
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(KEYS.refresh);
  },
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(KEYS.access, accessToken);
    localStorage.setItem(KEYS.refresh, refreshToken);
  },
  setAccessToken(accessToken: string): void {
    localStorage.setItem(KEYS.access, accessToken);
  },
  clear(): void {
    localStorage.removeItem(KEYS.access);
    localStorage.removeItem(KEYS.refresh);
  },
  hasTokens(): boolean {
    return Boolean(localStorage.getItem(KEYS.access));
  },
};

export const themeStorage = {
  get(): ThemeValue | null {
    const value = localStorage.getItem(KEYS.theme);
    return value === "light" || value === "dark" ? value : null;
  },
  set(value: ThemeValue): void {
    localStorage.setItem(KEYS.theme, value);
  },
};
