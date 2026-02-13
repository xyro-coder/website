'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const NAV = [
  { label: 'About', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Publications', href: '/publications' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(8,12,30,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : '1px solid transparent',
      }}
    >
      <nav className="container mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="group flex items-center gap-2">
            <span className="text-lg font-bold bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4, #a855f7)' }}>
              SY
            </span>
            <span className="hidden sm:block text-sm text-slate-500 font-mono group-hover:text-slate-400 transition-colors">
              / portfolio
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV.map(({ label, href }) => {
              const active = pathname === href
              return (
                <Link key={href} href={href}
                  className="relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg group"
                  style={{ color: active ? '#06b6d4' : '#94a3b8' }}>
                  <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ background: 'rgba(6,182,212,0.06)' }} />
                  <span className="relative">{label}</span>
                  {active && (
                    <span className="absolute bottom-0 left-4 right-4 h-px"
                      style={{ background: 'linear-gradient(90deg, #06b6d4, #a855f7)' }} />
                  )}
                </Link>
              )
            })}
            <a href="mailto:sulaymanyusuf.a@gmail.com"
              className="ml-4 px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200"
              style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#06b6d4' }}>
              Let&apos;s Talk
            </a>
          </div>

          <button onClick={() => setOpen(v => !v)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
            aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: open ? '300px' : '0',
          background: 'rgba(8,12,30,0.96)',
          backdropFilter: 'blur(20px)',
          borderTop: open ? '1px solid rgba(255,255,255,0.05)' : 'none',
        }}>
        <div className="px-6 py-4 flex flex-col gap-1">
          {NAV.map(({ label, href }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href}
                className="px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                style={{ color: active ? '#06b6d4' : '#94a3b8', background: active ? 'rgba(6,182,212,0.08)' : 'transparent' }}>
                {label}
              </Link>
            )
          })}
          <a href="mailto:sulaymanyusuf.a@gmail.com"
            className="mt-2 px-4 py-3 rounded-lg text-sm font-medium text-cyan-400 text-center"
            style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
            Let&apos;s Talk
          </a>
        </div>
      </div>
    </header>
  )
}
