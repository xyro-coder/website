'use client'

import { useState, useEffect } from 'react'

export default function Footer() {
  const [ms, setMs]         = useState(22)
  const [stable, setStable] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setMs(Math.floor(14 + Math.random() * 18))
      // Very rarely flickers to PROCESSING — feels like a real system telemetry
      setStable(Math.random() > 0.06)
    }, 3200)
    return () => clearInterval(id)
  }, [])

  const telemetry = [
    'SY_SYS',
    'KERNEL: 0.8.2',
    stable ? 'STABLE' : 'PROCESSING',
    `${ms}MS`,
  ].join(' // ')

  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
      <div className="container mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">

        <p className="font-mono text-[10px] text-slate-700 whitespace-nowrap select-none">
          {telemetry}
        </p>

        <div className="flex gap-5 font-mono text-[10px]">
          {[
            { label: 'GH',   href: 'https://github.com/xyro-coder' },
            { label: 'LI',   href: 'https://www.linkedin.com/in/sulayman-yusuf-a84940214/' },
            { label: 'MAIL', href: 'mailto:sulaymanyusuf.a@gmail.com' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel="noopener noreferrer"
              className="text-slate-800 hover:text-slate-500 transition-colors duration-150"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
