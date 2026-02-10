import { Metadata } from 'next'
import { Download, GraduationCap, Briefcase, Code, Award } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'About | Sulayman Yusuf',
  description: 'Learn more about Sulayman Yusuf - Computer Science researcher and ML engineer specializing in geometric deep learning and mechanistic interpretability.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-accent-light to-purple-accent-light dark:from-cyan-accent dark:to-purple-accent bg-clip-text text-transparent">
              About Me
            </span>
          </h1>
          <p className="text-xl text-text-muted-light dark:text-text-muted max-w-3xl mx-auto">
            CS Researcher & ML Engineer exploring the mathematical foundations of intelligence through geometric deep learning
          </p>
        </div>

        {/* Bio Section */}
        <section className="mb-16">
          <Card className="p-8">
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

        {/* Education Section */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <GraduationCap className="h-8 w-8 mr-3 text-cyan-accent-light dark:text-cyan-accent" />
            <h2 className="text-3xl font-bold text-text-dark dark:text-text-light">Education</h2>
          </div>

          <Card className="p-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-text-dark dark:text-text-light">
                  University of Washington
                </h3>
                <p className="text-lg text-cyan-accent-light dark:text-cyan-accent font-semibold">
                  Paul G. Allen School of Computer Science & Engineering
                </p>
                <p className="text-text-muted-light dark:text-text-muted">
                  Bachelor of Science in Computer Science
                </p>
              </div>
              <div className="mt-4 md:mt-0 text-left md:text-right">
                <Badge variant="cyan" className="mb-2">Expected June 2027</Badge>
                <p className="text-2xl font-bold text-purple-accent-light dark:text-purple-accent">4.0 GPA</p>
                <Badge variant="purple">Dean&apos;s List</Badge>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-text-dark dark:text-text-light mb-3">Relevant Coursework:</h4>
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
          </Card>
        </section>

        {/* Experience Section */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Briefcase className="h-8 w-8 mr-3 text-purple-accent-light dark:text-purple-accent" />
            <h2 className="text-3xl font-bold text-text-dark dark:text-text-light">Experience</h2>
          </div>

          <div className="space-y-6">
            {/* Algoverse AI */}
            <Card className="p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-text-dark dark:text-text-light">
                    Algoverse AI
                  </h3>
                  <p className="text-lg text-cyan-accent-light dark:text-cyan-accent font-semibold">
                    Research Fellow
                  </p>
                  <p className="text-text-muted-light dark:text-text-muted">Remote</p>
                </div>
                <Badge variant="cyan">Sep 2025 - Present</Badge>
              </div>

              <ul className="space-y-3 text-text-muted-light dark:text-text-muted">
                <li className="flex items-start">
                  <span className="text-cyan-accent mr-2 mt-1">▸</span>
                  <span>
                    Architected and deployed scalable ML training pipelines using PyTorch Lightning and distributed training, reducing experiment runtime by 30% through optimized data loading and fault-tolerant execution across 100+ model configurations
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-accent mr-2 mt-1">▸</span>
                  <span>
                    Built production-grade benchmarking infrastructure processing 10K+ experiments, implementing CI/CD workflows and automated testing with PyTest to ensure system reliability and maintainability in collaborative team environment
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-cyan-accent mr-2 mt-1">▸</span>
                  <span>
                    Developed novel gradient-preserving sparsity method using custom PyTorch autograd functions, improving principal component retention by 40% while collaborating with team of 3 researchers using Git workflows and code reviews
                  </span>
                </li>
              </ul>
            </Card>

            {/* Outamation */}
            <Card className="p-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-text-dark dark:text-text-light">
                    Outamation
                  </h3>
                  <p className="text-lg text-purple-accent-light dark:text-purple-accent font-semibold">
                    AI Engineering Intern
                  </p>
                  <p className="text-text-muted-light dark:text-text-muted">Remote</p>
                </div>
                <Badge variant="purple">Jan 2025 - Mar 2025</Badge>
              </div>

              <ul className="space-y-3 text-text-muted-light dark:text-text-muted">
                <li className="flex items-start">
                  <span className="text-purple-accent mr-2 mt-1">▸</span>
                  <span>
                    Optimized production document processing pipeline through algorithmic improvements and LRU caching strategy, achieving 20% performance increase and 75% reduction in computational overhead for high-throughput workflows
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-accent mr-2 mt-1">▸</span>
                  <span>
                    Engineered context-aware retrieval system using LlamaIndex and AI-powered tools, improving accuracy by 20% with memory-efficient design approved for production deployment, while participating in code reviews and maintaining technical documentation
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* Technical Skills Section */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Code className="h-8 w-8 mr-3 text-cyan-accent-light dark:text-cyan-accent" />
            <h2 className="text-3xl font-bold text-text-dark dark:text-text-light">Technical Skills</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-cyan-accent-light dark:text-cyan-accent">
                Programming Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {['Python', 'Java', 'C++', 'TypeScript', 'JavaScript', 'SQL', 'HTML/CSS'].map((skill) => (
                  <Badge key={skill} variant="cyan">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-purple-accent-light dark:text-purple-accent">
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
                  <Badge key={skill} variant="purple">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4 text-cyan-accent-light dark:text-cyan-accent">
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
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Involvement & Leadership */}
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <Award className="h-8 w-8 mr-3 text-purple-accent-light dark:text-purple-accent" />
            <h2 className="text-3xl font-bold text-text-dark dark:text-text-light">
              Involvement & Leadership
            </h2>
          </div>

          <Card className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-3">
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
              </div>

              <div>
                <h3 className="text-lg font-semibold text-text-dark dark:text-text-light mb-3">
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
              </div>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}
