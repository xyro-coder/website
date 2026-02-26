'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react'
import SleekButton from '@/components/ui/SleekButton'
import Badge from '@/components/ui/Badge'
import { motion } from 'framer-motion'

// All 5 home visualizations — loaded client-side only
const LatentManifold = dynamic(() => import('@/components/geometric/home/LatentManifold'), { ssr: false })
const SimplicialComplex = dynamic(() => import('@/components/geometric/home/SimplicialComplex'), { ssr: false })
const HyperbolicEmbedding = dynamic(() => import('@/components/geometric/home/HyperbolicEmbedding'), { ssr: false })
const VectorField = dynamic(() => import('@/components/geometric/home/VectorField'), { ssr: false })
const CliffordRotors = dynamic(() => import('@/components/geometric/home/CliffordRotors'), { ssr: false })
const GeometricCounter = dynamic(() => import('@/components/geometric/effects/GeometricCounter'), { ssr: false })

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

function TiltCard({ children, className = '', style = {} }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties
}) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg)`
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

export default function Home() {
  return (
    <div className="bg-[#080c1e] text-white">

      {/* ─── SECTION 1: HERO — Latent Manifold + Hyperbolic Embedding ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <HyperbolicEmbedding />
        <LatentManifold />

        <div className="relative z-10 container mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="max-w-3xl"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.h1 variants={fadeUp} className="text-7xl md:text-9xl font-bold leading-none mb-4" style={{ letterSpacing: '-0.035em' }}>
              <span className="text-white">Sulayman</span>
              <br />
              <span className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)' }}>
                Yusuf
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-xl md:text-2xl text-slate-500 font-light mb-2 tracking-wide font-mono">
              CS Researcher · ML Engineer
            </motion.p>
            <motion.p variants={fadeUp} className="text-base text-slate-600 mb-8 max-w-xl leading-relaxed">
              Building at the intersection of{' '}
              <span className="text-cyan-400 font-medium">geometric deep learning</span> and{' '}
              <span className="text-purple-400 font-medium">mechanistic interpretability</span>.
              Hover the field to probe the latent manifold.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
              <Badge variant="cyan">Research Fellow @ Algoverse AI</Badge>
              <Badge variant="purple">UW Allen School</Badge>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-12">
              <SleekButton href="/about" variant="primary">
                About Me
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </SleekButton>
              <SleekButton href="/publications">
                View Publications
              </SleekButton>
            </motion.div>

            <motion.div variants={fadeUp} className="flex gap-3">
              {[
                { href: 'https://github.com/xyro-coder', icon: Github, label: 'GitHub', color: '6,182,212' },
                { href: 'https://www.linkedin.com/in/sulayman-yusuf-a84940214/', icon: Linkedin, label: 'LinkedIn', color: '168,85,247' },
                { href: 'mailto:sulaymanyusuf.a@gmail.com', icon: Mail, label: 'Email', color: '6,182,212' },
              ].map(({ href, icon: Icon, label, color }) => (
                <motion.a
                  key={label}
                  href={href}
                  target={href.startsWith('mailto') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-3 rounded-xl transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                  whileHover={{
                    scale: 1.08,
                    borderColor: `rgba(${color},0.4)`,
                    backgroundColor: `rgba(${color},0.08)`,
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <Icon className="h-5 w-5 text-slate-500" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-5 h-9 rounded-full flex justify-center pt-1.5"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-1 h-2.5 bg-cyan-500/60 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: FEATURED PAPER — Simplicial Complex ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <SimplicialComplex />

        <div className="relative z-10 container mx-auto max-w-7xl px-6 lg:px-8 py-24">
          <motion.div
            className="max-w-2xl ml-auto text-right"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Badge variant="cyan" className="mb-6 inline-block">Under Review · Double-Blind</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ letterSpacing: '-0.025em' }}>
              <span className="text-white">Geometric Rotation</span>
              <br />
              <span className="text-slate-600 text-3xl font-light">for Sparse Autoencoders</span>
            </h2>
            <p className="text-slate-500 mb-4 text-xs uppercase tracking-[0.3em] font-mono">
              ICLR 2026 @ GRaM Workshop
            </p>
            <p className="text-slate-400 mb-10 leading-relaxed">
              The simplices forming above mirror the topology we exploit —
              sparse feature directions discovered via geometric rotation of the k-activated
              subspace, preserving principal components across gradient updates.
            </p>
            <SleekButton href="/publications" variant="primary">
              Read the Paper
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </SleekButton>
          </motion.div>
        </div>
      </section>

      {/* ─── SECTION 3: IMPACT STATS — Vector Field ─── */}
      <section className="relative py-32 overflow-hidden">
        <VectorField />

        <div className="relative z-10 container mx-auto max-w-7xl px-6 lg:px-8">
          <motion.p
            className="text-center text-xs uppercase tracking-[0.35em] text-slate-700 mb-16 font-mono"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Gradient-Preserving Sparsity · 90% dim paths · 10% principal components
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: 4, label: 'GPA', suffix: '.0', color: 'cyan' as const },
              { value: 100, label: 'Model Configurations', suffix: '+', color: 'purple' as const },
              { value: 30, label: 'Runtime Reduction', suffix: '%', color: 'cyan' as const },
            ].map(({ value, label, suffix, color }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard
                  style={{
                    background: 'rgba(8,12,30,0.5)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    borderRadius: 20,
                    padding: '2rem',
                  }}
                >
                  <GeometricCounter value={value} label={label} suffix={suffix} color={color} />
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: RESEARCH AREAS — Clifford Rotors ─── */}
      <section className="relative py-32 overflow-hidden">
        <CliffordRotors />

        <div className="relative z-10 container mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-[0.35em] text-slate-700 mb-4 font-mono">
              Clifford Algebra · Rotor-Mediated Rotations · Bivector Orientations
            </p>
            <h2 className="text-5xl font-bold text-white mb-4" style={{ letterSpacing: '-0.025em' }}>Research Interests</h2>
            <p className="text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              The needles above are bivectors — oriented planes in Clifford algebra.
              Scroll to see them align via rotor transformations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                symbol: '∇',
                title: 'Geometric Deep Learning',
                desc: 'Neural architectures that respect the symmetry groups of data — SO(3), SE(3), and beyond.',
                color: '6,182,212',
              },
              {
                symbol: '⊕',
                title: 'Sparse Autoencoders',
                desc: 'Mechanistic interpretability via geometric sparsity. Finding the true basis of representation.',
                color: '168,85,247',
              },
              {
                symbol: '∼',
                title: 'Equivariant Networks',
                desc: 'Models whose outputs transform predictably under input symmetries. Geometry as inductive bias.',
                color: '6,182,212',
              },
            ].map(({ symbol, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <TiltCard
                  style={{
                    background: 'rgba(8,12,30,0.55)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderRadius: 20,
                    padding: '2rem',
                  }}
                >
                  <div className="text-4xl font-bold mb-4" style={{ color: `rgb(${color})` }}>
                    {symbol}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3" style={{ letterSpacing: '-0.01em' }}>{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: QUICK LINKS ─── */}
      <section className="relative py-24">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { href: '/publications', label: 'Publications', desc: 'Geometric DL · Interpretability', color: '168,85,247' },
              { href: '/contact', label: 'Get In Touch', desc: 'Open to collaboration', color: '6,182,212' },
            ].map(({ href, label, desc, color }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={href}>
                  <TiltCard
                    className="group cursor-pointer"
                    style={{
                      background: 'rgba(8,12,30,0.5)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      borderRadius: 20,
                      padding: '2.5rem',
                    }}
                  >
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-300"
                      style={{ letterSpacing: '-0.015em' }}>
                      {label}
                    </h3>
                    <p className="text-slate-600 text-sm mb-5 font-mono">{desc}</p>
                    <div className="flex items-center text-sm font-mono uppercase tracking-widest" style={{ color: `rgb(${color})` }}>
                      Explore
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </TiltCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
