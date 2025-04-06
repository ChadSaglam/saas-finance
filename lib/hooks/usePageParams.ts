import { useParams } from "next/navigation";

export function usePageParams() {
  // Fallback for older Next.js versions (if needed)
  try {
    return useParams();
  } catch (error) {
    // Fallback logic (e.g., check for legacy props)
    // Note: This is unlikely necessary if using Next.js 13.4+
    return {};
  }
}