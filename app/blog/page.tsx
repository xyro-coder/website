import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { getAllBlogPosts } from '@/lib/content'
import { sortByDate, formatDate } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Blog | Sulayman Yusuf',
  description: 'Technical articles and insights on geometric deep learning, ML infrastructure, and research.',
}

export default function BlogPage() {
  const posts = sortByDate(getAllBlogPosts())

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-cyan-accent-light to-purple-accent-light dark:from-cyan-accent dark:to-purple-accent bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="text-xl text-text-muted-light dark:text-text-muted max-w-2xl mx-auto">
            Technical deep-dives, research insights, and thoughts on machine learning
          </p>
        </div>

        {/* Blog Posts List */}
        {posts.length > 0 ? (
          <div className="space-y-8">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <Card hover className="p-6 md:p-8">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="cyan">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl md:text-3xl font-bold mb-3 text-text-dark dark:text-text-light group-hover:text-cyan-accent-light dark:group-hover:text-cyan-accent transition-colors">
                    {post.title}
                  </h2>

                  {/* Description */}
                  <p className="text-text-muted-light dark:text-text-muted mb-4 leading-relaxed">
                    {post.description}
                  </p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted-light dark:text-text-muted">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {formatDate(post.date)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {post.readTime}
                    </div>
                    <div>
                      by {post.author}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-xl text-text-muted-light dark:text-text-muted">
              Blog posts coming soon! Check back later for technical articles and research insights.
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}
