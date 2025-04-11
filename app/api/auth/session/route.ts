import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { getUserIdFromRequest, sanitizeUser } from '@/lib/auth/auth-utils';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get user ID from the token
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        message: 'Not authenticated'
      }, { status: 401 });
    }
    
    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        authenticated: false,
        message: 'User not found'
      }, { status: 404 });
    }
    
    // Return user data without sensitive fields
    return NextResponse.json({
      success: true,
      authenticated: true,
      user: sanitizeUser(user),
      needsVerification: user.twoFactorEnabled && !user.twoFactorVerified,
      isTwoFactorVerified: !user.twoFactorEnabled || user.twoFactorVerified
    });
    
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json({
      success: false,
      authenticated: false,
      message: 'Server error'
    }, { status: 500 });
  }
}