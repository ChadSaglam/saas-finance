import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { 
  generateToken, 
  generateVerificationCode, 
  sendAuthenticationCode,
  sanitizeUser
} from '@/lib/auth/auth-utils';
import { apiSuccess, apiError } from '@/lib/api/api-utils';
import { validateEmail, getClientIP } from '@/lib/auth/auth-validation';


export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    // Parse and validate request body
    const body = await req.json();
    const { email, password } = body;

    // Input validation
    if (!email || !password) {
      return apiError('Email and password are required', 400);
    }
    
    if (!validateEmail(email)) {
      return apiError('Invalid email format', 400);
    }

    // Find user by email (case insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });

    // Secure credential checking
    if (!user || !(await user.comparePassword(password))) {
      return apiError('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = generateToken(user);

    // Set authentication cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    // Handle two-factor authentication if enabled
    if (user.twoFactorEnabled) {
      const verificationCode = generateVerificationCode();
      
      // Store code in HTTP-only cookie
      cookieStore.set({
        name: 'verification_code',
        value: verificationCode,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 10 * 60 // 10 minutes
      });

      // Send verification code via email with fallback
      await sendAuthenticationCode(user, verificationCode);
      
      // Update last login IP
      user.lastLoginIp = getClientIP(req.headers);
      await user.save();

      return apiSuccess(
        {
          user: sanitizeUser(user),
          needsVerification: true,
          isTwoFactorVerified: false
        },
        'Verification code sent'
      );
    }

    // Success response if 2FA not required
    return apiSuccess(
      {
        user: sanitizeUser(user),
        needsVerification: false,
        isTwoFactorVerified: true
      },
      'Login successful'
    );
    
  } catch (error) {
    console.error('Login error:', error);
    return apiError('Authentication failed', 500);
  }
}