'use client'

import { FileText, ExternalLink, Code } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import CopyButton from '@/components/ui/CopyButton'
import SleekButton from '@/components/ui/SleekButton'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import type { Publication } from '@/types'

const RotationTrickField = dynamic(
  () => import('@/components/geometric/publications/RotationTrickField'),
  { ssr: false }
)
const RiemannianManifold = dynamic(
  () => import('@/components/geometric/publications/RiemannianManifold'),
  { ssr: false }
)
const GradientFlow = dynamic(
  () => import('@/components/geometric/publications/GradientFlow'),
  { ssr: false }
)

// ─── Scroll progress hook ────────────────────────────────────────────────────
function useScrollProgress(ref: React.RefObject<HTMLElement>) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // 0 = section just entered viewport bottom, 1 = section has scrolled fully through
      const p = 1 - (rect.bottom - vh * 0.3) / (rect.height + vh * 0.7)
      setProgress(Math.max(0, Math.min(1, p)))
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [ref])

  return progress
}

// ─── Tilt card ───────────────────────────────────────────────────────────────
function TiltCard({ children, className = '', style = {} }: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [5, -5]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-5, 5]), { stiffness: 300, damping: 30 })
  const glowX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%'])
  const glowY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%'])

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = cardRef.current?.getBoundingClientRect()
    if (!r) return
    mouseX.set((e.clientX - r.left) / r.width - 0.5)
    mouseY.set((e.clientY - r.top) / r.height - 0.5)
  }
  const onLeave = () => { mouseX.set(0); mouseY.set(0) }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', ...style }}
      className={`relative ${className}`}
    >
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          borderRadius: 'inherit',
          background: useTransform(
            [glowX, glowY],
            ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(6,182,212,0.07) 0%, transparent 60%)`
          ),
          zIndex: 1,
        }}
      />
      {children}
    </motion.div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
interface Props {
  featuredPub: Publication | undefined
  otherPubs: Publication[]
}

export default function PublicationsClient({ featuredPub, otherPubs }: Props) {
  const sectionRef = useRef<HTMLElement>(null!)
  const scrollProgress = useScrollProgress(sectionRef)
  const [gradientMode, setGradientMode] = useState<'baseline' | 'rt'>('baseline')

  // Auto-toggle gradient mode every 5s
  useEffect(() => {
    const id = setInterval(() => setGradientMode(m => m === 'baseline' ? 'rt' : 'baseline'), 5000)
    return () => clearInterval(id)
  }, [])

  return (
    // Seamless navy void — no containers, text floats over continuous dark space
    <div className="bg-[#080c1e] min-h-screen">

      {/* ─── Page header ─── */}
      <motion.div
        className="pt-28 pb-16 text-center px-6"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-xs uppercase tracking-[0.35em] text-slate-700 mb-5 font-mono">
          Latent Projections · Geometric Rotation · Sparsity Collapse
        </p>
        <h1 className="text-6xl md:text-8xl font-bold leading-none mb-6">
          <span className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)' }}>
            Publications
          </span>
        </h1>
        <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed font-mono">
          research contributions to geometric deep learning<br />
          and mechanistic interpretability
        </p>
      </motion.div>

      {/* ─── Featured: The Geometric Rotation Interactive Proof ─── */}
      {featuredPub && (
        <section ref={sectionRef} className="relative px-4 sm:px-6 lg:px-8 pb-32">
          <div className="container mx-auto max-w-6xl">

            {/* Visualization fills the full section — text floats over it */}
            <div className="relative">
              {/* Layer 1: Full-width dual-view field */}
              <div className="w-full mb-8">
                <RotationTrickField scrollProgress={scrollProgress} />
              </div>

              {/* Layer 2: Frosted glass card floats centered below */}
              <div style={{ perspective: '1000px' }}>
                <TiltCard
                  style={{
                    background: 'rgba(8,12,30,0.55)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 24,
                  }}
                >
                  <div className="p-8 md:p-12" style={{ transform: 'translateZ(16px)' }}>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-10">

                      {/* Left: paper content */}
                      <div className="md:col-span-3">
                        <div className="flex flex-wrap items-center gap-2 mb-6">
                          <Badge variant="cyan">Under Review</Badge>
                          <Badge variant="purple">ICLR 2026 @ GRaM Workshop</Badge>
                        </div>

                        <h2 className="text-3xl md:text-4xl font-bold mb-5 text-white leading-tight"
                          style={{ letterSpacing: '-0.025em', textShadow: '0 0 48px rgba(6,182,212,0.18)' }}>
                          {featuredPub.title}
                        </h2>

                        <div className="mb-6 space-y-1 font-mono text-xs text-slate-600">
                          <p><span className="text-slate-500">Authors:</span> {featuredPub.authors.join(', ')}</p>
                          <p><span className="text-slate-500">Venue:</span> {featuredPub.venue}</p>
                          <p>{new Date(featuredPub.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                        </div>

                        <div className="mb-6">
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-700 font-mono mb-3">Abstract</p>
                          <p className="text-slate-400 leading-relaxed text-sm">{featuredPub.abstract}</p>
                        </div>

                        <div className="flex items-baseline gap-3 mb-7 p-4 rounded-2xl"
                          style={{ background: 'rgba(6,182,212,0.04)', borderLeft: '2px solid rgba(6,182,212,0.35)' }}>
                          <span className="text-4xl font-bold text-cyan-400 font-mono tracking-tighter">40%</span>
                          <span className="text-xs text-slate-600 font-mono uppercase tracking-widest leading-relaxed">
                            improvement in<br />principal component retention
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {featuredPub.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {featuredPub.arxiv && (
                            <SleekButton href={featuredPub.arxiv} target="_blank" rel="noopener noreferrer" variant="primary">
                              <ExternalLink className="h-3.5 w-3.5" />arXiv
                            </SleekButton>
                          )}
                          {featuredPub.pdf && (
                            <SleekButton href={featuredPub.pdf} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-3.5 w-3.5" />PDF
                            </SleekButton>
                          )}
                          {featuredPub.code && (
                            <SleekButton href={featuredPub.code} target="_blank" rel="noopener noreferrer">
                              <Code className="h-3.5 w-3.5" />Code
                            </SleekButton>
                          )}
                          {featuredPub.bibtex && <CopyButton text={featuredPub.bibtex} label="BibTeX" />}
                        </div>
                      </div>

                      {/* Right: live metrics panel */}
                      <div className="md:col-span-2 flex flex-col justify-between gap-6">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-700 font-mono mb-4">Live Scroll Proof</p>
                          <div className="space-y-3">
                            {[
                              { label: 'Principal retention', value: `${Math.round(scrollProgress * 40)}%`, color: '6,182,212' },
                              { label: 'Sparsity collapse', value: scrollProgress > 0.4 ? 'Active' : 'Pending', color: '168,85,247' },
                              { label: 'R ∈ SO(3)', value: scrollProgress > 0.05 ? 'Applied' : '—', color: '99,102,241' },
                            ].map(({ label, value, color }) => (
                              <div key={label} className="flex items-center justify-between p-3 rounded-xl"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <span className="text-xs font-mono text-slate-600 uppercase tracking-wide">{label}</span>
                                <span className="text-sm font-mono font-bold" style={{ color: `rgb(${color})` }}>{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Scroll progress bar */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono text-slate-700 uppercase tracking-widest">Scroll Progress</span>
                            <span className="text-xs font-mono text-cyan-700">{Math.round(scrollProgress * 100)}%</span>
                          </div>
                          <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{
                                background: 'linear-gradient(90deg, #06b6d4, #a855f7)',
                                width: `${scrollProgress * 100}%`,
                              }}
                              transition={{ duration: 0.1 }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* ─── Gradient-Preserving Flow (BibTeX section) ─── */}
                    {featuredPub.bibtex && (
                      <div className="mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-700 font-mono mb-1">
                              Gradient-Preserving Flow
                            </p>
                            <p className="text-xs text-slate-700 font-mono">
                              {gradientMode === 'baseline'
                                ? 'Baseline: gradient vanishes at sparse nodes'
                                : 'Ours: gradient passes through gaps'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {(['baseline', 'rt'] as const).map(m => (
                              <button
                                key={m}
                                onClick={() => setGradientMode(m)}
                                className="text-xs font-mono px-3 py-1.5 rounded-lg transition-all duration-300"
                                style={{
                                  background: gradientMode === m
                                    ? m === 'rt' ? 'rgba(6,182,212,0.15)' : 'rgba(168,85,247,0.15)'
                                    : 'rgba(255,255,255,0.03)',
                                  border: gradientMode === m
                                    ? m === 'rt' ? '1px solid rgba(6,182,212,0.4)' : '1px solid rgba(168,85,247,0.4)'
                                    : '1px solid rgba(255,255,255,0.06)',
                                  color: gradientMode === m
                                    ? m === 'rt' ? 'rgb(6,182,212)' : 'rgb(168,85,247)'
                                    : 'rgb(100,116,139)',
                                }}
                              >
                                {m === 'baseline' ? 'Baseline' : 'Ours'}
                              </button>
                            ))}
                          </div>
                        </div>

                        <GradientFlow mode={gradientMode} />

                        {/* BibTeX block with glow-on-arrival effect */}
                        <details className="group mt-4">
                          <summary className="cursor-pointer list-none">
                            <div className="flex items-center justify-between p-3 rounded-xl transition-all duration-300"
                              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                              <span className="text-xs font-mono uppercase tracking-widest"
                                style={{ color: gradientMode === 'rt' ? 'rgba(6,182,212,0.7)' : 'rgba(168,85,247,0.7)' }}>
                                BibTeX Citation
                                {gradientMode === 'rt' && <span className="ml-2 text-cyan-600">← gradient arrived</span>}
                              </span>
                              <span className="text-slate-700 group-open:rotate-180 transition-transform text-xs">▼</span>
                            </div>
                          </summary>
                          <div className="mt-2 p-5 rounded-xl"
                            style={{
                              background: 'rgba(0,0,0,0.5)',
                              border: gradientMode === 'rt'
                                ? '1px solid rgba(6,182,212,0.2)'
                                : '1px solid rgba(255,255,255,0.04)',
                              boxShadow: gradientMode === 'rt'
                                ? '0 0 30px rgba(6,182,212,0.06)'
                                : 'none',
                              transition: 'all 0.5s ease',
                            }}>
                            <pre className="text-xs text-slate-500 overflow-x-auto font-mono leading-relaxed">
                              <code>{featuredPub.bibtex}</code>
                            </pre>
                          </div>
                        </details>
                      </div>
                    )}
                  </div>
                </TiltCard>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ─── Other publications ─── */}
      {otherPubs.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 pb-24">
          <div className="container mx-auto max-w-4xl">
            <p className="text-xs uppercase tracking-[0.35em] text-slate-700 font-mono mb-10">All Publications</p>
            <div className="space-y-4">
              {otherPubs.map((pub, i) => (
                <motion.div
                  key={pub.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TiltCard
                    style={{
                      background: 'rgba(8,12,30,0.6)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: 16,
                      padding: '1.75rem',
                    }}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-grow">
                        <div className="mb-3">
                          <Badge variant={pub.status === 'published' ? 'cyan' : pub.status === 'under-review' ? 'purple' : 'default'}>
                            {pub.status === 'published' ? 'Published' : pub.status === 'under-review' ? 'Under Review' : 'Preprint'}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-white" style={{ letterSpacing: '-0.015em' }}>{pub.title}</h3>
                        <p className="text-slate-600 mb-1 text-xs font-mono">{pub.authors.join(', ')}</p>
                        <p className="text-slate-600 font-mono text-xs mb-4">{pub.venue}, {pub.year}</p>
                        <div className="flex flex-wrap gap-2">
                          {pub.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                        </div>
                      </div>
                      <div className="flex md:flex-col gap-2 shrink-0">
                        {pub.arxiv && <SleekButton href={pub.arxiv} target="_blank" rel="noopener noreferrer">arXiv</SleekButton>}
                        {pub.pdf && <SleekButton href={pub.pdf} target="_blank" rel="noopener noreferrer">PDF</SleekButton>}
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── Riemannian Manifold (Research Interests) ─── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-32">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-[0.35em] text-slate-700 font-mono mb-4">
              Riemannian Geometry · Gravity Wells · Orthographic Projection
            </p>
            <h2 className="text-5xl font-bold text-white mb-4" style={{ letterSpacing: '-0.025em' }}>
              Research Interests
            </h2>
            <p className="text-slate-600 max-w-xl mx-auto text-sm leading-relaxed font-mono">
              each interest warps the manifold — well depth measures focus.<br />
              related fields share a valley in the geometry.
            </p>
          </motion.div>

          <div className="rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(8,12,30,0.7)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
            <RiemannianManifold />
          </div>
        </div>
      </section>

    </div>
  )
}
