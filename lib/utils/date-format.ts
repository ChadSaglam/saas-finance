// Create a utility file for date formatting
export function formatDate(date: Date): string {
    // Format as YYYY-MM-DD which is consistent across environments
    return date.toISOString().split('T')[0];
  }
  
  // Format for display with consistent output regardless of locale
  export function formatDisplayDate(date: Date): string {
    // Use a specific format that will be consistent between server and client
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
  }