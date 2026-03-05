import dayjs from 'dayjs';

export function formatDate(date: string): string {
  return dayjs(date).format('ddd, D MMM YYYY');
}

export function formatShortDate(date: string): string {
  return dayjs(date).format('D MMM');
}

export function toISODate(date: Date | string): string {
  return dayjs(date).format('YYYY-MM-DD');
}

export function getDaysBetween(start: string, end: string): string[] {
  const days: string[] = [];
  let current = dayjs(start);
  const last = dayjs(end);
  while (current.isBefore(last) || current.isSame(last, 'day')) {
    days.push(current.format('YYYY-MM-DD'));
    current = current.add(1, 'day');
  }
  return days;
}

export function isToday(date: string): boolean {
  return dayjs(date).isSame(dayjs(), 'day');
}
