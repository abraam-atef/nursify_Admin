import { useAuthContext } from "@/context/AuthContext";

/** Thin, ergonomic re-export so components import from `hooks`, not `context`. */
export function useAuth() {
  return useAuthContext();
}
