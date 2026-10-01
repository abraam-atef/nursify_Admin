import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { authApi } from "@/api/auth.api";
import { registerRefreshFailureHandler } from "@/api/axios";
import { AdminUser, LoginCredentials } from "@/types/auth";
import { tokenStorage } from "@/utils/storage";

interface AuthContextValue {
  isAuthenticated: boolean;
  isInitializing: boolean;
  admin: AdminUser | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(tokenStorage.hasTokens());
  const [isInitializing, setIsInitializing] = useState(true);
  const [admin, setAdmin] = useState<AdminUser | null>(null);

  // On mount, trust whatever tokens are already in LocalStorage. If they're
  // stale, the very first protected API call will 401 -> refresh -> and if
  // the refresh token is also gone, forceLogout() below takes over.
  useEffect(() => {
    setIsAuthenticated(tokenStorage.hasTokens());
    setIsInitializing(false);
  }, []);

  useEffect(() => {
    registerRefreshFailureHandler(() => {
      setIsAuthenticated(false);
      setAdmin(null);
    });
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const response = await authApi.login(credentials);
    tokenStorage.setTokens(response.access, response.refresh);
    if (response.admin) setAdmin(response.admin);
    setIsAuthenticated(true);
  };

  const logout = () => {
    authApi.logout();
    tokenStorage.clear();
    setAdmin(null);
    setIsAuthenticated(false);
  };

  const value = useMemo<AuthContextValue>(
    () => ({ isAuthenticated, isInitializing, admin, login, logout }),
    [isAuthenticated, isInitializing, admin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within an AuthProvider");
  return ctx;
}
