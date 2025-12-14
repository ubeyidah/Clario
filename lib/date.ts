
export function timeAgo(dateString: string | Date): string {
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return "Invalid date"

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  if (seconds < 5) return "just now"

  const intervals: [number, string][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.345, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ]

  let count = seconds
  let unit = "second"

  for (const [limit, name] of intervals) {
    if (count < limit) {
      unit = name
      break
    }
    count /= limit
  }

  const value = Math.floor(count)
  return `${value} ${unit}${value > 1 ? "s" : ""} ago`
}
