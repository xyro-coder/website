'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const NAV = [
  { label: 'About', href: '/about' },
  { label: 'Publications', href: '/publications' },
  { label: 'Contact', href: '/contact' },
]

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeRect, setActiveRect] = useState<{ left: number; width: number } | null>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [pathname])

  // Track the bounding rect of the active nav link for the spring indicator
  useEffect(() => {
    const el = linkRefs.current.get(pathname)
    if (el && navRef.current) {
      const navBounds = navRef.current.getBoundingClientRect()
      const linkBounds = el.getBoundingClientRect()
      setActiveRect({ left: linkBounds.left - navBounds.left, width: linkBounds.width })
    } else {
      setActiveRect(null)
    }
  }, [pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-500">
      {/* Main bar */}
      <div
        className="transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(8,12,30,0.75)' : 'transparent',
          backdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(24px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.04)' : '1px solid transparent',
        }}
      >
        <nav className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2">
              <motion.span
                className="text-lg font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4, #a855f7)' }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                SY
              </motion.span>
              <span className="hidden sm:block text-sm text-slate-600 font-mono group-hover:text-slate-400 transition-colors duration-300">
                / portfolio
              </span>
            </Link>

            {/* Desktop nav */}
            <div ref={navRef} className="hidden md:flex items-center gap-1 relative">
              {/* Spring-animated glowing vertex (active pill) */}
              {activeRect && (
                <motion.span
                  className="absolute top-0 bottom-0 rounded-lg pointer-events-none"
                  initial={false}
                  animate={{ left: activeRect.left, width: activeRect.width }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35, mass: 0.7 }}
                  style={{
                    background: 'rgba(6,182,212,0.08)',
                    border: '1px solid rgba(6,182,212,0.18)',
                    boxShadow: '0 0 16px rgba(6,182,212,0.12)',
                  }}
                />
              )}

              {NAV.map(({ label, href }) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    ref={el => { if (el) linkRefs.current.set(href, el) }}
                    className="relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg z-10"
                    style={{ color: active ? '#06b6d4' : '#64748b' }}
                  >
                    {label}
                  </Link>
                )
              })}

              <motion.a
                href="mailto:sulaymanyusuf.a@gmail.com"
                className="relative ml-3 px-4 py-1.5 text-sm font-medium rounded-full overflow-hidden z-10"
                style={{
                  background: 'rgba(6,182,212,0.06)',
                  border: '1px solid rgba(6,182,212,0.25)',
                  color: '#06b6d4',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <span className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
                  style={{ background: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.15), transparent 70%)' }} />
                <span className="relative font-mono tracking-wide text-xs uppercase">Let&apos;s Talk</span>
              </motion.a>
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen(v => !v)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? 'x' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 38 }}
            className="md:hidden overflow-hidden"
            style={{
              background: 'rgba(8,12,30,0.96)',
              backdropFilter: 'blur(24px)',
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV.map(({ label, href }, i) => {
                const active = pathname === href
                return (
                  <motion.div
                    key={href}
                    initial={{ x: -16, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05, type: 'spring', stiffness: 400, damping: 30 }}
                  >
                    <Link
                      href={href}
                      className="block px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                      style={{
                        color: active ? '#06b6d4' : '#94a3b8',
                        background: active ? 'rgba(6,182,212,0.08)' : 'transparent',
                      }}
                    >
                      {label}
                    </Link>
                  </motion.div>
                )
              })}
              <motion.a
                href="mailto:sulaymanyusuf.a@gmail.com"
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: NAV.length * 0.05, type: 'spring', stiffness: 400, damping: 30 }}
                className="mt-2 px-4 py-3 rounded-lg text-sm font-medium text-cyan-400 text-center font-mono tracking-wide uppercase text-xs"
                style={{ background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}
              >
                Let&apos;s Talk
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
