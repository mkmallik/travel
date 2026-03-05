import type { ExpenseCategory, TotalCategory } from '../types/database';

export const EXPENSE_CATEGORIES: { label: string; value: ExpenseCategory }[] = [
  { label: 'Food', value: 'food' },
  { label: 'Transportation', value: 'transportation' },
  { label: 'Activities', value: 'activities' },
  { label: 'Gifts / Purchase', value: 'gifts/purchase' },
];

export const TOTAL_CATEGORIES: { label: string; value: TotalCategory }[] = [
  { label: 'Flights', value: 'flights' },
  { label: 'Visa Fee', value: 'visa_fee' },
  { label: 'Cancellation', value: 'cancellation' },
  { label: 'Hotels', value: 'hotels' },
  { label: 'Ferries', value: 'ferries' },
  { label: 'Activities', value: 'activities' },
  { label: 'Trains', value: 'trains' },
  { label: 'Cabs', value: 'cabs' },
  { label: 'Food', value: 'food' },
  { label: 'Others', value: 'others' },
];

export const TRANSPORT_MODES = [
  'Flight',
  'Train',
  'Bus',
  'Ferry',
  'Car',
  'Taxi',
  'Walk',
  'Other',
] as const;

export function getCategoryLabel(value: string): string {
  const all = [...EXPENSE_CATEGORIES, ...TOTAL_CATEGORIES];
  return all.find((c) => c.value === value)?.label ?? value;
}

export function getCategoryIcon(value: string): string {
  const icons: Record<string, string> = {
    food: 'food',
    transportation: 'car',
    activities: 'hiking',
    'gifts/purchase': 'gift',
    flights: 'airplane',
    visa_fee: 'passport',
    cancellation: 'cancel',
    hotels: 'bed',
    ferries: 'ferry',
    trains: 'train',
    cabs: 'taxi',
    others: 'dots-horizontal',
  };
  return icons[value] ?? 'help-circle';
}
