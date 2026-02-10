import { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, Github, FileText } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { getAllProjects, getFeaturedProjects } from '@/lib/content'
import { sortByDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Projects | Sulayman Yusuf',
  description: 'Explore research projects and open-source contributions in geometric deep learning, ML infrastructure, and equivariant neural networks.',
}

export default function ProjectsPage() {
  const featuredProjects = getFeaturedProjects()
  const allProjects = sortByDate(getAllProjects())
  const regularProjects = allProjects.filter(p => !p.featured)

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-accent-light to-purple-accent-light dark:from-cyan-accent dark:to-purple-accent bg-clip-text text-transparent">
              Projects
            </span>
          </h1>
          <p className="text-xl text-text-muted-light dark:text-text-muted max-w-3xl mx-auto">
            Research projects and open-source contributions at the intersection of geometric deep learning and ML engineering
          </p>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-text-dark dark:text-text-light">
              Featured Project
            </h2>
            {featuredProjects.map((project) => (
              <Card key={project.slug} className="p-8 md:p-12 bg-gradient-to-br from-cyan-accent-light/10 to-purple-accent-light/10 dark:from-cyan-accent/10 dark:to-purple-accent/10">
                <Badge variant="cyan" className="mb-4">Featured</Badge>
                <h3 className="text-3xl md:text-4xl font-bold mb-4 text-text-dark dark:text-text-light">
                  {project.title}
                </h3>
                <p className="text-lg text-text-muted-light dark:text-text-muted mb-6">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none mb-8 text-text-muted-light dark:text-text-muted">
                  <div dangerouslySetInnerHTML={{ __html: project.content.replace(/\n/g, '<br/>') }} />
                </div>

                {/* Links */}
                <div className="flex flex-wrap gap-4">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Button variant="primary" className="group">
                        <Github className="mr-2 h-5 w-5" />
                        View Code
                      </Button>
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="group">
                        <ExternalLink className="mr-2 h-5 w-5" />
                        Live Demo
                      </Button>
                    </a>
                  )}
                  {project.writeup && (
                    <a href={project.writeup} target="_blank" rel="noopener noreferrer">
                      <Button variant="secondary" className="group">
                        <FileText className="mr-2 h-5 w-5" />
                        Technical Writeup
                      </Button>
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </section>
        )}

        {/* All Projects Grid */}
        {regularProjects.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8 text-text-dark dark:text-text-light">
              All Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regularProjects.map((project) => (
                <Card key={project.slug} hover className="p-6 flex flex-col h-full">
                  <div className="flex-grow">
                    <h3 className="text-2xl font-bold mb-3 text-text-dark dark:text-text-light">
                      {project.title}
                    </h3>
                    <p className="text-text-muted-light dark:text-text-muted mb-4">
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                      {project.tags.length > 3 && (
                        <Badge variant="outline">+{project.tags.length - 3} more</Badge>
                      )}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex gap-3 pt-4 border-t border-text-muted-light/20 dark:border-text-muted/20">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-muted-light dark:text-text-muted hover:text-cyan-accent-light dark:hover:text-cyan-accent transition-colors"
                        aria-label="View code"
                      >
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-muted-light dark:text-text-muted hover:text-purple-accent-light dark:hover:text-purple-accent transition-colors"
                        aria-label="View demo"
                      >
                        <ExternalLink className="h-5 w-5" />
                      </a>
                    )}
                    {project.writeup && (
                      <a
                        href={project.writeup}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-muted-light dark:text-text-muted hover:text-cyan-accent-light dark:hover:text-cyan-accent transition-colors"
                        aria-label="Read writeup"
                      >
                        <FileText className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {allProjects.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-xl text-text-muted-light dark:text-text-muted">
              More projects coming soon! Check back later.
            </p>
          </Card>
        )}

        {/* CTA */}
        <div className="mt-16 text-center">
          <Card className="p-8 bg-gradient-to-r from-cyan-accent-light/10 to-purple-accent-light/10 dark:from-cyan-accent/10 dark:to-purple-accent/10">
            <h3 className="text-2xl font-bold mb-4 text-text-dark dark:text-text-light">
              Interested in collaboration?
            </h3>
            <p className="text-text-muted-light dark:text-text-muted mb-6">
              I&apos;m always open to discussing new research ideas and projects in geometric deep learning.
            </p>
            <Link href="/contact">
              <Button size="lg">Get In Touch</Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  )
}
