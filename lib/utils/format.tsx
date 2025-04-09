/**
 * format.ts - Consolidated formatting utilities
 * 
 * Contains all formatting functions for:
 * - Dates and times
 * - Numbers and currencies
 * - Percentages
 * 
 * Organized in sections for better maintainability
 */

// ========================================
// DATE & TIME FORMATTING
// ========================================

/**
 * Format date relative to now (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  
  // Calculate time difference in minutes
  const diffInMinutes = Math.floor((now.getTime() - dateObj.getTime()) / (60 * 1000));
  
  if (diffInMinutes < 1) {
    return "Just now";
  }
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
}

/**
 * Format a date for display in the UI
 * @param date Date to format
 * @returns Formatted date string (e.g., "Apr 7, 2025")
 */
export function formatDisplayDate(date: Date | string): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format a date for input fields
 * @param date Date to format
 * @returns Date in YYYY-MM-DD format
 */
export function formatInputDate(date: Date | string): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toISOString().split('T')[0];
}

/**
 * Calculate days difference between two dates
 * @param date1 First date
 * @param date2 Second date
 * @returns Number of days difference (positive if date2 is after date1)
 */
export function daysDifference(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  const diffTime = d2.getTime() - d1.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  return diffDays;
}

/**
 * Add days to a date
 * @param date Starting date
 * @param days Number of days to add
 * @returns New date with days added
 */
export function addDays(date: Date | string, days: number): Date {
  const result = typeof date === 'string' ? new Date(date) : new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Format date and time
 * @param date Date to format
 * @returns Formatted date and time string (e.g., "Apr 7, 2025, 9:18 AM")
 */
export function formatDateTime(date: Date | string): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
}

/**
 * Format date to UTC in the project's standard format (YYYY-MM-DD HH:MM:SS)
 */
export function formatDateTimeUTC(date: Date | string | null): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  
  // Format to YYYY-MM-DD HH:MM:SS
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const hours = String(d.getUTCHours()).padStart(2, '0');
  const minutes = String(d.getUTCMinutes()).padStart(2, '0');
  const seconds = String(d.getUTCSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * Get current date/time in UTC format - SSR SAFE VERSION
 * Only calls this on the client side to prevent hydration errors
 */
export function getCurrentDateTimeUTC(): string {
  // Skip during SSR to prevent hydration mismatches
  if (typeof window === 'undefined') {
    return '';
  }
  
  return formatDateTimeUTC(new Date());
}

// ========================================
// NUMBER & CURRENCY FORMATTING
// ========================================

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