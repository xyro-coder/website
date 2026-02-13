'use client'

import Link from 'next/link'
import { ExternalLink, Github, FileText } from 'lucide-react'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { Project } from '@/types'

const SO3EquivariantMesh = dynamic(
  () => import('@/components/geometric/projects/SO3EquivariantMesh'),
  { ssr: false }
)

function FeaturedProjectCard({ project }: { project: Project }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="relative overflow-hidden rounded-3xl"
      style={{ background: 'rgba(8, 12, 30, 0.7)', minHeight: 520 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <SO3EquivariantMesh hovered={hovered} />

      <div
        className="relative z-10 p-8 md:p-12"
        style={{
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.05)',
          borderRadius: 'inherit',
        }}
      >
        <Badge variant="cyan" className="mb-4">Featured</Badge>
        <h3
          className="text-3xl md:text-4xl font-bold mb-4 text-white"
          style={{ textShadow: '0 0 40px rgba(6,182,212,0.3)' }}
        >
          {project.title}
        </h3>
        <p className="text-lg text-slate-400 mb-6">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="prose prose-sm prose-invert max-w-none text-slate-400">
            <div dangerouslySetInnerHTML={{ __html: project.content.replace(/\n/g, '<br/>') }} />
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-widest text-slate-600">Key Metrics</p>
            {[
              { value: '7×', label: 'Speed improvement vs. baseline', color: 'cyan' },
              { value: 'SO(3)', label: 'Equivariant architecture', color: 'purple' },
              { value: '100+', label: 'Training configurations evaluated', color: 'cyan' },
            ].map(({ value, label, color }) => (
              <div
                key={label}
                className="flex items-baseline gap-3"
                style={{
                  padding: '12px 16px',
                  background: color === 'cyan' ? 'rgba(6,182,212,0.05)' : 'rgba(168,85,247,0.05)',
                  borderLeft: `2px solid ${color === 'cyan' ? 'rgba(6,182,212,0.4)' : 'rgba(168,85,247,0.4)'}`,
                  borderRadius: '0 8px 8px 0',
                }}
              >
                <span className={`text-2xl font-bold ${color === 'cyan' ? 'text-cyan-400' : 'text-purple-400'}`}>
                  {value}
                </span>
                <span className="text-sm text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {project.github && (
            <a href={project.github} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" className="group">
                <Github className="mr-2 h-5 w-5" />View Code
              </Button>
            </a>
          )}
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="group">
                <ExternalLink className="mr-2 h-5 w-5" />Live Demo
              </Button>
            </a>
          )}
          {project.writeup && (
            <a href={project.writeup} target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" className="group">
                <FileText className="mr-2 h-5 w-5" />Technical Writeup
              </Button>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

interface Props {
  featuredProjects: Project[]
  regularProjects: Project[]
}

export default function ProjectsClient({ featuredProjects, regularProjects }: Props) {
  return (
    <div className="bg-[#080c1e] min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">

        <div className="mb-16 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-600 mb-4">
            Invariant Frame · Equivariant Representations · Geometric Architectures
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 100%)' }}>
              Projects
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Research projects and open-source work at the intersection of geometric deep learning
            and ML engineering
          </p>
        </div>

        {featuredProjects.length > 0 && (
          <section className="mb-16">
            <p className="text-xs uppercase tracking-widest text-slate-600 mb-6">Featured</p>
            {featuredProjects.map(project => (
              <FeaturedProjectCard key={project.slug} project={project} />
            ))}
          </section>
        )}

        {regularProjects.length > 0 && (
          <section>
            <p className="text-xs uppercase tracking-widest text-slate-600 mb-6">All Projects</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {regularProjects.map(project => (
                <div
                  key={project.slug}
                  className="group relative rounded-2xl overflow-hidden transition-all duration-300"
                  style={{
                    background: 'rgba(8, 12, 30, 0.8)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.2)' }} />
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-300 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-slate-400 mb-4 text-sm">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tags.slice(0, 3).map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
                        {project.tags.length > 3 && <Badge variant="outline">+{project.tags.length - 3}</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-white/5">
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noopener noreferrer"
                          className="text-slate-500 hover:text-cyan-400 transition-colors" aria-label="GitHub">
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                      {project.demo && (
                        <a href={project.demo} target="_blank" rel="noopener noreferrer"
                          className="text-slate-500 hover:text-purple-400 transition-colors" aria-label="Demo">
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                      {project.writeup && (
                        <a href={project.writeup} target="_blank" rel="noopener noreferrer"
                          className="text-slate-500 hover:text-cyan-400 transition-colors" aria-label="Writeup">
                          <FileText className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {featuredProjects.length === 0 && regularProjects.length === 0 && (
          <div className="text-center py-20 text-slate-500">More projects coming soon.</div>
        )}

        <div className="mt-16 text-center">
          <div className="inline-block p-px rounded-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(6,182,212,0.3), rgba(168,85,247,0.3))' }}>
            <div className="rounded-2xl px-10 py-8" style={{ background: 'rgba(8,12,30,0.9)', backdropFilter: 'blur(12px)' }}>
              <h3 className="text-2xl font-bold text-white mb-4">Interested in collaboration?</h3>
              <p className="text-slate-400 mb-6">I&apos;m always open to discussing new research ideas in geometric deep learning.</p>
              <Link href="/contact"><Button size="lg">Get In Touch</Button></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
