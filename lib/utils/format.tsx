/**
 * Format a number as currency
 * @param amount The amount to format
 * @param currency The currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2
  }).format(amount);
}

/**
 * Format a number with commas for thousands
 * @param num The number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Format a percentage
 * @param value The value to format as percentage
 * @param decimalPlaces Number of decimal places (default: 2)
 * @returns Formatted percentage string
 */
export function formatPercent(value: number, decimalPlaces: number = 2): string {
  return `${(value * 100).toFixed(decimalPlaces)}%`;
}