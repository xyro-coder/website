'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface SleekButtonProps {
  children: ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'ghost'
  className?: string
  target?: string
  rel?: string
  download?: boolean | string
}

export default function SleekButton({ children, href, onClick, variant = 'ghost', className = '', target, rel, download }: SleekButtonProps) {
  const base = (
    <motion.span
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      className={`group relative inline-flex items-center gap-2 px-5 py-2.5 overflow-hidden ${className}`}
      style={{
        background: variant === 'primary'
          ? 'linear-gradient(135deg, rgba(6,182,212,0.12), rgba(168,85,247,0.12))'
          : 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(8px)',
        borderRadius: 10,
      }}
    >
      {/* Perimeter trace on hover */}
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[10px]"
        style={{ border: '1px solid rgba(6,182,212,0.45)', pointerEvents: 'none' }}
      />
      {/* Inner glow */}
      <span
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(6,182,212,0.07), transparent)',
          pointerEvents: 'none',
        }}
      />
      <span className="relative z-10 font-mono tracking-widest uppercase text-xs text-slate-300 group-hover:text-white transition-colors duration-300 flex items-center gap-2">
        {children}
      </span>
    </motion.span>
  )

  if (href) {
    return (
      <a href={href} target={target} rel={rel} download={download}>
        {base}
      </a>
    )
  }

  return (
    <button onClick={onClick} type="button">
      {base}
    </button>
  )
}
