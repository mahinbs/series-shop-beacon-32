import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Removes volume information from book titles
 * Examples:
 * - "Test Book 1, Vol.1" -> "Test Book 1"
 * - "Test Book 1, Vol 1" -> "Test Book 1"
 * - "Test Book 1, VOLUME 1" -> "Test Book 1"
 * - "Test Book 1" -> "Test Book 1" (no change)
 */
export function removeVolumeFromTitle(title: string): string {
  if (!title) return title;
  
  // Remove patterns like ", Vol.1", ", Vol 1", ", VOLUME 1", etc.
  return title.replace(/,\s*(VOL\.?\s*\d+|VOLUME\s*\d+)/i, '');
}
