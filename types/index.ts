// Project types
export interface Project {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  github?: string
  demo?: string
  writeup?: string
  image?: string
  featured: boolean
  content: string
}

// Publication types
export interface Publication {
  slug: string
  title: string
  authors: string[]
  venue: string
  year: number
  status: 'published' | 'under-review' | 'preprint'
  date: string
  arxiv?: string
  pdf?: string
  code?: string
  abstract: string
  tags: string[]
  bibtex?: string
  content: string
}

// Blog post types
export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  author: string
  readTime: string
  image?: string
  draft: boolean
  content: string
}

// Frontmatter types
export interface ProjectFrontmatter {
  title: string
  description: string
  date: string
  tags: string[]
  github?: string
  demo?: string
  writeup?: string
  image?: string
  featured: boolean
}

export interface PublicationFrontmatter {
  title: string
  authors: string[]
  venue: string
  year: number
  status: 'published' | 'under-review' | 'preprint'
  date: string
  arxiv?: string
  pdf?: string
  code?: string
  abstract: string
  tags: string[]
  bibtex?: string
}

export interface BlogPostFrontmatter {
  title: string
  description: string
  date: string
  tags: string[]
  author: string
  readTime: string
  image?: string
  draft: boolean
}
