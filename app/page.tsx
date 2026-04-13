'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowRight, Mail } from 'lucide-react'
import SleekButton from '@/components/ui/SleekButton'
import Badge from '@/components/ui/Badge'
import { motion } from 'framer-motion'
import DeRezTitle from '@/components/home/DeRezTitle'

const SingularityField = dynamic(() => import('@/components/geometric/home/SingularityField'), { ssr: false })
const SimplicialComplex = dynamic(() => import('@/components/geometric/home/SimplicialComplex'), { ssr: false })
const CliffordRotors    = dynamic(() => import('@/components/geometric/home/CliffordRotors'),    { ssr: false })

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 24 } },
}

export default function Home() {
  return (
    <div className="text-white" style={{ background: '#000' }}>

      {/* ─── HERO ─── */}
      {/* SingularityField renders its own dark background — sole canvas in hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <SingularityField />

        <div className="relative z-10 container mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="max-w-3xl"
            variants={stagger}
            initial="hidden"
            animate="show"
          >
            <motion.p variants={fadeUp} className="text-xs uppercase tracking-[0.35em] text-slate-700 mb-6 font-mono">
              CS Researcher · ML Engineer · UW Allen School
            </motion.p>

            {/* De-rez kinetic title — chars shatter on scroll */}
            <motion.div variants={fadeUp}>
              <DeRezTitle />
            </motion.div>

            <motion.p variants={fadeUp} className="text-base text-slate-500 mb-10 max-w-lg leading-relaxed">
              CS student at UW researching{' '}
              <span className="text-cyan-400 font-medium">sparse autoencoders</span>,{' '}
              <span className="text-purple-400 font-medium">mechanistic interpretability</span>,
              and representation geometry.
            </motion.p>

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
                {
                  href: 'https://github.com/xyro-coder', label: 'GitHub', color: '6,182,212',
                  icon: <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-500 fill-current"><path d="M12 2C6.477 2 2 6.484 2 12.021c0 4.428 2.865 8.185 6.839 9.505.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.342-3.369-1.342-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.031 1.531 1.031.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.203 22 16.447 22 12.021 22 6.484 17.523 2 12 2z"/></svg>,
                },
                {
                  href: 'https://www.linkedin.com/in/sulayman-yusuf-a84940214/', label: 'LinkedIn', color: '168,85,247',
                  icon: <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-500 fill-current"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
                },
                {
                  href: 'mailto:sulaymanyusuf.a@gmail.com', label: 'Email', color: '6,182,212',
                  icon: <Mail className="h-5 w-5 text-slate-500" />,
                },
              ].map(({ href, icon, label, color }) => (
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
                    scale: 1.1,
                    borderColor: `rgba(${color},0.5)`,
                    backgroundColor: `rgba(${color},0.08)`,
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  {icon}
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

      {/* ─── FEATURED PAPER ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <SimplicialComplex />

        <div className="relative z-10 container mx-auto max-w-7xl px-6 lg:px-8 py-24">
          <motion.div
            className="max-w-2xl ml-auto text-right"
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 120, damping: 24 }}
          >
            <Badge variant="cyan" className="mb-6 inline-block">Accepted · ICLR 2026</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ letterSpacing: '-0.025em' }}>
              <span className="text-white">RT-TopKSAE</span>
              <br />
              <span className="text-slate-600 text-3xl font-light">Improving Top-k SAEs with the Rotation Trick</span>
            </h2>
            <p className="text-slate-500 mb-4 text-xs uppercase tracking-[0.3em] font-mono">
              Re-Align Research Workshop
            </p>
            <p className="text-slate-400 mb-6 leading-relaxed">
              Adapting the rotation trick to TopK sparse autoencoders —
              rotating the k-activated subspace to preserve principal components
              across gradient updates, eliminating dead features entirely.
            </p>

            <div className="mb-10 text-right">
              <span className="text-6xl font-bold font-mono" style={{
                backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>100%</span>
              <p className="text-slate-600 text-xs font-mono uppercase tracking-widest mt-1">
                dictionary utilization vs 47% baseline
              </p>
            </div>

            <SleekButton href="/publications" variant="primary">
              Read the Paper
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </SleekButton>
          </motion.div>
        </div>
      </section>

      {/* ─── RESEARCH INTERESTS ─── */}
      {/* Scientific Brutalism: no boxes — left border as typographic annotation only */}
      <section className="relative py-40 overflow-hidden">
        <CliffordRotors />

        <div className="relative z-10 container mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            className="mb-20"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 120, damping: 24 }}
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white" style={{ letterSpacing: '-0.025em' }}>
              Research Interests
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                symbol: '∇',
                title: 'Geometric Deep Learning',
                desc: 'Neural architectures that respect the symmetry groups of data — SO(3), SE(3), and beyond. Equivariance as inductive bias.',
                color: '6,182,212',
              },
              {
                symbol: 'ℱ',
                title: 'Sparse Autoencoders',
                desc: 'Mechanistic interpretability via geometric sparsity. Recovering the true over-complete dictionary of representation space.',
                color: '168,85,247',
              },
              {
                symbol: '≅',
                title: 'SSL Geometry',
                desc: 'How CNN inductive biases shape self-supervised representation geometry — alignment, uniformity, and dimensional collapse.',
                color: '6,182,212',
              },
            ].map(({ symbol, title, desc, color }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: 'spring', stiffness: 120, damping: 24 }}
                style={{
                  borderLeft: `1px solid rgba(${color},0.25)`,
                  paddingLeft: '1.5rem',
                }}
              >
                <div
                  className="text-5xl font-bold mb-5 leading-none"
                  style={{ color: `rgb(${color})`, textShadow: `0 0 40px rgba(${color},0.3)` }}
                >
                  {symbol}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3" style={{ letterSpacing: '-0.01em' }}>
                  {title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── QUICK LINKS — Scientific Brutalism: pure text, no boxes ─── */}
      <section className="relative py-24">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {[
              { href: '/publications', label: 'Publications', desc: 'Geometric DL · Interpretability', color: '168,85,247' },
              { href: '/contact',      label: 'Get In Touch', desc: 'Open to collaboration',          color: '6,182,212' },
            ].map(({ href, label, desc, color }, i) => (
              <motion.div
                key={href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, type: 'spring', stiffness: 120, damping: 24 }}
              >
                <Link href={href} className="group block py-10 px-4" style={{
                  borderTop: `1px solid rgba(${color},0.12)`,
                }}>
                  <p className="text-slate-700 text-xs font-mono uppercase tracking-widest mb-3">{desc}</p>
                  <div className="flex items-end justify-between">
                    <h3
                      className="text-4xl md:text-5xl font-bold transition-colors duration-300"
                      style={{ letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.85)' }}
                    >
                      {label}
                    </h3>
                    <ArrowRight
                      className="mb-1 h-6 w-6 text-slate-700 group-hover:translate-x-2 group-hover:text-white transition-all duration-300"
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
