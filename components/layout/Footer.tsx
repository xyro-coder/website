'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const SOCIALS = [
  { label: 'GitHub', coord: '(0.1, 0.9)', href: 'https://github.com/xyro-coder' },
  { label: 'LinkedIn', coord: '(0.6, 0.3)', href: 'https://www.linkedin.com/in/sulayman-yusuf-a84940214/' },
  { label: 'Email', coord: '(0.9, 0.7)', href: 'mailto:sulaymanyusuf.a@gmail.com' },
]

function SystemStatus() {
  const [latency, setLatency] = useState(24)
  useEffect(() => {
    const id = setInterval(() => setLatency(Math.floor(18 + Math.random() * 14)), 3000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-slate-700">
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
      <span>
        Latency:&nbsp;<span className="text-cyan-800">{latency}ms</span>
        &nbsp;·&nbsp;Basis:&nbsp;<span className="text-purple-900">SO(3)</span>
        &nbsp;·&nbsp;Status:&nbsp;<span className="text-cyan-800">Optimized</span>
      </span>
    </div>
  )
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden"
      style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>

      {/* Radial glow — mirrors hero cyan accent */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 20% 110%, rgba(6,182,212,0.04) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 80% 120%, rgba(168,85,247,0.03) 0%, transparent 70%)',
        }} />

      <div className="relative container mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">

          {/* Brand */}
          <div>
            <motion.span
              className="text-lg font-bold bg-clip-text text-transparent block mb-1"
              style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4, #a855f7)' }}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              Sulayman Yusuf
            </motion.span>
            <p className="text-xs text-slate-700 font-mono">
              CS Researcher · ML Engineer · UW Allen School
            </p>
          </div>

          {/* Nav links */}
          <div className="flex gap-6 text-xs text-slate-600 font-mono uppercase tracking-widest">
            {['/about', '/publications', '/contact'].map(href => (
              <Link key={href} href={href}
                className="hover:text-cyan-500 transition-colors duration-300">
                {href.replace('/', '')}
              </Link>
            ))}
          </div>

          {/* Coordinate socials */}
          <div className="flex gap-4">
            {SOCIALS.map(({ label, coord, href }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="group flex flex-col items-center"
                whileHover="hovered"
                initial="idle"
              >
                <motion.span
                  className="text-xs font-mono text-slate-700 group-hover:text-cyan-500 transition-colors duration-300 overflow-hidden whitespace-nowrap"
                  variants={{
                    idle: { width: 'auto', opacity: 1 },
                    hovered: { width: 'auto', opacity: 1 },
                  }}
                >
                  <motion.span
                    variants={{
                      idle: { opacity: 1 },
                      hovered: { opacity: 0, position: 'absolute' as const },
                    }}
                    transition={{ duration: 0.15 }}
                    className="inline-block"
                  >
                    {coord}
                  </motion.span>
                  <motion.span
                    variants={{
                      idle: { opacity: 0, x: -4 },
                      hovered: { opacity: 1, x: 0 },
                    }}
                    transition={{ duration: 0.2 }}
                    className="inline-block text-cyan-500"
                  >
                    {label}
                  </motion.span>
                </motion.span>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
          <p className="text-xs text-slate-700 font-mono">
            © {new Date().getFullYear()} Sulayman Yusuf
          </p>
          <SystemStatus />
          <p className="text-xs text-slate-800 font-mono">
            Built with geometric precision
          </p>
        </div>
      </div>
    </footer>
  )
}
