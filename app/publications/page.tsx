import { Metadata } from 'next'
import { FileText, ExternalLink, Code, Copy, Check } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { getAllPublications } from '@/lib/content'
import { sortByDate } from '@/lib/utils'
import CopyButton from '@/components/ui/CopyButton'

export const metadata: Metadata = {
  title: 'Publications | Sulayman Yusuf',
  description: 'Research publications on geometric deep learning, sparse autoencoders, and mechanistic interpretability.',
}

export default function PublicationsPage() {
  const publications = sortByDate(getAllPublications())
  const featuredPub = publications.find(p => p.status === 'under-review')

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-accent-light to-purple-accent-light dark:from-cyan-accent dark:to-purple-accent bg-clip-text text-transparent">
              Publications
            </span>
          </h1>
          <p className="text-xl text-text-muted-light dark:text-text-muted max-w-3xl mx-auto">
            Research contributions to geometric deep learning and mechanistic interpretability
          </p>
        </div>

        {/* Featured Publication - RT-TopKSAE */}
        {featuredPub && (
          <section className="mb-16">
            <Card className="p-8 md:p-12 border-2 border-cyan-accent-light/30 dark:border-cyan-accent/30 bg-gradient-to-br from-cyan-accent-light/5 to-purple-accent-light/5 dark:from-cyan-accent/5 dark:to-purple-accent/5">
              {/* Status Badge */}
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="cyan">Under Review</Badge>
                <Badge variant="purple">ICLR 2026 @ GRaM Workshop</Badge>
              </div>

              {/* Title */}
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-text-dark dark:text-text-light">
                {featuredPub.title}
              </h2>

              {/* Authors and Date */}
              <div className="mb-6 space-y-1">
                <p className="text-lg text-text-muted-light dark:text-text-muted">
                  <span className="font-semibold">Authors:</span> {featuredPub.authors.join(', ')}
                </p>
                <p className="text-lg text-text-muted-light dark:text-text-muted">
                  <span className="font-semibold">Venue:</span> {featuredPub.venue}
                </p>
                <p className="text-text-muted-light dark:text-text-muted">
                  {new Date(featuredPub.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                  })}
                </p>
              </div>

              {/* Abstract */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3 text-text-dark dark:text-text-light">
                  Abstract
                </h3>
                <p className="text-text-muted-light dark:text-text-muted leading-relaxed">
                  {featuredPub.abstract}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {featuredPub.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {featuredPub.arxiv && (
                  <a href={featuredPub.arxiv} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" className="w-full">
                      <ExternalLink className="mr-2 h-5 w-5" />
                      arXiv
                    </Button>
                  </a>
                )}
                {featuredPub.pdf && (
                  <a href={featuredPub.pdf} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                      <FileText className="mr-2 h-5 w-5" />
                      PDF
                    </Button>
                  </a>
                )}
                {featuredPub.code && (
                  <a href={featuredPub.code} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full">
                      <Code className="mr-2 h-5 w-5" />
                      Code
                    </Button>
                  </a>
                )}
                {featuredPub.bibtex && (
                  <CopyButton text={featuredPub.bibtex} label="BibTeX" />
                )}
              </div>

              {/* BibTeX Expandable Section */}
              {featuredPub.bibtex && (
                <details className="group">
                  <summary className="cursor-pointer list-none">
                    <div className="flex items-center justify-between p-4 bg-light-surface dark:bg-navy-dark rounded-lg hover:bg-text-muted-light/10 dark:hover:bg-text-muted/10 transition-colors">
                      <span className="font-semibold text-text-dark dark:text-text-light">
                        View BibTeX Citation
                      </span>
                      <span className="text-text-muted-light dark:text-text-muted group-open:rotate-180 transition-transform">
                        ▼
                      </span>
                    </div>
                  </summary>
                  <div className="mt-4 p-4 bg-navy-surface dark:bg-navy-dark rounded-lg">
                    <pre className="text-sm text-text-light dark:text-text-muted overflow-x-auto">
                      <code>{featuredPub.bibtex}</code>
                    </pre>
                  </div>
                </details>
              )}
            </Card>
          </section>
        )}

        {/* Other Publications List */}
        {publications.filter(p => p.slug !== featuredPub?.slug).length > 0 && (
          <section>
            <h2 className="text-3xl font-bold mb-8 text-text-dark dark:text-text-light">
              All Publications
            </h2>
            <div className="space-y-6">
              {publications
                .filter(p => p.slug !== featuredPub?.slug)
                .map((pub) => (
                  <Card key={pub.slug} hover className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-grow">
                        {/* Status Badge */}
                        <div className="mb-2">
                          <Badge
                            variant={
                              pub.status === 'published'
                                ? 'cyan'
                                : pub.status === 'under-review'
                                ? 'purple'
                                : 'default'
                            }
                          >
                            {pub.status === 'published'
                              ? 'Published'
                              : pub.status === 'under-review'
                              ? 'Under Review'
                              : 'Preprint'}
                          </Badge>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold mb-2 text-text-dark dark:text-text-light">
                          {pub.title}
                        </h3>

                        {/* Authors and Venue */}
                        <p className="text-text-muted-light dark:text-text-muted mb-2">
                          {pub.authors.join(', ')}
                        </p>
                        <p className="text-text-muted-light dark:text-text-muted font-medium mb-3">
                          {pub.venue}, {pub.year}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {pub.tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Links */}
                      <div className="flex md:flex-col gap-2">
                        {pub.arxiv && (
                          <a href={pub.arxiv} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="w-full">
                              arXiv
                            </Button>
                          </a>
                        )}
                        {pub.pdf && (
                          <a href={pub.pdf} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="w-full">
                              PDF
                            </Button>
                          </a>
                        )}
                        {pub.code && (
                          <a href={pub.code} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm" className="w-full">
                              Code
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </section>
        )}

        {/* Research Interests */}
        <section className="mt-16">
          <Card className="p-8 bg-gradient-to-r from-cyan-accent-light/10 to-purple-accent-light/10 dark:from-cyan-accent/10 dark:to-purple-accent/10">
            <h3 className="text-2xl font-bold mb-4 text-text-dark dark:text-text-light">
              Research Interests
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-text-muted-light dark:text-text-muted">
              <div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-cyan-accent mr-2">▸</span>
                    Geometric Deep Learning
                  </li>
                  <li className="flex items-center">
                    <span className="text-cyan-accent mr-2">▸</span>
                    Mechanistic Interpretability
                  </li>
                  <li className="flex items-center">
                    <span className="text-cyan-accent mr-2">▸</span>
                    Sparse Autoencoders
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-purple-accent mr-2">▸</span>
                    Equivariant Neural Networks
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-accent mr-2">▸</span>
                    ML Training Infrastructure
                  </li>
                  <li className="flex items-center">
                    <span className="text-purple-accent mr-2">▸</span>
                    Manifold Learning
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
