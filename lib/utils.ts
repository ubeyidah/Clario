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

  // Convert to minutes, then format as H:MM
  const totalMinutes = value < 1 ? Math.round(value * 100) : value * 60
  const hours = Math.floor(totalMinutes / 60)
  const minutes = Math.round(totalMinutes % 60)
  return `${hours}:${minutes.toString().padStart(2, '0')}:00`
}

export function truncateText(text: string, maxLength = 20): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + "..."
}

