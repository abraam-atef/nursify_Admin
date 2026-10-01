import { api } from "@/api/axios";
import { LoginCredentials, LoginResponse } from "@/types/auth";

export const authApi = {
  login(credentials: LoginCredentials) {
    return api.post<LoginResponse>("/auth/", credentials).then((res) => res.data);
  },
  logout() {
    // Best-effort server-side invalidation; local state is cleared regardless.
  },
};
