import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function sortByDate<T extends { date: string }>(items: T[]): T[] {
  return items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
