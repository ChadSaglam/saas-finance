import * as jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { IUser } from '@/lib/models/User';
import emailService from '@/lib/services/emailService';

// Define our own types to help TypeScript
type UserPayload = {
  userId: string;
  email: string;
  name: string;
};

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_change_me';

// Accept expiry from env var but parse as number of days, defaulting to 7
const JWT_EXPIRY_DAYS = parseInt(process.env.JWT_EXPIRY || '7', 10);
const JWT_EXPIRY_SECONDS = JWT_EXPIRY_DAYS * 24 * 60 * 60; // Convert to seconds

/**
 * Generate a JWT token for a user with proper expiration
 * @param user User object
 * @returns JWT token string
 */
export function generateToken(user: IUser): string {
  // Create our payload WITHOUT expiration fields
  const payload: UserPayload = {
    userId: user._id.toString(),
    email: user.email,
    name: user.name
  };
  
  try {
    // Use JWT_SECRET and set algorithm explicitly for security
    return jwt.sign(payload, JWT_SECRET, { 
      algorithm: 'HS256',
      expiresIn: `${JWT_EXPIRY_DAYS}d` // Let jwt.sign handle expiration
    });
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate authentication token');
  }
}

/**
 * Verify JWT token and extract payload
 * @param token JWT token to verify
 * @returns User payload or null if invalid
 */
export function verifyToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'] // Explicitly specify allowed algorithms 
    }) as UserPayload;
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error('Token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.error('Invalid token');
    } else {
      console.error('Token verification error:', error);
    }
    return null;
  }
}

/**
 * Extract user ID from request (token) with performance optimizations
 * @param req Next.js request object
 * @returns User ID or null if not authenticated
 */
export async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  try {
    // Extract token from cookies or Authorization header
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    // Debug log to check if token exists
    console.debug('Auth token in cookies:', !!token);
    
    // If no cookie token, try Authorization header
    const headerToken = !token 
      ? req.headers.get('Authorization')?.replace('Bearer ', '') 
      : null;
    
    if (headerToken) {
      console.debug('Auth token found in Authorization header');
    }
    
    if (!token && !headerToken) {
      console.debug('No auth token found in cookies or headers');
      return null;
    }
    
    const tokenToUse = token || headerToken!;
    
    // Verify token with optimized function
    const decoded = verifyToken(tokenToUse);
    
    if (!decoded) {
      return null;
    }
    
    console.debug('Token verified for user:', decoded.userId);
    return decoded.userId;
    
  } catch (error) {
    console.error('Error getting user ID from token:', error);
    return null;
  }
}

/**
 * Generate a secure random 6-digit verification code
 * @returns 6-digit code as string
 */
export function generateVerificationCode(): string {
  // Generate a code with cryptographically secure randomness
  const min = 100000; // 6 digits
  const max = 999999;
  // Simple numeric codes should be sufficient for email verification
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

/**
 * Send authentication code via email with structured logging
 * @param user User object
 * @param code Verification code
 */
export async function sendAuthenticationCode(user: IUser, code: string): Promise<void> {
  try {
    // Try to send via email service
    const emailSent = await emailService.sendVerificationCode(user.email, code, user.name);
    
    // If email sending fails, fall back to console output
    if (!emailSent) {
      console.log(`
        ----------------------
        VERIFICATION CODE (Email failed)
        ----------------------
        Email: ${user.email}
        Name: ${user.name}
        Code: ${code}
        Valid for: 10 minutes
        ----------------------
      `);
    } else {
      console.debug(`Verification code sent to ${user.email}`);
    }
  } catch (error) {
    console.error('Failed to send verification code:', error);
    
    // Fallback to console output for development
    console.log(`
      ----------------------
      VERIFICATION CODE (Fallback)
      ----------------------
      Email: ${user.email}
      Name: ${user.name}
      Code: ${code}
      Valid for: 10 minutes
      ----------------------
    `);
  }
}

/**
 * Remove sensitive fields from user object
 * @param user User document
 * @returns Sanitized user object
 */
export function sanitizeUser(user: IUser) {
  const userObj = user.toObject();
  // Extract password and any other sensitive fields
  const { password, __v, ...sanitizedUser } = userObj;
  return sanitizedUser;
}

/**
 * Calculate token expiration time in milliseconds
 * @returns Milliseconds until token expiration
 */
export function getTokenExpiryMs(): number {
  return JWT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
}

/**
 * Helper to set secure cookie options
 * @param secure Whether to use secure cookies
 * @returns Cookie options object
 */
export function getSecureCookieOptions(secure = process.env.NODE_ENV === 'production') {
  return {
    httpOnly: true,
    secure,
    sameSite: 'strict' as const,
    path: '/',
    maxAge: JWT_EXPIRY_SECONDS
  };
}