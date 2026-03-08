import { apiPost, setToken } from "../../api/client";
import type { UserData } from "../../types/database";

interface AuthResponse {
  access_token: string;
  user_id: number;
  email: string;
  name: string | null;
}

export async function loginUser(
  email: string,
  password: string
): Promise<UserData> {
  const res = await apiPost<AuthResponse>("/auth/login", { email, password });
  setToken(res.access_token);
  return {
    user_id: res.user_id,
    email: res.email,
    password_hash: "",
    name: res.name,
    created_at: "",
  };
}

export async function signupUser(
  email: string,
  password: string,
  name?: string
): Promise<UserData> {
  const res = await apiPost<AuthResponse>("/auth/signup", {
    email,
    password,
    name,
  });
  setToken(res.access_token);
  return {
    user_id: res.user_id,
    email: res.email,
    password_hash: "",
    name: res.name,
    created_at: "",
  };
}
