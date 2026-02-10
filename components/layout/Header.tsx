'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'About', href: '/about' },
  { name: 'Projects', href: '/projects' },
  { name: 'Publications', href: '/publications' },
  { name: 'Blog', href: '/blog' },
  { name: 'Contact', href: '/contact' },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-text-muted-light/20 dark:border-text-muted/20 bg-white/80 dark:bg-navy-dark/80 backdrop-blur-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl font-bold text-text-dark dark:text-text-light hover:text-cyan-accent-light dark:hover:text-cyan-accent transition-colors"
          >
            <span className="bg-gradient-to-r from-cyan-accent-light to-purple-accent-light dark:from-cyan-accent dark:to-purple-accent bg-clip-text text-transparent">
              SY
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-cyan-accent-light dark:text-cyan-accent bg-light-surface dark:bg-navy-surface'
                    : 'text-text-muted-light dark:text-text-muted hover:text-text-dark dark:hover:text-text-light hover:bg-light-surface dark:hover:bg-navy-surface'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Theme Toggle & Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-light-surface dark:hover:bg-navy-surface transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-text-muted-light/20 dark:border-text-muted/20">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'text-cyan-accent-light dark:text-cyan-accent bg-light-surface dark:bg-navy-surface'
                      : 'text-text-muted-light dark:text-text-muted hover:text-text-dark dark:hover:text-text-light hover:bg-light-surface dark:hover:bg-navy-surface'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
