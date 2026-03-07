import React, { createContext, useContext, useState, useCallback } from "react";
import { useSQLiteContext } from "expo-sqlite";
import type { UserData } from "../types/database";
import { getUserByEmail, getUserById, createUser } from "../db/queries/users";
import { hashPassword } from "../db/database";

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
  const db = useSQLiteContext();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(
    async (email: string, password: string) => {
      const existing = await getUserByEmail(db, email);
      if (!existing) {
        throw new Error("No account found with that email");
      }
      const hash = await hashPassword(password, email);
      if (hash !== existing.password_hash) {
        throw new Error("Incorrect password");
      }
      setUser(existing);
    },
    [db]
  );

  const signup = useCallback(
    async (email: string, password: string, name?: string) => {
      const existing = await getUserByEmail(db, email);
      if (existing) {
        throw new Error("An account with that email already exists");
      }
      const hash = await hashPassword(password, email);
      const userId = await createUser(db, email, hash, name);
      const newUser = await getUserById(db, userId);
      setUser(newUser);
    },
    [db]
  );

  const logout = useCallback(() => {
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
