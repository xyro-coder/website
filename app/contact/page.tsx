'use client'

import { Github, Linkedin, Mail, MapPin, ArrowUpRight, Download } from 'lucide-react'
import SleekButton from '@/components/ui/SleekButton'
import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'

// Subtle ambient canvas — particles converge toward a focal point
function AmbientField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize()
    window.addEventListener('resize', resize)

    const N = 50
    const pts = Array.from({ length: N }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0008,
      vy: (Math.random() - 0.5) * 0.0008,
      phase: Math.random() * Math.PI * 2,
    }))

    let t = 0; let raf: number

    const animate = () => {
      t += 0.006
      const W = canvas.width; const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // Focal point (center-right, upper third)
      const fx = 0.7; const fy = 0.35

      pts.forEach(p => {
        // Gentle pull toward focal
        const dx = fx - p.x; const dy = fy - p.y
        p.vx += dx * 0.00003; p.vy += dy * 0.00003
        p.vx += Math.sin(t + p.phase) * 0.00002
        p.vy += Math.cos(t * 0.7 + p.phase) * 0.00002
        p.vx *= 0.995; p.vy *= 0.995
        p.x += p.vx; p.y += p.vy

        // Wrap
        if (p.x < -0.05) p.x = 1.05
        if (p.x > 1.05) p.x = -0.05
        if (p.y < -0.05) p.y = 1.05
        if (p.y > 1.05) p.y = -0.05

        const sx = p.x * W; const sy = p.y * H
        const pulse = 0.3 + Math.sin(t * 2 + p.phase) * 0.15

        ctx.beginPath()
        ctx.arc(sx, sy, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(6,182,212,${pulse})`
        ctx.fill()
      })

      // Draw faint connections between nearby particles
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = (pts[i].x - pts[j].x) * W
          const dy = (pts[i].y - pts[j].y) * H
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 100) {
            ctx.beginPath()
            ctx.moveTo(pts[i].x * W, pts[i].y * H)
            ctx.lineTo(pts[j].x * W, pts[j].y * H)
            ctx.strokeStyle = `rgba(6,182,212,${0.06 * (1 - d / 100)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
}

function TiltCard({ children, className = '', style = {} }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties
}) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg)`
  }
  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = 'perspective(800px) rotateX(0) rotateY(0)'
  }
  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`transition-transform duration-200 ${className}`}
      style={{ transformStyle: 'preserve-3d', willChange: 'transform', ...style }}
    >
      {children}
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

export default function ContactPage() {
  return (
    <div className="relative bg-[#080c1e] min-h-screen pt-16 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <AmbientField />

      <div className="relative z-10 container mx-auto max-w-4xl py-16">

        {/* Header */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-xs uppercase tracking-[0.35em] text-slate-700 mb-4 font-mono">
            Open to collaboration
          </p>
          <h1 className="text-6xl md:text-8xl font-bold text-white leading-none mb-6" style={{ letterSpacing: '-0.035em' }}>
            Let&apos;s build<br />
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)' }}>
              something
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl leading-relaxed">
            Interested in geometric deep learning research, ML engineering,
            or just want to talk math? My inbox is open.
          </p>
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <a href="mailto:sulaymanyusuf.a@gmail.com" className="block">
            <TiltCard
              className="group cursor-pointer mb-5"
              style={{
                background: 'rgba(6,182,212,0.04)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(6,182,212,0.15)',
                borderRadius: 20,
                padding: '1.75rem',
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)' }}>
                    <Mail className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-mono mb-0.5">Email</p>
                    <p className="text-white font-medium">sulaymanyusuf.a@gmail.com</p>
                  </div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-slate-700 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </div>
            </TiltCard>
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {[
            { href: 'https://github.com/xyro-coder', icon: Github, label: 'GitHub', handle: '@xyro-coder', color: '168,85,247' },
            { href: 'https://www.linkedin.com/in/sulayman-yusuf-a84940214/', icon: Linkedin, label: 'LinkedIn', handle: 'Sulayman Yusuf', color: '99,102,241' },
          ].map(({ href, icon: Icon, label, handle, color }) => (
            <motion.div key={label} variants={fadeUp}>
              <a href={href} target="_blank" rel="noopener noreferrer" className="block">
                <TiltCard
                  className="group cursor-pointer"
                  style={{
                    background: `rgba(${color},0.03)`,
                    backdropFilter: 'blur(16px)',
                    border: `1px solid rgba(${color},0.12)`,
                    borderRadius: 20,
                    padding: '1.5rem',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: `rgba(${color},0.1)` }}>
                        <Icon className="h-4 w-4" style={{ color: `rgb(${color})` }} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-700 font-mono mb-0.5">{label}</p>
                        <p className="text-slate-300 text-sm font-medium">{handle}</p>
                      </div>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-700 group-hover:text-slate-400 transition-colors duration-300" />
                  </div>
                </TiltCard>
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Info grid */}
        <motion.div
          className="rounded-3xl overflow-hidden mb-8"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <div className="p-8" style={{ background: '#080c1e' }}>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4 text-cyan-500" />
                <p className="text-xs uppercase tracking-[0.2em] text-slate-700 font-mono">Location</p>
              </div>
              <p className="text-white font-medium mb-1">Seattle, WA</p>
              <p className="text-slate-600 text-sm font-mono">University of Washington</p>
              <p className="text-slate-600 text-sm font-mono">Paul G. Allen School of CS</p>
            </div>
            <div className="p-8" style={{ background: '#080c1e' }}>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-700 font-mono mb-4">Availability</p>
              <ul className="space-y-2">
                {['Research collaborations', 'ML engineering internships (Summer 2026)', 'Speaking engagements', 'Open source contributions'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-sm text-slate-400">
                    <span className="w-1 h-1 rounded-full bg-cyan-500 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Resume CTA */}
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <SleekButton href="/resume/resume.pdf" download variant="primary">
            <Download className="h-4 w-4" />
            Download Resume
          </SleekButton>
          <SleekButton href="https://github.com/xyro-coder" target="_blank" rel="noopener noreferrer">
            View GitHub
          </SleekButton>
        </motion.div>
      </div>
    </div>
  )
}
