import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatETB(amount: number): string {
  if (Number.isNaN(amount)) return "ETB 0"

  return new Intl.NumberFormat("en-ET", {
    style: "currency",
    currency: "ETB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatDuration(value: number): string {
  if (Number.isNaN(value) || value < 0) return "0:00"

  // decimal → minutes (e.g. 0.3 = 30 minutes)
  if (value < 1) {
    const minutes = Math.round(value * 100)
    return `${minutes}:00`
  }

  // whole number → hours (e.g. 3 = 3 hours)
  const hours = Math.floor(value)
  return `${hours}:00`
}

export function truncateText(text: string, maxLength = 20): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

