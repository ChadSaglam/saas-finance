import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { getUserIdFromRequest } from '@/lib/auth/auth-utils';
import { apiSuccess, apiError } from '@/lib/api/api-utils';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const { code } = await req.json();
    
    // Get the stored verification code
    const cookieStore = await cookies();
    const storedCode = cookieStore.get('verification_code')?.value;
    
    // Validate code existence
    if (!code) {
      return apiError('Verification code is required', 400);
    }
    
    if (!storedCode) {
      return apiError('Verification code expired or not found', 400);
    }
    
    // Check if code matches (time-safe comparison would be even better)
    if (code !== storedCode) {
      return apiError('Invalid verification code', 401);
    }
    
    // Get user ID from the token
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return apiError('User authentication required', 401);
    }
    
    // Update user's 2FA verification status
    const user = await User.findById(userId);
    if (!user) {
      return apiError('User not found', 404);
    }
    
    user.twoFactorVerified = true;
    await user.save();
    
    // Clear the verification code cookie
    cookieStore.set({
      name: 'verification_code',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      expires: new Date(0)
    });
    
    return apiSuccess({
      isTwoFactorVerified: true,
      needsVerification: false
    }, 'Verification successful');
    
  } catch (error) {
    console.error('2FA verification error:', error);
    return apiError('Verification failed', 500);
  }
}