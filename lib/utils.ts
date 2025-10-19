import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export function getMedalEmoji(medal: string) {
  switch (medal.toLowerCase()) {
    case 'gold':
      return '🥇'
    case 'silver':
      return '🥈'
    case 'bronze':
      return '🥉'
    default:
      return '🏅'
  }
}
