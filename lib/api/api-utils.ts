import { NextResponse } from 'next/server';

/**
 * Standard API response types
 */
export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};

/**
 * Create a successful API response
 * @param data Response data
 * @param message Success message
 * @param status HTTP status code
 */
export function apiSuccess<T>(data: T, message = 'Success', status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data
    },
    { status }
  );
}

/**
 * Create an error API response
 * @param message Error message
 * @param status HTTP status code
 */
export function apiError(message: string, status = 400): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message
    },
    { status }
  );
}