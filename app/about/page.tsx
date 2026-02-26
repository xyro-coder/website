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

export default function AboutPage() {
  return (
    <>
      <GraphNeuralNetworkBackground />
      <div className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">

          {/* ─── SECTION 1: HERO — Particle Assembly ─── */}
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
              CS Researcher &amp; ML Engineer exploring the mathematical foundations of intelligence
              through geometric deep learning
            </p>
          </motion.section>

          {/* Bio */}
          <motion.section
            className="mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <TiltCard
              style={{
                background: 'rgba(8,12,30,0.55)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: 24,
                padding: '2.5rem',
              }}
            >
              <h2 className="text-3xl font-bold mb-6 text-white" style={{ letterSpacing: '-0.02em' }}>Background</h2>
              <div className="space-y-4 text-slate-400 leading-relaxed">
                <p>
                  I&apos;m a Computer Science student at the University of Washington&apos;s Paul G.
                  Allen School of Computer Science &amp; Engineering, maintaining a 4.0 GPA while
                  pursuing research at the intersection of geometric deep learning and mechanistic
                  interpretability.
                </p>
                <p>
                  My research focuses on understanding and improving machine learning models through
                  geometric principles. I&apos;m particularly interested in{' '}
                  <span className="text-cyan-400 font-semibold">sparse autoencoders</span>,{' '}
                  <span className="text-purple-400 font-semibold">equivariant neural networks</span>,
                  and building interpretable ML systems that respect the underlying structure of data.
                </p>
                <p>
                  Currently, I&apos;m a Research Fellow at Algoverse AI, where I work on developing
                  novel approaches to sparse autoencoders and building scalable ML infrastructure.
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

          {/* ─── SECTION 2: LATENT SYNTHESIS — Skill Manifold ─── */}
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
                Your expertise isn&apos;t a list — it&apos;s a structured latent space.
                Related skills gravitate into clusters, their edges encoding learned associations.
                Hover a node to probe its neighborhood.
              </p>
            </div>

            <div className="rounded-3xl overflow-hidden mb-8"
              style={{
                background: 'rgba(8,12,30,0.7)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}>
              <LatentSynthesis />
            </div>

            {/* Skill badges */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {[
                { title: 'ML · AI', color: '6,182,212', skills: ['PyTorch', 'TensorFlow', 'PyTorch Lightning', 'scikit-learn', 'NumPy', 'Pandas', 'LlamaIndex'], variant: 'cyan' as const },
                { title: 'Backend · DevOps', color: '168,85,247', skills: ['Flask', 'FastAPI', 'Docker', 'PostgreSQL', 'AWS', 'CI/CD', 'Git'], variant: 'purple' as const },
                { title: 'Languages', color: '148,163,184', skills: ['Python', 'C++', 'TypeScript', 'Java', 'SQL', 'HTML/CSS'], variant: 'outline' as const },
              ].map(({ title, color, skills, variant }) => (
                <motion.div key={title} variants={fadeUp}>
                  <TiltCard
                    style={{
                      background: 'rgba(8,12,30,0.55)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: 20,
                      padding: '1.5rem',
                    }}
                  >
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

          {/* ─── SECTION 3: TEMPORAL CURVATURE — Career Geodesic ─── */}
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
                Time as geometry. Each research breakthrough warps the career path around it —
                like mass curves spacetime. The glowing particle follows the geodesic.
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
              {[
                {
                  badge: 'Current', badgeVariant: 'cyan' as const,
                  title: 'Algoverse AI', role: 'Research Fellow', roleColor: '#06b6d4',
                  accentColor: '6,182,212',
                  items: [
                    '30% runtime reduction across 100+ ML training configurations',
                    'Infrastructure processing 10K+ experiments with CI/CD',
                    '40% improvement in principal component retention via novel sparsity',
                  ],
                },
                {
                  badge: '2025', badgeVariant: 'purple' as const,
                  title: 'Outamation', role: 'AI Engineering Intern', roleColor: '#a855f7',
                  accentColor: '168,85,247',
                  items: [
                    '20% performance increase in document processing pipeline',
                    '75% reduction in computational overhead via LRU caching',
                    'Production-approved retrieval system with LlamaIndex',
                  ],
                },
              ].map(({ badge, badgeVariant, title, role, roleColor, accentColor, items }) => (
                <motion.div key={title} variants={fadeUp}>
                  <TiltCard
                    style={{
                      background: 'rgba(8,12,30,0.55)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderLeft: `2px solid rgba(${accentColor},0.5)`,
                      borderRadius: 20,
                      padding: '1.75rem',
                    }}
                  >
                    <Badge variant={badgeVariant} className="mb-3">{badge}</Badge>
                    <h3 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: '-0.01em' }}>{title}</h3>
                    <p className="font-semibold mb-4 text-sm" style={{ color: roleColor }}>{role}</p>
                    <ul className="space-y-2 text-sm text-slate-400">
                      {items.map(item => (
                        <li key={item} className="flex items-start">
                          <span className="mr-2 mt-0.5" style={{ color: `rgb(${accentColor})` }}>▸</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              className="mt-5"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.5 }}
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
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-1" style={{ letterSpacing: '-0.01em' }}>University of Washington</h3>
                    <p className="text-cyan-400 font-semibold text-sm">Paul G. Allen School of Computer Science &amp; Engineering</p>
                    <p className="text-slate-500 mb-4 text-sm">Bachelor of Science in Computer Science</p>
                    <div className="flex flex-wrap gap-2">
                      {['Data Structures', 'OOP', 'Database Systems', 'Machine Learning', 'Statistics', 'Calculus I-III', 'Linear Algebra'].map(c => (
                        <Badge key={c} variant="outline">{c}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:text-right shrink-0 ml-8">
                    <Badge variant="cyan" className="mb-2">Expected June 2027</Badge>
                    <p className="text-3xl font-bold text-purple-400 font-mono">4.0 GPA</p>
                    <Badge variant="purple">Dean&apos;s List</Badge>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          </motion.section>

          {/* ─── SECTION 4: STRUCTURAL INVARIANCE — Community ─── */}
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
                Community encoded as geometry. Toggle between a force-directed graph and an
                icosahedral simplicial complex — same data, different projections,
                same invariant relationships.
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
                  title: 'Academic & Professional', color: '6,182,212',
                  items: ["Dean's List · 4.0 GPA", 'ColorStack Member', 'NSBE (National Society of Black Engineers)', 'CodePath Technical Interview Prep'],
                },
                {
                  title: 'Community & Clubs', color: '168,85,247',
                  items: ['BC Math Club', 'BC Physics Club', 'BC Robotics Club', 'Open Source Contributor'],
                },
              ].map(({ title, color, items }) => (
                <motion.div key={title} variants={fadeUp}>
                  <TiltCard
                    style={{
                      background: 'rgba(8,12,30,0.55)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      borderRadius: 20,
                      padding: '1.75rem',
                    }}
                  >
                    <h3 className="text-xs font-semibold mb-4 tracking-[0.2em] uppercase font-mono"
                      style={{ color: `rgb(${color})` }}>{title}</h3>
                    <ul className="space-y-2 text-sm text-slate-400">
                      {items.map(item => (
                        <li key={item} className="flex items-center">
                          <span className="mr-2" style={{ color: `rgb(${color})` }}>·</span>{item}
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
