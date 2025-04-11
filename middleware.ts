import { NextRequest, NextResponse } from 'next/server';

// API request count for rate limiting
const apiLimiter = new Map<string, { count: number, timestamp: number }>();

// Clean old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of apiLimiter.entries()) {
    if (now - value.timestamp > 10 * 60 * 1000) {
      apiLimiter.delete(key);
    }
  }
}, 10 * 60 * 1000);

export default function middleware(req: NextRequest) {
  const response = NextResponse.next();
  
  // Add security headers
  const headers = response.headers;
  
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'same-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // Basic rate limiting for auth endpoints
  if (req.nextUrl.pathname.startsWith('/api/auth/')) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const key = `${ip}:${req.nextUrl.pathname}`;
    
    const now = Date.now();
    const windowMs = 5 * 60 * 1000; // 5 minutes
    const maxRequests = 100; // Max 100 requests per 5 minutes
    
    const limiter = apiLimiter.get(key) || { count: 0, timestamp: now };
    
    // Reset if outside window
    if (now - limiter.timestamp > windowMs) {
      limiter.count = 0;
      limiter.timestamp = now;
    }
    
    limiter.count++;
    apiLimiter.set(key, limiter);
    
    // Set rate limit headers
    headers.set('X-RateLimit-Limit', maxRequests.toString());
    headers.set('X-RateLimit-Remaining', Math.max(0, maxRequests - limiter.count).toString());
    
    if (limiter.count > maxRequests) {
      return new NextResponse(
        JSON.stringify({
          success: false,
          message: 'Too many requests, please try again later'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '300'
          }
        }
      );
    }
  }
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};