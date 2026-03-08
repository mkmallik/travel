import { apiGet, apiPost, apiPut, apiDelete } from "../../api/client";
import type {
  ExpenseData,
  DailyTotalData,
  CategoryTotalData,
} from "../../types/database";

export async function getExpensesByTravel(
  travelId: number
): Promise<ExpenseData[]> {
  return apiGet<ExpenseData[]>(`/travels/${travelId}/expenses`);
}

export async function getExpensesByDate(
  travelId: number,
  date: string
): Promise<ExpenseData[]> {
  return apiGet<ExpenseData[]>(`/travels/${travelId}/expenses?date=${date}`);
}

export async function getExpenseById(
  travelId: number,
  expenseId: number
): Promise<ExpenseData | null> {
  try {
    return await apiGet<ExpenseData>(
      `/travels/${travelId}/expenses/${expenseId}`
    );
  } catch {
    return null;
  }
}

export async function getDailyTotals(
  travelId: number
): Promise<DailyTotalData[]> {
  return apiGet<DailyTotalData[]>(`/travels/${travelId}/expenses/daily-totals`);
}

export async function getCategoryTotals(
  travelId: number
): Promise<CategoryTotalData[]> {
  return apiGet<CategoryTotalData[]>(
    `/travels/${travelId}/expenses/category-totals`
  );
}

export async function getTotalExpenses(travelId: number): Promise<number> {
  const res = await apiGet<{ total_eur: number }>(
    `/travels/${travelId}/expenses/total`
  );
  return res.total_eur;
}

export async function insertExpense(
  travelId: number,
  expense: Omit<ExpenseData, "expense_id" | "travel_id">
): Promise<number> {
  const res = await apiPost<ExpenseData>(
    `/travels/${travelId}/expenses`,
    expense
  );
  return res.expense_id;
}

export async function updateExpense(
  travelId: number,
  expense: ExpenseData
): Promise<void> {
  const { expense_id, travel_id, ...data } = expense;
  await apiPut(`/travels/${travelId}/expenses/${expense_id}`, data);
}

export async function deleteExpense(
  travelId: number,
  expenseId: number
): Promise<void> {
  await apiDelete(`/travels/${travelId}/expenses/${expenseId}`);
}
