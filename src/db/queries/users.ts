import type { SQLiteDatabase } from "expo-sqlite";
import type { UserData } from "../../types/database";

export async function getUserByEmail(
  db: SQLiteDatabase,
  email: string
): Promise<UserData | null> {
  return db.getFirstAsync<UserData>(
    "SELECT * FROM users WHERE email = ?",
    [email.toLowerCase()]
  );
}

export async function createUser(
  db: SQLiteDatabase,
  email: string,
  passwordHash: string,
  name?: string
): Promise<number> {
  const result = await db.runAsync(
    "INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)",
    [email.toLowerCase(), passwordHash, name ?? null]
  );
  return result.lastInsertRowId;
}

export async function getUserById(
  db: SQLiteDatabase,
  userId: number
): Promise<UserData | null> {
  return db.getFirstAsync<UserData>(
    "SELECT * FROM users WHERE user_id = ?",
    [userId]
  );
}
