import { cn } from "@/lib/utils"
import { CourseStatus } from "./generated/prisma/enums"

type BadgeVariant =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral"

export function badgeClasses(
  variant: BadgeVariant = "neutral",
  className?: string
) {
  const base =
    "text-xs uppercase px-2 py-1 rounded-md font-medium"

  const variants: Record<BadgeVariant, string> = {
    success: "text-green-600 bg-green-800/20",
    warning: "text-yellow-600 bg-yellow-800/20",
    error: "text-red-600 bg-red-800/20",
    info: "text-blue-600 bg-blue-800/20",
    neutral: "text-zinc-600 bg-zinc-800/20",
  }

  return cn(base, variants[variant], className)
}




export function courseStatusToVariant(
  status: CourseStatus
): BadgeVariant {
  const map: Record<CourseStatus, BadgeVariant> = {
    Draft: "info",
    Published: "success",
    Archived: "warning",
  }

  return map[status]
}

