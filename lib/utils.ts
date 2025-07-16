import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFaviconFromUrl(pageUrl: string) {
  try {
    const url = new URL(pageUrl);
    return `${url.origin}/favicon.ico`;
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
