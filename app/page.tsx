import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import GeometricCounter from '@/components/geometric/effects/GeometricCounter'
import VoronoiBackground from '@/components/geometric/backgrounds/VoronoiBackground'

// Dynamically import 3D scenes for better performance
const SparseAutoencoderFeatureSpace = dynamic(
  () => import('@/components/geometric/core/SparseAutoencoderFeatureSpace'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center bg-gradient-mesh">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-cyan-accent border-r-transparent"></div>
          <p className="mt-6 text-text-muted text-lg">Loading feature space...</p>
        </div>
      </div>
    ),
  }
)

const GradientFlowVisualization = dynamic(
  () => import('@/components/geometric/core/GradientFlowVisualization'),
  { ssr: false }
)

const EnhancedHeroScene = dynamic(
  () => import('@/components/geometric/EnhancedHeroScene'),
  { ssr: false }
)

export default function Home() {
  return (
    <>
      <VoronoiBackground />
      <div className="relative">
        {/* Hero Section - Sparse Autoencoder Feature Space */}
        <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Text Content */}
              <div className="space-y-8 text-center lg:text-left z-10">
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
                    <span className="text-text-dark dark:text-text-light">Sulayman</span>
                    <br />
                    <span className="bg-gradient-to-r from-cyan-accent-light to-purple-accent-light dark:from-cyan-accent dark:to-purple-accent bg-clip-text text-transparent">
                      Yusuf
                    </span>
                  </h1>

                  <p className="text-xl md:text-2xl text-text-muted-light dark:text-text-muted font-medium">
                    CS Researcher & ML Engineer
                  </p>

                  <p className="text-lg text-text-muted-light dark:text-text-muted max-w-xl">
                    Specializing in{' '}
                    <span className="text-cyan-accent-light dark:text-cyan-accent font-semibold">
                      Geometric Deep Learning
                    </span>{' '}
                    and{' '}
                    <span className="text-purple-accent-light dark:text-purple-accent font-semibold">
                      Mechanistic Interpretability
                    </span>
                  </p>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 justify-center lg:justify-start">
                    <Badge variant="cyan">Research Fellow @ Algoverse AI</Badge>
                  </div>
                  <div className="flex items-center space-x-2 justify-center lg:justify-start">
                    <Badge variant="purple">Student @ UW Allen School</Badge>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <Link href="/about">
                    <Button size="lg" className="group">
                      About Me
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="/publications">
                    <Button variant="outline" size="lg">
                      View Publications
                    </Button>
                  </Link>
                </div>

                {/* Social Links */}
                <div className="flex space-x-4 justify-center lg:justify-start">
                  <a
                    href="https://github.com/xyro-coder"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-light-surface dark:bg-navy-surface hover:bg-cyan-accent-light/20 dark:hover:bg-cyan-accent/20 transition-colors"
                    aria-label="GitHub"
                  >
                    <Github className="h-6 w-6 text-text-muted-light dark:text-text-muted" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/sulayman-yusuf-a84940214/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-light-surface dark:bg-navy-surface hover:bg-cyan-accent-light/20 dark:hover:bg-cyan-accent/20 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-6 w-6 text-text-muted-light dark:text-text-muted" />
                  </a>
                  <a
                    href="mailto:sulaymanyusuf.a@gmail.com"
                    className="p-3 rounded-full bg-light-surface dark:bg-navy-surface hover:bg-cyan-accent-light/20 dark:hover:bg-cyan-accent/20 transition-colors"
                    aria-label="Email"
                  >
                    <Mail className="h-6 w-6 text-text-muted-light dark:text-text-muted" />
                  </a>
                </div>
              </div>

              {/* Main Visualization - Sparse Autoencoder Feature Space */}
              <div className="relative z-10">
                <SparseAutoencoderFeatureSpace />
                <p className="text-center text-sm text-text-muted mt-4">
                  <span className="text-cyan-accent">Interactive Feature Space</span> • Sparse Autoencoder Visualization
                </p>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
            <div className="w-6 h-10 border-2 border-text-muted-light/40 dark:border-text-muted/40 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-cyan-accent rounded-full animate-pulse"></div>
            </div>
          </div>
        </section>

        {/* Current Research - Gradient Flow Visualization */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-light-surface dark:bg-navy-dark relative overflow-hidden">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <Badge variant="cyan" className="mb-4">Current Work @ Algoverse AI</Badge>
              <h2 className="text-4xl font-bold text-text-dark dark:text-text-light mb-4">
                Optimizing ML Training Pipelines
              </h2>
              <p className="text-text-muted-light dark:text-text-muted max-w-2xl mx-auto">
                Real-time gradient flow across loss landscapes • 30% faster convergence
              </p>
            </div>

            <div className="relative">
              <GradientFlowVisualization />
              <p className="text-center text-sm text-text-muted mt-4">
                <span className="text-purple-accent">Gradient Descent</span> • Loss Landscape Optimization
              </p>
            </div>
          </div>
        </section>

        {/* Geometric Stats Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-navy-dark">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-16 text-text-dark dark:text-text-light">
              Impact By The Numbers
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <GeometricCounter value={4} label="GPA" suffix=".0" color="cyan" />
              <GeometricCounter value={100} label="Model Configurations" suffix="+" color="purple" />
              <GeometricCounter value={30} label="Runtime Reduction" suffix="%" color="cyan" />
            </div>
          </div>
        </section>

        {/* Research Areas with Enhanced Visualization */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-light-surface dark:bg-navy-surface">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-4xl font-bold text-center mb-4 text-text-dark dark:text-text-light">
              Research Interests
            </h2>
            <p className="text-center text-text-muted-light dark:text-text-muted mb-12 max-w-2xl mx-auto">
              Exploring the intersection of geometry, symmetry, and machine learning
            </p>

            <div className="relative mb-16">
              <EnhancedHeroScene />
              <p className="text-center text-sm text-text-muted mt-4">
                <span className="text-cyan-accent">SO(3) Equivariance</span> • Manifold Learning • Geometric Symmetry
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card hover className="p-6 text-center bg-gradient-to-br from-cyan-accent/10 to-transparent">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-accent-light to-cyan-accent flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">∇</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text-dark dark:text-text-light">
                  Geometric Deep Learning
                </h3>
                <p className="text-text-muted-light dark:text-text-muted">
                  Neural architectures respecting geometric structure of data
                </p>
              </Card>

              <Card hover className="p-6 text-center bg-gradient-to-br from-purple-accent/10 to-transparent">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-accent-light to-purple-accent flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">⊕</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text-dark dark:text-text-light">
                  Sparse Autoencoders
                </h3>
                <p className="text-text-muted-light dark:text-text-muted">
                  Interpretable features through geometric sparsity constraints
                </p>
              </Card>

              <Card hover className="p-6 text-center bg-gradient-to-br from-cyan-accent/10 to-purple-accent/10">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-accent to-purple-accent flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">∼</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text-dark dark:text-text-light">
                  Equivariant Networks
                </h3>
                <p className="text-text-muted-light dark:text-text-muted">
                  Models preserving symmetries and transformations in data
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Featured Publication CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-navy-dark">
          <div className="container mx-auto max-w-4xl">
            <Card className="p-8 md:p-12 bg-gradient-to-br from-cyan-accent-light/10 to-purple-accent-light/10 dark:from-cyan-accent/10 dark:to-purple-accent/10 border-2 border-cyan-accent/20">
              <Badge variant="cyan" className="mb-4">Latest Publication</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-dark dark:text-text-light">
                RT-TopKSAE: Improving Top-k Sparse Autoencoders with the Rotation Trick
              </h2>
              <p className="text-text-muted-light dark:text-text-muted mb-6 text-lg">
                Under review at ICLR 2026 @ Geometric Representations and Mechanisms (GRaM) Workshop
              </p>
              <Link href="/publications">
                <Button size="lg" className="group">
                  Read More
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </Card>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-light-surface dark:bg-navy-dark">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/projects">
                <Card hover className="p-8 h-full">
                  <h3 className="text-2xl font-bold mb-3 text-text-dark dark:text-text-light">
                    Projects
                  </h3>
                  <p className="text-text-muted-light dark:text-text-muted mb-4">
                    Explore research projects and open-source contributions
                  </p>
                  <div className="flex items-center text-cyan-accent-light dark:text-cyan-accent group-hover:translate-x-2 transition-transform">
                    View Projects <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                </Card>
              </Link>

              <Link href="/publications">
                <Card hover className="p-8 h-full">
                  <h3 className="text-2xl font-bold mb-3 text-text-dark dark:text-text-light">
                    Publications
                  </h3>
                  <p className="text-text-muted-light dark:text-text-muted mb-4">
                    Research papers on geometric deep learning and interpretability
                  </p>
                  <div className="flex items-center text-purple-accent-light dark:text-purple-accent group-hover:translate-x-2 transition-transform">
                    View Research <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                </Card>
              </Link>

              <Link href="/contact">
                <Card hover className="p-8 h-full">
                  <h3 className="text-2xl font-bold mb-3 text-text-dark dark:text-text-light">
                    Get In Touch
                  </h3>
                  <p className="text-text-muted-light dark:text-text-muted mb-4">
                    Interested in collaboration? Let&apos;s connect
                  </p>
                  <div className="flex items-center text-cyan-accent-light dark:text-cyan-accent group-hover:translate-x-2 transition-transform">
                    Contact Me <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
