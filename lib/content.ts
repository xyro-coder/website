import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Project, Publication, BlogPost, ProjectFrontmatter, PublicationFrontmatter, BlogPostFrontmatter } from '@/types'

const contentDirectory = path.join(process.cwd(), 'content')

// Generic function to get all content of a type
function getContentByType<T>(type: 'projects' | 'publications' | 'blog'): T[] {
  const typeDirectory = path.join(contentDirectory, type)

  if (!fs.existsSync(typeDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(typeDirectory)
  const allContent = fileNames
    .filter(fileName =>
      (fileName.endsWith('.md') || fileName.endsWith('.mdx')) &&
      !fileName.startsWith('_')  // Exclude template files
    )
    .map(fileName => {
      const slug = fileName.replace(/\.mdx?$/, '')
      const fullPath = path.join(typeDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        ...data,
        content,
      } as T
    })

  return allContent
}

// Projects
export function getAllProjects(): Project[] {
  return getContentByType<Project>('projects')
}

export function getProjectBySlug(slug: string): Project | null {
  try {
    const fullPath = path.join(contentDirectory, 'projects', `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      ...(data as ProjectFrontmatter),
      content,
    }
  } catch {
    return null
  }
}

export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter(project => project.featured)
}

// Publications
export function getAllPublications(): Publication[] {
  return getContentByType<Publication>('publications')
}

export function getPublicationBySlug(slug: string): Publication | null {
  try {
    const fullPath = path.join(contentDirectory, 'publications', `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      ...(data as PublicationFrontmatter),
      content,
    }
  } catch {
    return null
  }
}

// Blog posts
export function getAllBlogPosts(): BlogPost[] {
  return getContentByType<BlogPost>('blog').filter(post => !post.draft)
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(contentDirectory, 'blog', `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      ...(data as BlogPostFrontmatter),
      content,
    }
  } catch {
    return null
  }
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  return getAllBlogPosts().filter(post => post.tags.includes(tag))
}
