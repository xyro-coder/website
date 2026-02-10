'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-light-surface dark:hover:bg-navy-surface transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-text-light" />
      ) : (
        <Moon className="h-5 w-5 text-text-dark" />
      )}
    </button>
  )
}
