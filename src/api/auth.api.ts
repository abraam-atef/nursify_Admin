import { api } from "@/api/axios";
import { LoginCredentials, LoginResponse ,GoogleLoginCredentials} from "@/types/auth";

export const authApi = {
  login(credentials: LoginCredentials) {
    return api.post<LoginResponse>("/auth/login/", credentials).then((res) => res.data);
  },
  googlelogin(credentials: GoogleLoginCredentials) {
    return api.post<LoginResponse>("/auth/google/", credentials).then((res) => res.data);
  },
  logout() {
    // Best-effort server-side invalidation; local state is cleared regardless.
  },
};
