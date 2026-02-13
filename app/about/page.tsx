import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Download } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import GraphNeuralNetworkBackground from '@/components/geometric/core/GraphNeuralNetworkBackground'

// Dynamically import visualizations (canvas/WebGL — no SSR)
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

export const metadata: Metadata = {
  title: 'About | Sulayman Yusuf',
  description: 'Learn more about Sulayman Yusuf - Computer Science researcher and ML engineer specializing in geometric deep learning and mechanistic interpretability.',
}

export default function AboutPage() {
  return (
    <>
      <GraphNeuralNetworkBackground />
      <div className="relative min-h-screen py-24 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">

          {/* ─── SECTION 1: HERO — Particle Assembly ─── */}
          <section className="mb-24 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                About Me
              </span>
            </h1>

            <div className="mb-8">
              <ParticleInitials />
              <p className="text-center text-sm text-slate-500 mt-4">
                <span className="text-cyan-400">Particle Assembly</span> • Identity Through Geometry
              </p>
            </div>

            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              CS Researcher &amp; ML Engineer exploring the mathematical foundations of intelligence
              through geometric deep learning
            </p>
          </section>

          {/* Bio */}
          <section className="mb-24">
            <Card className="p-8 bg-slate-900/50 backdrop-blur-sm border-slate-800">
              <h2 className="text-3xl font-bold mb-6 text-white">Background</h2>
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
                <a href="/resume/resume.pdf" download>
                  <Button size="lg" className="group">
                    <Download className="mr-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
                    Download Resume
                  </Button>
                </a>
              </div>
            </Card>
          </section>

          {/* ─── SECTION 2: LATENT SYNTHESIS — Skill Manifold ─── */}
          <section className="mb-24">
            <div className="text-center mb-8">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-600 mb-3">
                Manifold Hypothesis · Relational Bias · Force-Directed Clustering
              </p>
              <h2 className="text-4xl font-bold text-white mb-4">Latent Synthesis</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm">
                Your expertise isn&apos;t a list — it&apos;s a structured latent space.
                Related skills gravitate into clusters, their edges encoding learned associations.
                Hover a node to probe its neighborhood.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800/50 overflow-hidden bg-[#080c1e]/80 mb-8">
              <LatentSynthesis />
            </div>

            {/* Skill badges — subordinate to the visualization */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-5 bg-slate-900/50 border-slate-800">
                <h3 className="text-sm font-semibold mb-3 text-cyan-400 tracking-widest uppercase">ML · AI</h3>
                <div className="flex flex-wrap gap-2">
                  {['PyTorch', 'TensorFlow', 'PyTorch Lightning', 'scikit-learn', 'NumPy', 'Pandas', 'LlamaIndex'].map(s => (
                    <Badge key={s} variant="cyan">{s}</Badge>
                  ))}
                </div>
              </Card>
              <Card className="p-5 bg-slate-900/50 border-slate-800">
                <h3 className="text-sm font-semibold mb-3 text-purple-400 tracking-widest uppercase">Backend · DevOps</h3>
                <div className="flex flex-wrap gap-2">
                  {['Flask', 'FastAPI', 'Docker', 'PostgreSQL', 'AWS', 'CI/CD', 'Git'].map(s => (
                    <Badge key={s} variant="purple">{s}</Badge>
                  ))}
                </div>
              </Card>
              <Card className="p-5 bg-slate-900/50 border-slate-800">
                <h3 className="text-sm font-semibold mb-3 text-slate-300 tracking-widest uppercase">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'C++', 'TypeScript', 'Java', 'SQL', 'HTML/CSS'].map(s => (
                    <Badge key={s} variant="outline">{s}</Badge>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          {/* ─── SECTION 3: TEMPORAL CURVATURE — Career Geodesic ─── */}
          <section className="mb-24">
            <div className="text-center mb-8">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-600 mb-3">
                General Relativity · Geodesics · Spacetime Curvature
              </p>
              <h2 className="text-4xl font-bold text-white mb-4">Temporal Curvature</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm">
                Time as geometry. Each research breakthrough warps the career path around it —
                like mass curves spacetime. The glowing particle follows the geodesic,
                the shortest path on this curved surface.
              </p>
            </div>

            <TemporalCurvature />

            {/* Experience cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card className="p-6 bg-slate-900/50 border-slate-800 border-l-2 border-l-cyan-500/60">
                <Badge variant="cyan" className="mb-3">Current</Badge>
                <h3 className="text-2xl font-bold text-white mb-1">Algoverse AI</h3>
                <p className="text-cyan-400 font-semibold mb-4">Research Fellow</p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-start"><span className="text-cyan-500 mr-2 mt-0.5">▸</span>30% runtime reduction across 100+ ML training configurations</li>
                  <li className="flex items-start"><span className="text-cyan-500 mr-2 mt-0.5">▸</span>Infrastructure processing 10K+ experiments with CI/CD</li>
                  <li className="flex items-start"><span className="text-cyan-500 mr-2 mt-0.5">▸</span>40% improvement in principal component retention via novel sparsity</li>
                </ul>
              </Card>
              <Card className="p-6 bg-slate-900/50 border-slate-800 border-l-2 border-l-purple-500/60">
                <Badge variant="purple" className="mb-3">2025</Badge>
                <h3 className="text-2xl font-bold text-white mb-1">Outamation</h3>
                <p className="text-purple-400 font-semibold mb-4">AI Engineering Intern</p>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li className="flex items-start"><span className="text-purple-500 mr-2 mt-0.5">▸</span>20% performance increase in document processing pipeline</li>
                  <li className="flex items-start"><span className="text-purple-500 mr-2 mt-0.5">▸</span>75% reduction in computational overhead via LRU caching</li>
                  <li className="flex items-start"><span className="text-purple-500 mr-2 mt-0.5">▸</span>Production-approved retrieval system with LlamaIndex</li>
                </ul>
              </Card>
            </div>

            <Card className="p-8 mt-6 bg-slate-900/50 border-slate-800">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">University of Washington</h3>
                  <p className="text-cyan-400 font-semibold">Paul G. Allen School of Computer Science &amp; Engineering</p>
                  <p className="text-slate-400 mb-4">Bachelor of Science in Computer Science</p>
                  <div className="flex flex-wrap gap-2">
                    {['Data Structures', 'OOP', 'Database Systems', 'Machine Learning', 'Statistics', 'Calculus I-III', 'Linear Algebra'].map(c => (
                      <Badge key={c} variant="outline">{c}</Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 md:text-right shrink-0 ml-8">
                  <Badge variant="cyan" className="mb-2">Expected June 2027</Badge>
                  <p className="text-3xl font-bold text-purple-400">4.0 GPA</p>
                  <Badge variant="purple">Dean&apos;s List</Badge>
                </div>
              </div>
            </Card>
          </section>

          {/* ─── SECTION 4: STRUCTURAL INVARIANCE — Community ─── */}
          <section className="mb-24">
            <div className="text-center mb-8">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-600 mb-3">
                Equivariance · Symmetry Groups · Invariant Representations
              </p>
              <h2 className="text-4xl font-bold text-white mb-4">Structural Invariance</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-sm">
                Community encoded as geometry. Toggle between a force-directed graph and an
                icosahedral simplicial complex — same data, different projections,
                same invariant relationships.
              </p>
            </div>

            <StructuralInvariance />

            {/* Involvement details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <Card className="p-6 bg-slate-900/50 border-slate-800">
                <h3 className="text-sm font-semibold mb-4 text-cyan-400 tracking-widest uppercase">Academic &amp; Professional</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  {["Dean's List · 4.0 GPA", 'ColorStack Member', 'NSBE (National Society of Black Engineers)', 'CodePath Technical Interview Prep'].map(item => (
                    <li key={item} className="flex items-center">
                      <span className="text-cyan-500 mr-2">•</span>{item}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="p-6 bg-slate-900/50 border-slate-800">
                <h3 className="text-sm font-semibold mb-4 text-purple-400 tracking-widest uppercase">Community &amp; Clubs</h3>
                <ul className="space-y-2 text-sm text-slate-400">
                  {['BC Math Club', 'BC Physics Club', 'BC Robotics Club', 'Open Source Contributor'].map(item => (
                    <li key={item} className="flex items-center">
                      <span className="text-purple-500 mr-2">•</span>{item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}
