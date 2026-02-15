'use client'

import { FileText, ExternalLink, Code } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import CopyButton from '@/components/ui/CopyButton'
import SleekButton from '@/components/ui/SleekButton'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import type { Publication } from '@/types'

const RotationalSparsityCollapse = dynamic(
  () => import('@/components/geometric/publications/RotationalSparsityCollapse'),
  { ssr: false }
)
const TopologicalInterestMap = dynamic(
  () => import('@/components/geometric/publications/TopologicalInterestMap'),
  { ssr: false }
)

function useScrolledIntoView(threshold = 0.4) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.intersectionRatio >= threshold) setVisible(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function TiltCard({ children, className = '', style = {} }: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 })
  const glowX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%'])
  const glowY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', ...style }}
      className={`relative ${className}`}
    >
      {/* Dynamic specular highlight */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([x, y]) => `radial-gradient(circle at ${x} ${y}, rgba(6,182,212,0.08) 0%, transparent 60%)`
          ),
          zIndex: 1,
        }}
      />
      {children}
    </motion.div>
  )
}

interface Props {
  featuredPub: Publication | undefined
  otherPubs: Publication[]
}

export default function PublicationsClient({ featuredPub, otherPubs }: Props) {
  const { ref: collapseRef, visible: collapsed } = useScrolledIntoView(0.4)

  return (
    <div className="bg-[#080c1e] min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">

        {/* Header */}
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="text-xs uppercase tracking-[0.3em] text-slate-600 mb-4 font-mono">
            Latent Projections · Rotation Trick · Sparsity Collapse
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)' }}>
              Publications
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Research contributions to geometric deep learning and mechanistic interpretability
          </p>
        </motion.div>

        {/* ─── RT-TopKSAE Featured ─── */}
        {featuredPub && (
          <section className="mb-24" ref={collapseRef}>
            <div className="relative" style={{ perspective: '1200px' }}>
              {/* Layer 1: Live 3D geometry breathes behind everything */}
              <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                <RotationalSparsityCollapse collapsed={collapsed} />
              </div>

              {/* Layer 2: Tiltable frosted glass card (60% width) */}
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-0">
                <TiltCard
                  className="md:col-span-3"
                  style={{
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    background: 'rgba(8,12,30,0.6)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 20,
                    padding: '2.5rem',
                  }}
                >
                  {/* Layer 3: High-contrast typography on top */}
                  <div style={{ transform: 'translateZ(20px)' }}>
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                      <Badge variant="cyan">Under Review</Badge>
                      <Badge variant="purple">ICLR 2026 @ GRaM Workshop</Badge>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-5 text-white leading-tight"
                      style={{ letterSpacing: '-0.02em', textShadow: '0 0 40px rgba(6,182,212,0.2)' }}>
                      {featuredPub.title}
                    </h2>

                    <div className="mb-5 space-y-1 font-mono text-xs text-slate-600">
                      <p><span className="text-slate-500">Authors:</span> {featuredPub.authors.join(', ')}</p>
                      <p><span className="text-slate-500">Venue:</span> {featuredPub.venue}</p>
                      <p>{new Date(featuredPub.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                    </div>

                    <div className="mb-6">
                      <p className="text-xs uppercase tracking-widest text-slate-700 font-mono mb-3">Abstract</p>
                      <p className="text-slate-400 leading-relaxed text-sm">{featuredPub.abstract}</p>
                    </div>

                    {/* Key metric */}
                    <div className="flex items-baseline gap-3 mb-6 p-4 rounded-xl"
                      style={{ background: 'rgba(6,182,212,0.04)', borderLeft: '2px solid rgba(6,182,212,0.4)' }}>
                      <span className="text-3xl font-bold text-cyan-400 font-mono">40%</span>
                      <span className="text-xs text-slate-500 font-mono uppercase tracking-wide">improvement in principal component retention</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {featuredPub.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                    </div>

                    <div className="flex flex-wrap gap-3 mb-6">
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

                    {featuredPub.bibtex && (
                      <details className="group">
                        <summary className="cursor-pointer list-none">
                          <div className="flex items-center justify-between p-3 rounded-lg transition-colors"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">BibTeX Citation</span>
                            <span className="text-slate-700 group-open:rotate-180 transition-transform text-xs">▼</span>
                          </div>
                        </summary>
                        <div className="mt-2 p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.4)' }}>
                          <pre className="text-xs text-slate-400 overflow-x-auto font-mono">
                            <code>{featuredPub.bibtex}</code>
                          </pre>
                        </div>
                      </details>
                    )}
                  </div>
                </TiltCard>

                {/* Negative space — the viz breathes here */}
                <div className="hidden md:block md:col-span-2" style={{ minHeight: 520 }} />
              </div>

              <p className="text-center text-xs font-mono text-slate-700 mt-6">
                {collapsed
                  ? 'Rotation Trick applied  ·  Principal components isolated'
                  : 'Scroll to trigger the Rotation Trick →'}
              </p>
            </div>
          </section>
        )}

        {/* ─── Other publications ─── */}
        {otherPubs.length > 0 && (
          <section className="mb-24">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-600 font-mono mb-8">All Publications</p>
            <div className="space-y-4">
              {otherPubs.map((pub, i) => (
                <motion.div
                  key={pub.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <TiltCard
                    className="w-full"
                    style={{
                      background: 'rgba(8,12,30,0.7)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.05)',
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
                        <h3 className="text-xl font-bold mb-2 text-white" style={{ letterSpacing: '-0.01em' }}>{pub.title}</h3>
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
          </section>
        )}

        {/* ─── Topological Interest Map ─── */}
        <section>
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-slate-600 font-mono mb-3">
              Simplicial Homology · Persistent Homology · Connected Components
            </p>
            <h2 className="text-4xl font-bold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>Research Interests</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              Interests connected by triangular simplices — hover any node to illuminate its topological neighborhood.
            </p>
          </motion.div>

          <div className="rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(8,12,30,0.8)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}>
            <TopologicalInterestMap />
          </div>

          <p className="text-center text-xs font-mono text-slate-700 mt-4">
            Persistent Homology  ·  Simplicial Complex  ·  Hover to probe neighborhood
          </p>
        </section>

      </div>
    </div>
  )
}
