export const CURRENCY_CODES = [
  'USD', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'SEK', 'NOK', 'DKK',
  'PLN', 'CZK', 'HUF', 'HRK', 'RON', 'BGN', 'TRY', 'RUB',
  'INR', 'CNY', 'THB', 'MYR', 'SGD', 'KRW', 'TWD', 'PHP',
  'IDR', 'VND', 'AED', 'SAR', 'EGP', 'ZAR', 'BRL', 'MXN',
  'ARS', 'CLP', 'COP', 'PEN', 'MAD', 'ISK', 'NZD', 'ILS',
] as const;

export function formatEUR(amount: number): string {
  return `€${amount.toFixed(2)}`;
}

export function formatLocal(amount: number, code: string): string {
  return `${amount.toFixed(2)} ${code}`;
}

export function formatCurrency(
  amountEur: number,
  amountLocal?: number | null,
  localCode?: string | null
): string {
  const eur = formatEUR(amountEur);
  if (amountLocal != null && localCode) {
    return `${eur} (${formatLocal(amountLocal, localCode)})`;
  }
  return eur;
}
