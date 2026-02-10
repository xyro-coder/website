import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { getBlogPostBySlug, getAllBlogPosts } from '@/lib/content'
import { formatDate } from '@/lib/utils'
import { mdxComponents } from '@/components/mdx/MDXComponents'

// Force dynamic rendering for blog posts
export const dynamic = 'force-dynamic'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} | Sulayman Yusuf`,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <article className="container mx-auto max-w-4xl">
        {/* Back Button */}
        <Link href="/blog" className="inline-block mb-8">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        {/* Header */}
        <header className="mb-12">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="cyan">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-text-dark dark:text-text-light">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-text-muted-light dark:text-text-muted pb-6 border-b border-text-muted-light/20 dark:border-text-muted/20">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              {formatDate(post.date)}
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              {post.readTime}
            </div>
            <div>
              by <span className="font-semibold text-text-dark dark:text-text-light">{post.author}</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="mdx-content prose prose-lg dark:prose-invert max-w-none">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-text-muted-light/20 dark:border-text-muted/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-text-muted-light dark:text-text-muted mb-2">
                Written by
              </p>
              <p className="text-xl font-semibold text-text-dark dark:text-text-light">
                {post.author}
              </p>
            </div>

            <Link href="/blog">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                More Posts
              </Button>
            </Link>
          </div>
        </footer>
      </article>
    </div>
  )
}
