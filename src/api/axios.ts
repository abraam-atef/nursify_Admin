import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "@/utils/storage";

/**
 * Every authenticated HTTP call in the app goes through this instance.
 * It attaches the access token on the way out, and on the way back it
 * catches a 401, exchanges the refresh token for a new access token,
 * and retries the original request exactly once.
 *
 * Concurrent 401s are coalesced: only the first one triggers a refresh
 * call, every other pending request awaits that same in-flight promise
 * instead of firing its own refresh request.
 */
const baseURL = "https://nursify.pythonanywhere.com";

export const api = axios.create({ baseURL });

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

api.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }
  const response = await axios.post(`${baseURL}/auth/refresh`, { refreshToken });
  const newAccessToken: string = response.data.accessToken;
  tokenStorage.setAccessToken(newAccessToken);
  return newAccessToken;
}

/** Called from AuthContext so a failed refresh can clear state and redirect. */
let onRefreshFailure: (() => void) | null = null;
export function registerRefreshFailureHandler(handler: () => void) {
  onRefreshFailure = handler;
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig | undefined;

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Never attempt to refresh on the refresh/login endpoints themselves.
    if (originalRequest.url?.includes("/auth/refresh") || originalRequest.url?.includes("/auth/login")) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }
      const newAccessToken = await refreshPromise;
      const headers = originalRequest.headers as unknown as Record<string, string>;
      headers["Authorization"] = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      tokenStorage.clear();
      onRefreshFailure?.();
      return Promise.reject(refreshError);
    }
  }
);

/** Turns an unknown Axios error into a short, human-readable message. */
export function extractErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const serverMessage =
      (error.response?.data as { message?: string } | undefined)?.message;
    if (serverMessage) return serverMessage;
    if (status === 403) return "You don't have permission to do that.";
    if (status === 404) return "We couldn't find that.";
    if (status === 409) return "This conflicts with existing data.";
    if (status && status >= 500) return "The server ran into a problem. Please try again.";
    if (error.message === "Network Error") return "Can't reach the server. Check your connection.";
  }
  return fallback;
}
