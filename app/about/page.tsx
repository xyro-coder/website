'use client'

import dynamic from 'next/dynamic'
import { Download } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import SleekButton from '@/components/ui/SleekButton'
import GraphNeuralNetworkBackground from '@/components/geometric/core/GraphNeuralNetworkBackground'
import { motion } from 'framer-motion'

const ParticleInitials = dynamic(
  () => import('@/components/geometric/effects/ParticleInitials'),
  { ssr: false }
)
const LatentSynthesis = dynamic(
  () => import('@/components/geometric/about/LatentSynthesis'),
  { ssr: false }
)
const TemporalCurvature = dynamic(
  () => import('@/components/geometric/about/TemporalCurvature'),
  { ssr: false }
)
const StructuralInvariance = dynamic(
  () => import('@/components/geometric/about/StructuralInvariance'),
  { ssr: false }
)

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
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

const GLASS = {
  background: 'rgba(8,12,30,0.55)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: 20,
}

export default function AboutPage() {
  return (
    <>
      <GraphNeuralNetworkBackground />
      <div className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">

          {/* ─── HERO ─── */}
          <motion.section
            className="mb-24 text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-8" style={{ letterSpacing: '-0.035em' }}>
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                About Me
              </span>
            </h1>
            <div className="mb-8">
              <ParticleInitials />
              <p className="text-center text-xs text-slate-600 mt-4 font-mono">
                <span className="text-cyan-500">Particle Assembly</span> · Identity Through Geometry
              </p>
            </div>
            <p className="text-xl text-slate-500 max-w-3xl mx-auto leading-relaxed">
              CS Researcher &amp; ML Engineer probing the geometry of machine learning —
              from sparse autoencoders to SSL representation theory and graph embeddings
            </p>
          </motion.section>

          {/* ─── BIO ─── */}
          <motion.section
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <TiltCard style={{ ...GLASS, padding: '2.5rem' }}>
              <h2 className="text-3xl font-bold mb-6 text-white" style={{ letterSpacing: '-0.02em' }}>Background</h2>
              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>
                  I&apos;m a Computer Science student at the University of Washington&apos;s Paul G.
                  Allen School of Computer Science &amp; Engineering, maintaining a 4.0 GPA while
                  doing research at the intersection of geometric deep learning, mechanistic
                  interpretability, and representation theory.
                </p>
                <p>
                  Currently I&apos;m working as an{' '}
                  <span className="text-cyan-400 font-semibold">ML Research Engineer</span> at a stealth AI startup,
                  investigating how CNN inductive biases shape{' '}
                  <span className="text-purple-400 font-semibold">SSL representation geometry</span> —
                  diagnosing alignment, uniformity, and dimensional collapse across architectures.
                  This summer I&apos;ll be joining{' '}
                  <span className="text-cyan-400 font-semibold">Analog Devices</span> as an AI/ML Intern
                  focused on graph-based ML and embedding models for structured circuit data.
                </p>
                <p>
                  I was previously a Research Fellow at{' '}
                  <span className="text-purple-400 font-semibold">Algoverse AI</span>, where I published
                  RT-TopKSAE at ICLR 2026 — adapting the rotation trick to TopK sparse autoencoders,
                  achieving 100% dictionary utilization vs. the baseline&apos;s 47%.
                </p>
              </div>
              <div className="mt-8">
                <SleekButton href="/resume/resume.pdf" download variant="primary">
                  <Download className="h-4 w-4" />
                  Download Resume
                </SleekButton>
              </div>
            </TiltCard>
          </motion.section>

          {/* ─── LATENT SYNTHESIS — Skill Manifold ─── */}
          <motion.section
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-700 mb-3 font-mono">
                Manifold Hypothesis · Relational Bias · Force-Directed Clustering
              </p>
              <h2 className="text-4xl font-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>Latent Synthesis</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed">
                Skills as a structured latent space — related tools gravitate into clusters,
                edges encode learned associations. Hover a node to probe its neighborhood.
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden mb-8"
              style={{ background: 'rgba(8,12,30,0.7)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <LatentSynthesis />
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {[
                {
                  title: 'ML · AI',
                  color: '6,182,212',
                  skills: ['PyTorch', 'PyTorch Lightning', 'scikit-learn', 'NumPy', 'Pandas', 'LlamaIndex'],
                  variant: 'cyan' as const,
                },
                {
                  title: 'Backend · DevOps',
                  color: '168,85,247',
                  skills: ['FastAPI', 'Flask', 'Docker', 'PostgreSQL', 'AWS', 'PyTest', 'GitHub Actions'],
                  variant: 'purple' as const,
                },
                {
                  title: 'Languages',
                  color: '148,163,184',
                  skills: ['Python', 'C++', 'TypeScript', 'JavaScript', 'Java', 'SQL'],
                  variant: 'outline' as const,
                },
              ].map(({ title, color, skills, variant }) => (
                <motion.div key={title} variants={fadeUp}>
                  <TiltCard style={{ ...GLASS, padding: '1.5rem' }}>
                    <h3 className="text-xs font-semibold mb-3 tracking-[0.2em] uppercase font-mono"
                      style={{ color: `rgb(${color})` }}>{title}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skills.map(s => <Badge key={s} variant={variant}>{s}</Badge>)}
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* ─── TEMPORAL CURVATURE — Career Geodesic ─── */}
          <motion.section
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-700 mb-3 font-mono">
                General Relativity · Geodesics · Spacetime Curvature
              </p>
              <h2 className="text-4xl font-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>Temporal Curvature</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed">
                Each role warps the career path around it — like mass curves spacetime.
                The glowing particle follows the geodesic.
              </p>
            </div>

            <TemporalCurvature />

            {/* Experience cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {/* Analog Devices — incoming */}
              <motion.div variants={fadeUp}>
                <TiltCard style={{ ...GLASS, borderLeft: '2px solid rgba(168,85,247,0.5)', padding: '1.75rem' }}>
                  <Badge variant="purple" className="mb-3">Incoming · Summer 2026</Badge>
                  <h3 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: '-0.01em' }}>Analog Devices</h3>
                  <p className="font-semibold mb-2 text-sm" style={{ color: '#a855f7' }}>AI/ML Intern — Graph ML &amp; Embeddings</p>
                  <p className="text-sm text-slate-500 leading-relaxed">Boston, MA</p>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    Graph-based ML and embedding models for structured circuit data.
                  </p>
                </TiltCard>
              </motion.div>

              {/* Stealth AI — current */}
              <motion.div variants={fadeUp}>
                <TiltCard style={{ ...GLASS, borderLeft: '2px solid rgba(6,182,212,0.5)', padding: '1.75rem' }}>
                  <Badge variant="cyan" className="mb-3">Current · Feb 2026 → Present</Badge>
                  <h3 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: '-0.01em' }}>Stealth AI Startup</h3>
                  <p className="font-semibold mb-4 text-sm" style={{ color: '#06b6d4' }}>ML Research Engineer</p>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li className="flex items-start">
                      <span className="mr-2 mt-0.5 text-cyan-500">▸</span>
                      Investigating inductive bias effects of CNN architectures (ResNet, ConvNeXt) on SSL representation geometry — diagnosing alignment, uniformity, and dimensional collapse
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 mt-0.5 text-cyan-500">▸</span>
                      Two-stage experimental pipeline on CIFAR/STL-10 and ImageNet with ResNet-50; developing loss regularization and augmentation interventions targeting SSL training failure modes
                    </li>
                  </ul>
                </TiltCard>
              </motion.div>
            </motion.div>

            {/* Algoverse — past */}
            <motion.div
              className="mt-5"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <TiltCard style={{ ...GLASS, borderLeft: '2px solid rgba(168,85,247,0.4)', padding: '1.75rem' }}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-grow">
                    <Badge variant="purple" className="mb-3">May 2025 – Mar 2026</Badge>
                    <h3 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: '-0.01em' }}>Algoverse AI Research</h3>
                    <p className="font-semibold mb-4 text-sm" style={{ color: '#a855f7' }}>Research Fellow · Remote</p>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-start">
                        <span className="mr-2 mt-0.5 text-purple-500">▸</span>
                        Designed distributed training infrastructure with PyTorch Lightning across 100+ model configurations, cutting experiment runtime by 30% through optimized data loading and gradient checkpointing
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-0.5 text-purple-500">▸</span>
                        Built experiment tracking and evaluation framework processing 10K+ runs, enabling systematic ablations across hyperparameter sweeps to surface statistically reliable results
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2 mt-0.5 text-purple-500">▸</span>
                        Adapted the rotation trick to TopK sparse autoencoders via custom PyTorch autograd functions, achieving <span className="text-white font-semibold">100% dictionary utilization</span> vs. baseline&apos;s 47% and <span className="text-white font-semibold">6.1× lower feature overlap</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Education */}
            <motion.div
              className="mt-5"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <TiltCard style={{ ...GLASS, padding: '2rem' }}>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: '-0.01em' }}>University of Washington</h3>
                    <p className="text-cyan-400 font-semibold text-sm">Paul G. Allen School of Computer Science &amp; Engineering</p>
                    <p className="text-slate-500 mb-4 text-sm">Bachelor of Science in Computer Science</p>
                    <div className="flex flex-wrap gap-2">
                      {['Statistical Machine Learning', 'Algorithm Design & Complexity', 'Abstract Linear Algebra', 'Real Analysis', 'Discrete Mathematics'].map(c => (
                        <Badge key={c} variant="outline">{c}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:text-right shrink-0 ml-8">
                    <Badge variant="cyan" className="mb-2">Expected June 2028</Badge>
                    <p className="text-3xl font-bold text-purple-400 font-mono">4.0 GPA</p>
                    <Badge variant="purple">Dean&apos;s List</Badge>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </motion.section>

          {/* ─── PROJECTS ─── */}
          <motion.section
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-700 mb-3 font-mono">
                Equivariance · Numerical Methods · Geometric Engineering
              </p>
              <h2 className="text-4xl font-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>Projects</h2>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {[
                {
                  title: 'Equivariant VAE for Video Generation',
                  tags: ['PyTorch', 'PyTorch Lightning', 'FastAPI', 'Docker', 'AWS'],
                  color: '6,182,212',
                  desc: 'Designed a VAE enforcing equivariance in the latent space to ensure geometric transformations in input frames correspond to predictable latent trajectories, improving temporal consistency in generated video.',
                },
                {
                  title: 'SVD & Eigendecomposition Engine',
                  tags: ['NumPy', 'Python'],
                  color: '168,85,247',
                  desc: 'Derived and implemented a full numerical linear algebra engine in pure NumPy — Gram-Schmidt QR factorization, power iteration with deflation, and two-sided Jacobi SVD. Validated against scikit-learn with residuals under 10⁻¹⁰.',
                },
              ].map(({ title, tags, color, desc }) => (
                <motion.div key={title} variants={fadeUp}>
                  <TiltCard style={{ ...GLASS, borderLeft: `2px solid rgba(${color},0.4)`, padding: '1.75rem', height: '100%' }}>
                    <h3 className="text-xl font-bold text-white mb-2" style={{ letterSpacing: '-0.01em' }}>{title}</h3>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {tags.map(t => (
                        <span key={t} className="text-xs font-mono px-2 py-0.5 rounded-md"
                          style={{ background: `rgba(${color},0.1)`, color: `rgb(${color})`, border: `1px solid rgba(${color},0.2)` }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* ─── STRUCTURAL INVARIANCE — Achievements ─── */}
          <motion.section
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-8">
              <p className="text-xs uppercase tracking-[0.35em] text-slate-700 mb-3 font-mono">
                Equivariance · Symmetry Groups · Invariant Representations
              </p>
              <h2 className="text-4xl font-bold text-white mb-4" style={{ letterSpacing: '-0.02em' }}>Structural Invariance</h2>
              <p className="text-slate-500 max-w-2xl mx-auto text-sm leading-relaxed">
                Community and recognition encoded as geometry. Toggle between force-directed graph
                and icosahedral simplicial complex — same data, different projections.
              </p>
            </div>

            <StructuralInvariance />

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {[
                {
                  title: 'Achievements',
                  color: '6,182,212',
                  items: [
                    'NSF REU — AFUS Program, NC State · Autonomous systems, edge-assisted cooperative perception for CAVs under Dr. Wujie Wen (May – Jul 2026)',
                    'Kaggle Bronze Medal — Medical Image Segmentation · Top 100 teams (top 7%), 0.87 Dice score on UW-Madison MRI segmentation',
                    "Dean's List · 4.0 GPA",
                    'Published at ICLR 2026 @ Re-Align Research Workshop',
                  ],
                },
                {
                  title: 'Involvement',
                  color: '168,85,247',
                  items: [
                    'ColorStack Member',
                    'NSBE — National Society of Black Engineers',
                    'CodePath Technical Interview Prep',
                    'Open Source Contributor',
                  ],
                },
              ].map(({ title, color, items }) => (
                <motion.div key={title} variants={fadeUp}>
                  <TiltCard style={{ ...GLASS, padding: '1.75rem' }}>
                    <h3 className="text-xs font-semibold mb-4 tracking-[0.2em] uppercase font-mono"
                      style={{ color: `rgb(${color})` }}>{title}</h3>
                    <ul className="space-y-3 text-sm text-slate-400">
                      {items.map(item => (
                        <li key={item} className="flex items-start">
                          <span className="mr-2 mt-1 shrink-0" style={{ color: `rgb(${color})` }}>·</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

        </div>
      </div>
    </>
  )
}
