import type { SQLiteDatabase } from 'expo-sqlite';
import type { Expense } from '../../types/database';

export async function getExpensesByTravel(
  db: SQLiteDatabase,
  travelId: number
): Promise<Expense[]> {
  return db.getAllAsync<Expense>(
    'SELECT * FROM expense WHERE travel_id = ? ORDER BY date ASC, expense_id ASC',
    [travelId]
  );
}

export async function getExpensesByDate(
  db: SQLiteDatabase,
  travelId: number,
  date: string
): Promise<Expense[]> {
  return db.getAllAsync<Expense>(
    'SELECT * FROM expense WHERE travel_id = ? AND date = ? ORDER BY expense_id ASC',
    [travelId, date]
  );
}

export async function getExpenseById(
  db: SQLiteDatabase,
  expenseId: number
): Promise<Expense | null> {
  return db.getFirstAsync<Expense>(
    'SELECT * FROM expense WHERE expense_id = ?',
    [expenseId]
  );
}

export interface DailyTotal {
  date: string;
  total_eur: number;
  count: number;
}

export async function getDailyTotals(
  db: SQLiteDatabase,
  travelId: number
): Promise<DailyTotal[]> {
  return db.getAllAsync<DailyTotal>(
    `SELECT date, SUM(amount_eur) as total_eur, COUNT(*) as count
     FROM expense WHERE travel_id = ?
     GROUP BY date ORDER BY date ASC`,
    [travelId]
  );
}

export interface CategoryTotal {
  category: string;
  total_eur: number;
  count: number;
}

export async function getCategoryTotals(
  db: SQLiteDatabase,
  travelId: number
): Promise<CategoryTotal[]> {
  return db.getAllAsync<CategoryTotal>(
    `SELECT category, SUM(amount_eur) as total_eur, COUNT(*) as count
     FROM expense WHERE travel_id = ?
     GROUP BY category ORDER BY total_eur DESC`,
    [travelId]
  );
}

export async function getTotalExpenses(
  db: SQLiteDatabase,
  travelId: number
): Promise<number> {
  const result = await db.getFirstAsync<{ total: number }>(
    'SELECT COALESCE(SUM(amount_eur), 0) as total FROM expense WHERE travel_id = ?',
    [travelId]
  );
  return result?.total ?? 0;
}

export async function insertExpense(
  db: SQLiteDatabase,
  expense: Omit<Expense, 'expense_id'>
): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO expense (
      travel_id, itinerary_id, date, description, category,
      amount_eur, amount_local, local_currency_code,
      receipt_image_uri, voice_note_uri
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      expense.travel_id,
      expense.itinerary_id,
      expense.date,
      expense.description,
      expense.category,
      expense.amount_eur,
      expense.amount_local,
      expense.local_currency_code,
      expense.receipt_image_uri,
      expense.voice_note_uri,
    ]
  );
  return result.lastInsertRowId;
}

export async function updateExpense(
  db: SQLiteDatabase,
  expense: Expense
): Promise<void> {
  await db.runAsync(
    `UPDATE expense SET
      travel_id = ?, itinerary_id = ?, date = ?, description = ?, category = ?,
      amount_eur = ?, amount_local = ?, local_currency_code = ?,
      receipt_image_uri = ?, voice_note_uri = ?
     WHERE expense_id = ?`,
    [
      expense.travel_id,
      expense.itinerary_id,
      expense.date,
      expense.description,
      expense.category,
      expense.amount_eur,
      expense.amount_local,
      expense.local_currency_code,
      expense.receipt_image_uri,
      expense.voice_note_uri,
      expense.expense_id,
    ]
  );
}

export async function deleteExpense(
  db: SQLiteDatabase,
  expenseId: number
): Promise<void> {
  await db.runAsync('DELETE FROM expense WHERE expense_id = ?', [expenseId]);
}
