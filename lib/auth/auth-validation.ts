/**
 * Validate email format
 * @param email Email to validate
 */
export function validateEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  /**
   * Validate password strength
   * @param password Password to validate
   */
  export function validatePassword(password: string): boolean {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[0-9]/.test(password)
    );
  }
  
  /**
   * Get client IP from request headers
   * @param headers Request headers
   */
  export function getClientIP(headers: Headers): string {
    return headers.get('x-forwarded-for')?.split(',')[0] || 
           headers.get('x-real-ip') || 
           '';
  }