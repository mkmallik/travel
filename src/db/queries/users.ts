import type { SQLiteDatabase } from 'expo-sqlite';
import type { User } from '../../types/database';

export async function getUserByEmail(
  db: SQLiteDatabase,
  email: string
): Promise<User | null> {
  return db.getFirstAsync<User>(
    'SELECT * FROM users WHERE email = ?',
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
    'INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)',
    [email.toLowerCase(), passwordHash, name ?? null]
  );
  return result.lastInsertRowId;
}

export async function getUserById(
  db: SQLiteDatabase,
  userId: number
): Promise<User | null> {
  return db.getFirstAsync<User>(
    'SELECT * FROM users WHERE user_id = ?',
    [userId]
  );
}
