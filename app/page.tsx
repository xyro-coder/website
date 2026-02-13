import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'

// All 5 home visualizations — loaded client-side only
const LatentManifold = dynamic(() => import('@/components/geometric/home/LatentManifold'), { ssr: false })
const SimplicialComplex = dynamic(() => import('@/components/geometric/home/SimplicialComplex'), { ssr: false })
const HyperbolicEmbedding = dynamic(() => import('@/components/geometric/home/HyperbolicEmbedding'), { ssr: false })
const VectorField = dynamic(() => import('@/components/geometric/home/VectorField'), { ssr: false })
const CliffordRotors = dynamic(() => import('@/components/geometric/home/CliffordRotors'), { ssr: false })
const GeometricCounter = dynamic(() => import('@/components/geometric/effects/GeometricCounter'), { ssr: false })

export default function Home() {
  return (
    <div className="bg-[#080c1e] text-white">

      {/* ─── SECTION 1: HERO — Latent Manifold + Hyperbolic Embedding ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Stacked background layers */}
        <HyperbolicEmbedding />
        <LatentManifold />

        {/* Hero text — sits above canvas layers */}
        <div className="relative z-10 container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Name */}
            <h1 className="text-7xl md:text-8xl font-bold leading-none mb-4 tracking-tight">
              <span className="text-white">Sulayman</span>
              <br />
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)' }}
              >
                Yusuf
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-400 font-light mb-2 tracking-wide">
              CS Researcher · ML Engineer
            </p>
            <p className="text-base text-slate-500 mb-8 max-w-xl leading-relaxed">
              Building at the intersection of{' '}
              <span className="text-cyan-400 font-medium">geometric deep learning</span> and{' '}
              <span className="text-purple-400 font-medium">mechanistic interpretability</span>.
              Hover the field to probe the latent manifold.
            </p>

            {/* Status badges */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Badge variant="cyan">Research Fellow @ Algoverse AI</Badge>
              <Badge variant="purple">UW Allen School</Badge>
            </div>

            {/* CTA row */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/about">
                <Button size="lg" className="group">
                  About Me
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/publications">
                <Button variant="outline" size="lg">View Publications</Button>
              </Link>
            </div>

            {/* Social */}
            <div className="flex gap-4">
              <a
                href="https://github.com/xyro-coder"
                target="_blank" rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-3 rounded-full border border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all"
              >
                <Github className="h-5 w-5 text-slate-400" />
              </a>
              <a
                href="https://www.linkedin.com/in/sulayman-yusuf-a84940214/"
                target="_blank" rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-3 rounded-full border border-slate-700 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all"
              >
                <Linkedin className="h-5 w-5 text-slate-400" />
              </a>
              <a
                href="mailto:sulaymanyusuf.a@gmail.com"
                aria-label="Email"
                className="p-3 rounded-full border border-slate-700 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all"
              >
                <Mail className="h-5 w-5 text-slate-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="w-5 h-9 rounded-full border border-slate-600 flex justify-center pt-1.5">
            <div className="w-1 h-2.5 bg-cyan-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: RT-TOPSAE PAPER — Simplicial Complex ─── */}
      <section className="relative min-h-screen flex items-center overflow-hidden border-t border-slate-800/50">
        <SimplicialComplex />

        <div className="relative z-10 container mx-auto max-w-7xl px-6 lg:px-8 py-24">
          <div className="max-w-2xl ml-auto text-right">
            <Badge variant="cyan" className="mb-6 inline-block">Latest Publication</Badge>
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="text-white">RT-TopKSAE</span>
            </h2>
            <p className="text-2xl text-slate-400 font-light mb-6">
              Improving Top‑k Sparse Autoencoders<br />
              <span className="text-purple-400">with the Rotation Trick</span>
            </p>
            <p className="text-slate-500 mb-4 text-sm uppercase tracking-widest">
              Under review · ICLR 2026 @ GRaM Workshop
            </p>
            <p className="text-slate-400 mb-10 leading-relaxed">
              The simplices you see forming above mirror the topology we exploit —
              sparse feature directions discovered via geometric rotation of the k-activated
              subspace, preserving principal components across gradient updates.
            </p>
            <Link href="/publications">
              <Button size="lg" className="group">
                Read the Paper
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3: IMPACT STATS — Vector Field (sparsity) ─── */}
      <section className="relative py-32 overflow-hidden border-t border-slate-800/50">
        <VectorField />

        <div className="relative z-10 container mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-center text-xs uppercase tracking-[0.3em] text-slate-600 mb-16">
            Gradient-Preserving Sparsity · 90% dim paths · 10% principal components
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <GeometricCounter value={4} label="GPA" suffix=".0" color="cyan" />
            <GeometricCounter value={100} label="Model Configurations" suffix="+" color="purple" />
            <GeometricCounter value={30} label="Runtime Reduction" suffix="%" color="cyan" />
          </div>
        </div>
      </section>

      {/* ─── SECTION 4: RESEARCH AREAS — Clifford Rotors ─── */}
      <section className="relative py-32 overflow-hidden border-t border-slate-800/50">
        <CliffordRotors />

        <div className="relative z-10 container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-600 mb-4">
              Clifford Algebra · Rotor-Mediated Rotations · Bivector Orientations
            </p>
            <h2 className="text-5xl font-bold text-white mb-4">Research Interests</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              The needles above are bivectors — oriented planes in Clifford algebra.
              Scroll to see them align via rotor transformations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                symbol: '∇',
                title: 'Geometric Deep Learning',
                desc: 'Neural architectures that respect the symmetry groups of data — SO(3), SE(3), and beyond.',
                color: 'cyan',
              },
              {
                symbol: '⊕',
                title: 'Sparse Autoencoders',
                desc: 'Mechanistic interpretability via geometric sparsity. Finding the true basis of representation.',
                color: 'purple',
              },
              {
                symbol: '∼',
                title: 'Equivariant Networks',
                desc: 'Models whose outputs transform predictably under input symmetries. Geometry as inductive bias.',
                color: 'cyan',
              },
            ].map(({ symbol, title, desc, color }) => (
              <div
                key={title}
                className={`p-8 rounded-2xl border ${
                  color === 'cyan'
                    ? 'border-cyan-900/50 bg-cyan-950/20 hover:border-cyan-700/50'
                    : 'border-purple-900/50 bg-purple-950/20 hover:border-purple-700/50'
                } transition-colors`}
              >
                <div className={`text-4xl font-bold mb-4 ${color === 'cyan' ? 'text-cyan-400' : 'text-purple-400'}`}>
                  {symbol}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SECTION 5: QUICK LINKS ─── */}
      <section className="relative py-24 border-t border-slate-800/50">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { href: '/projects', label: 'Projects', desc: 'Research & open-source', arrow: true, color: 'cyan' },
              { href: '/publications', label: 'Publications', desc: 'Geometric DL · Interpretability', arrow: true, color: 'purple' },
              { href: '/contact', label: 'Get In Touch', desc: 'Open to collaboration', arrow: true, color: 'cyan' },
            ].map(({ href, label, desc, color }) => (
              <Link key={href} href={href}>
                <div
                  className={`group p-8 rounded-2xl border transition-all cursor-pointer ${
                    color === 'cyan'
                      ? 'border-slate-800 hover:border-cyan-700/60 hover:bg-cyan-950/20'
                      : 'border-slate-800 hover:border-purple-700/60 hover:bg-purple-950/20'
                  }`}
                >
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {label}
                  </h3>
                  <p className="text-slate-500 text-sm mb-4">{desc}</p>
                  <div className={`flex items-center text-sm font-medium ${color === 'cyan' ? 'text-cyan-500' : 'text-purple-500'}`}>
                    Explore
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
