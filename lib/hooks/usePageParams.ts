import { useParams } from 'next/navigation';

/**
 * Custom hook to access URL parameters with proper TypeScript typing
 * @returns The URL parameters object
 */
export function usePageParams<T extends Record<string, string> = Record<string, string>>(): T {
  // Using Next.js's useParams hook to get URL params
  const params = useParams() as T;
  return params;
}