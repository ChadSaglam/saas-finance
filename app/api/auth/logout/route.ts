import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    // MUST await cookies()
    const cookieStore = await cookies();
    
    // Clear auth token cookie
    cookieStore.set({
      name: 'auth_token',
      value: '',
      expires: new Date(0)
    });
    
    // Clear verification code cookie if exists
    cookieStore.set({
      name: 'verification_code',
      value: '',
      expires: new Date(0)
    });
    
    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}