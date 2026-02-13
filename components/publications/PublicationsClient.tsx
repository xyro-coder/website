'use client'

import { FileText, ExternalLink, Code } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import CopyButton from '@/components/ui/CopyButton'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
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

interface Props {
  featuredPub: Publication | undefined
  otherPubs: Publication[]
}

export default function PublicationsClient({ featuredPub, otherPubs }: Props) {
  const { ref: collapseRef, visible: collapsed } = useScrolledIntoView(0.4)

  return (
    <div className="bg-[#080c1e] min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">

        <div className="mb-16 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-600 mb-4">
            Latent Projections · Rotation Trick · Sparsity Collapse
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)' }}>
              Publications
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Research contributions to geometric deep learning and mechanistic interpretability
          </p>
        </div>

        {/* ─── RT-TopKSAE Featured ─── */}
        {featuredPub && (
          <section className="mb-20" ref={collapseRef}>
            <div className="relative">
              <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
                <RotationalSparsityCollapse collapsed={collapsed} />
              </div>

              <div className="relative z-10 grid grid-cols-1 md:grid-cols-5 gap-0">
                <div
                  className="md:col-span-3 p-8 md:p-10 rounded-2xl"
                  style={{
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    background: 'rgba(8, 12, 30, 0.65)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div className="flex flex-wrap items-center gap-2 mb-5">
                    <Badge variant="cyan">Under Review</Badge>
                    <Badge variant="purple">ICLR 2026 @ GRaM Workshop</Badge>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white"
                    style={{ textShadow: '0 0 40px rgba(6,182,212,0.25)' }}>
                    {featuredPub.title}
                  </h2>

                  <div className="mb-5 space-y-1 text-sm text-slate-500">
                    <p><span className="text-slate-400">Authors:</span> {featuredPub.authors.join(', ')}</p>
                    <p><span className="text-slate-400">Venue:</span> {featuredPub.venue}</p>
                    <p>{new Date(featuredPub.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-sm uppercase tracking-widest text-slate-600 mb-3">Abstract</h3>
                    <p className="text-slate-400 leading-relaxed text-sm">{featuredPub.abstract}</p>
                  </div>

                  <div className="flex items-baseline gap-3 mb-6 p-3 rounded-lg"
                    style={{ background: 'rgba(6,182,212,0.06)', borderLeft: '2px solid rgba(6,182,212,0.5)' }}>
                    <span className="text-2xl font-bold text-cyan-400">40%</span>
                    <span className="text-sm text-slate-500">improvement in principal component retention</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {featuredPub.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                  </div>

                  <div className="flex flex-wrap gap-3 mb-6">
                    {featuredPub.arxiv && (
                      <a href={featuredPub.arxiv} target="_blank" rel="noopener noreferrer">
                        <Button variant="primary" className="gap-2">
                          <ExternalLink className="h-4 w-4" />arXiv
                        </Button>
                      </a>
                    )}
                    {featuredPub.pdf && (
                      <a href={featuredPub.pdf} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2">
                          <FileText className="h-4 w-4" />PDF
                        </Button>
                      </a>
                    )}
                    {featuredPub.code && (
                      <a href={featuredPub.code} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="gap-2">
                          <Code className="h-4 w-4" />Code
                        </Button>
                      </a>
                    )}
                    {featuredPub.bibtex && <CopyButton text={featuredPub.bibtex} label="BibTeX" />}
                  </div>

                  {featuredPub.bibtex && (
                    <details className="group">
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-center justify-between p-3 rounded-lg transition-colors"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                          <span className="text-sm font-mono text-slate-400">BibTeX Citation</span>
                          <span className="text-slate-600 group-open:rotate-180 transition-transform text-xs">▼</span>
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

                {/* Negative space for the visualization */}
                <div className="hidden md:block md:col-span-2" style={{ minHeight: 500 }} />
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
          <section className="mb-20">
            <p className="text-xs uppercase tracking-widest text-slate-600 mb-6">All Publications</p>
            <div className="space-y-4">
              {otherPubs.map(pub => (
                <div key={pub.slug} className="p-6 rounded-2xl"
                  style={{ background: 'rgba(8,12,30,0.8)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-grow">
                      <div className="mb-2">
                        <Badge variant={pub.status === 'published' ? 'cyan' : pub.status === 'under-review' ? 'purple' : 'default'}>
                          {pub.status === 'published' ? 'Published' : pub.status === 'under-review' ? 'Under Review' : 'Preprint'}
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-white">{pub.title}</h3>
                      <p className="text-slate-500 mb-2 text-sm">{pub.authors.join(', ')}</p>
                      <p className="text-slate-500 font-medium mb-3 text-sm">{pub.venue}, {pub.year}</p>
                      <div className="flex flex-wrap gap-2">
                        {pub.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-2 shrink-0">
                      {pub.arxiv && <a href={pub.arxiv} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm">arXiv</Button></a>}
                      {pub.pdf && <a href={pub.pdf} target="_blank" rel="noopener noreferrer"><Button variant="outline" size="sm">PDF</Button></a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── Topological Interest Map ─── */}
        <section>
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-600 mb-3">
              Simplicial Homology · Persistent Homology · Connected Components
            </p>
            <h2 className="text-4xl font-bold text-white mb-3">Research Interests</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Interests connected by triangular simplices — shaded planes mark mathematically adjacent fields.
              Hover any node to illuminate its topological neighborhood.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden"
            style={{ background: 'rgba(8,12,30,0.85)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.04)' }}>
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
