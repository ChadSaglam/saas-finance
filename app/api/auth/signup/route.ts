import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import User from '@/lib/models/User';
import { apiSuccess, apiError } from '@/lib/api/api-utils';
import { validateEmail, validatePassword, getClientIP } from '@/lib/auth/auth-validation';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const { name, email, password, confirmPassword } = await req.json();
    
    if (!name || !email || !password || !confirmPassword) {
      return apiError('All fields are required', 400);
    }
    
    if (!validateEmail(email)) {
      return apiError('Invalid email format', 400);
    }
    
    if (!validatePassword(password)) {
      return apiError('Password must be at least 8 characters and include uppercase, lowercase, and numbers', 400);
    }
    
    if (password !== confirmPassword) {
      return apiError('Passwords do not match', 400);
    }
    
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return apiError('User already exists with this email', 409);
    }
    
    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password,
      twoFactorEnabled: true,
      twoFactorVerified: false,
      lastLoginIp: getClientIP(req.headers)
    });
    
    // Save user to database
    await newUser.save();
    
    // Return success response
    const userObj = newUser.toObject();
    const { password: _, ...userWithoutPassword } = userObj;
    
    return apiSuccess(
      { user: userWithoutPassword },
      'User created successfully',
      201
    );
    
  } catch (error: any) {
    console.error('Signup error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongoServerError') {
      if (error.code === 8000) {
        return apiError('Database connection error', 500);
      } else if (error.code === 11000) {
        return apiError('Email already in use', 409);
      }
    }
    
    return apiError('Registration failed', 500);
  }
}