import React, { createContext, useContext, useState, useCallback } from "react";
import type { UserData } from "../types/database";
import { loginUser, signupUser } from "../db/queries/users";
import { setToken } from "../api/client";

interface AuthContextValue {
  user: UserData | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(
    async (email: string, password: string) => {
      const userData = await loginUser(email, password);
      setUser(userData);
    },
    []
  );

  const signup = useCallback(
    async (email: string, password: string, name?: string) => {
      const userData = await signupUser(email, password, name);
      setUser(userData);
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
