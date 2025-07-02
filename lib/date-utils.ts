// Simple date utility functions to replace date-fns
export function format(date: Date, formatStr: string): string {
  const options: Intl.DateTimeFormatOptions = {}

  switch (formatStr) {
    case "PPP":
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    case "yyyy-MM-dd":
      return date.toISOString().split("T")[0]
    case "MM/dd/yyyy":
      return date.toLocaleDateString("en-US")
    default:
      return date.toLocaleDateString()
  }
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export function subDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

export function isAfter(date: Date, dateToCompare: Date): boolean {
  return date.getTime() > dateToCompare.getTime()
}

export function isBefore(date: Date, dateToCompare: Date): boolean {
  return date.getTime() < dateToCompare.getTime()
}

export function startOfDay(date: Date): Date {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}
