import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { Download } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import GraphNeuralNetworkBackground from '@/components/geometric/core/GraphNeuralNetworkBackground'

// Dynamically import 3D visualizations
const ParticleInitials = dynamic(
  () => import('@/components/geometric/effects/ParticleInitials'),
  { ssr: false }
)

const ExperienceHelix = dynamic(
  () => import('@/components/geometric/core/ExperienceHelix'),
  { ssr: false }
)

const Skills3DCluster = dynamic(
  () => import('@/components/geometric/interactive/Skills3DCluster'),
  { ssr: false }
)

const NetworkGraph = dynamic(
  () => import('@/components/geometric/interactive/NetworkGraph'),
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
          {/* Hero Section with Particle Initials */}
          <section className="mb-24 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              <span className="bg-gradient-to-r from-cyan-accent-light to-purple-accent-light dark:from-cyan-accent dark:to-purple-accent bg-clip-text text-transparent">
                About Me
              </span>
            </h1>

            <div className="mb-8">
              <ParticleInitials />
              <p className="text-center text-sm text-text-muted mt-4">
                <span className="text-cyan-accent">Particle Assembly</span> • Identity Through Geometry
              </p>
            </div>

            <p className="text-xl text-text-muted-light dark:text-text-muted max-w-3xl mx-auto">
              CS Researcher & ML Engineer exploring the mathematical foundations of intelligence through geometric deep learning
            </p>
          </section>

          {/* Bio Section */}
          <section className="mb-24">
            <Card className="p-8 bg-light-surface/50 dark:bg-navy-surface/50 backdrop-blur-sm">
              <h2 className="text-3xl font-bold mb-6 text-text-dark dark:text-text-light">Background</h2>
              <div className="space-y-4 text-text-muted-light dark:text-text-muted leading-relaxed">
                <p>
                  I&apos;m a Computer Science student at the University of Washington&apos;s Paul G. Allen School of Computer Science & Engineering, maintaining a 4.0 GPA while pursuing research at the intersection of geometric deep learning and mechanistic interpretability.
                </p>
                <p>
                  My research focuses on understanding and improving machine learning models through geometric principles. I&apos;m particularly interested in <span className="text-cyan-accent-light dark:text-cyan-accent font-semibold">sparse autoencoders</span>, <span className="text-purple-accent-light dark:text-purple-accent font-semibold">equivariant neural networks</span>, and building interpretable ML systems that respect the underlying structure of data.
                </p>
                <p>
                  Currently, I&apos;m a Research Fellow at Algoverse AI, where I work on developing novel approaches to sparse autoencoders and building scalable ML infrastructure. My work combines theoretical insights from geometric deep learning with practical engineering to create more efficient and interpretable models.
                </p>
              </div>

              {/* Download Resume */}
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

          {/* Journey Helix - Education & Experience Combined */}
          <section className="mb-24">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-text-dark dark:text-text-light mb-4">
                My Journey
              </h2>
              <p className="text-text-muted-light dark:text-text-muted max-w-2xl mx-auto">
                A helical path through education and experience • Time as geometric structure
              </p>
            </div>

            <div className="mb-8">
              <ExperienceHelix />
              <p className="text-center text-sm text-text-muted mt-4">
                <span className="text-cyan-accent">Temporal Helix</span> • Career Trajectory Through 3D Space
              </p>
            </div>

            {/* Detailed Experience Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <Card className="p-6 bg-gradient-to-br from-cyan-accent/10 to-transparent">
                <Badge variant="cyan" className="mb-3">Current</Badge>
                <h3 className="text-2xl font-bold text-text-dark dark:text-text-light mb-2">
                  Algoverse AI
                </h3>
                <p className="text-lg text-cyan-accent-light dark:text-cyan-accent font-semibold mb-4">
                  Research Fellow
                </p>
                <ul className="space-y-2 text-sm text-text-muted-light dark:text-text-muted">
                  <li className="flex items-start">
                    <span className="text-cyan-accent mr-2 mt-1">▸</span>
                    <span>30% runtime reduction across 100+ ML training configurations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-accent mr-2 mt-1">▸</span>
                    <span>Built infrastructure processing 10K+ experiments with CI/CD</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-accent mr-2 mt-1">▸</span>
                    <span>40% improvement in principal component retention via novel sparsity methods</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-accent/10 to-transparent">
                <Badge variant="purple" className="mb-3">2025</Badge>
                <h3 className="text-2xl font-bold text-text-dark dark:text-text-light mb-2">
                  Outamation
                </h3>
                <p className="text-lg text-purple-accent-light dark:text-purple-accent font-semibold mb-4">
                  AI Engineering Intern
                </p>
                <ul className="space-y-2 text-sm text-text-muted-light dark:text-text-muted">
                  <li className="flex items-start">
                    <span className="text-purple-accent mr-2 mt-1">▸</span>
                    <span>20% performance increase in document processing pipeline</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-accent mr-2 mt-1">▸</span>
                    <span>75% reduction in computational overhead via LRU caching</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-accent mr-2 mt-1">▸</span>
                    <span>Production-approved retrieval system with LlamaIndex</span>
                  </li>
                </ul>
              </Card>
            </div>

            {/* Education Details */}
            <Card className="p-8 mt-6 bg-gradient-to-br from-cyan-accent/5 to-purple-accent/5">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-text-dark dark:text-text-light mb-2">
                    University of Washington
                  </h3>
                  <p className="text-lg text-cyan-accent-light dark:text-cyan-accent font-semibold">
                    Paul G. Allen School of Computer Science & Engineering
                  </p>
                  <p className="text-text-muted-light dark:text-text-muted mb-4">
                    Bachelor of Science in Computer Science
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Data Structures & Algorithms',
                      'Object-Oriented Programming',
                      'Database Systems',
                      'Machine Learning',
                      'Statistics',
                      'Calculus I-III',
                      'Linear Algebra',
                    ].map((course) => (
                      <Badge key={course} variant="outline">
                        {course}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-4 md:mt-0 text-left md:text-right">
                  <Badge variant="cyan" className="mb-2">Expected June 2027</Badge>
                  <p className="text-3xl font-bold text-purple-accent-light dark:text-purple-accent">4.0 GPA</p>
                  <Badge variant="purple">Dean&apos;s List</Badge>
                </div>
              </div>
            </Card>
          </section>

          {/* Technical Skills - 3D Cluster Visualization */}
          <section className="mb-24">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-text-dark dark:text-text-light mb-4">
                Technical Skills
              </h2>
              <p className="text-text-muted-light dark:text-text-muted max-w-2xl mx-auto">
                Interactive 3D network of technical proficiencies • Size represents mastery
              </p>
            </div>

            <div className="mb-8">
              <Skills3DCluster />
            </div>

            {/* Skills breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 bg-gradient-to-br from-cyan-accent/10 to-transparent">
                <h3 className="text-xl font-semibold mb-4 text-cyan-accent-light dark:text-cyan-accent">
                  ML & AI
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'PyTorch',
                    'TensorFlow',
                    'PyTorch Lightning',
                    'scikit-learn',
                    'NumPy',
                    'Pandas',
                    'LlamaIndex',
                  ].map((skill) => (
                    <Badge key={skill} variant="cyan">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-accent/10 to-transparent">
                <h3 className="text-xl font-semibold mb-4 text-purple-accent-light dark:text-purple-accent">
                  Backend & DevOps
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Flask',
                    'FastAPI',
                    'Git/GitHub',
                    'CI/CD',
                    'PostgreSQL',
                    'Docker',
                    'AWS',
                  ].map((skill) => (
                    <Badge key={skill} variant="purple">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-cyan-accent/5 to-purple-accent/5">
                <h3 className="text-xl font-semibold mb-4 text-text-dark dark:text-text-light">
                  Programming Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Python', 'Java', 'C++', 'TypeScript', 'JavaScript', 'SQL', 'HTML/CSS'].map((skill) => (
                    <Badge key={skill} variant="outline">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          {/* Involvement & Leadership - Network Graph */}
          <section className="mb-24">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-text-dark dark:text-text-light mb-4">
                Involvement & Leadership
              </h2>
              <p className="text-text-muted-light dark:text-text-muted max-w-2xl mx-auto">
                Force-directed network of community connections • Nodes represent organizations
              </p>
            </div>

            <div className="mb-8">
              <NetworkGraph />
              <p className="text-center text-sm text-text-muted mt-4">
                <span className="text-cyan-accent">Network Dynamics</span> • Community Through Graph Theory
              </p>
            </div>

            {/* Involvement Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 bg-gradient-to-br from-cyan-accent/10 to-transparent">
                <h3 className="text-xl font-semibold text-text-dark dark:text-text-light mb-4">
                  Academic & Professional
                </h3>
                <ul className="space-y-2 text-text-muted-light dark:text-text-muted">
                  <li className="flex items-center">
                    <span className="text-cyan-accent mr-2">•</span>
                    Dean&apos;s List - 4.0 GPA
                  </li>
                  <li className="flex items-center">
                    <span className="text-cyan-accent mr-2">•</span>
                    ColorStack Member
                  </li>
                  <li className="flex items-center">
                    <span className="text-cyan-accent mr-2">•</span>
                    NBSE (National Society of Black Engineers)
                  </li>
                  <li className="flex items-center">
                    <span className="text-cyan-accent mr-2">•</span>
                    CodePath Technical Interview Prep
                  </li>
                </ul>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-accent/10 to-transparent">
                <h3 className="text-xl font-semibold text-text-dark dark:text-text-light mb-4">
                  Community & Clubs
                </h3>
                <ul className="space-y-2 text-text-muted-light dark:text-text-muted">
                  <li className="flex items-center">
                    <span className="text-purple-accent mr-2">•</span>
                    BC Math Club
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-accent mr-2">•</span>
                    BC Physics Club
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-accent mr-2">•</span>
                    BC Robotics Club
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-accent mr-2">•</span>
                    Open Source Contributor
                  </li>
                </ul>
              </Card>
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
