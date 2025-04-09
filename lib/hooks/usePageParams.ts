import { useParams } from 'next/navigation';

export function usePageParams<T extends Record<string, string> = Record<string, string>>(): T {
  // Using Next.js's useParams hook to get URL params
  const params = useParams() as T;
  return params;
}