import { Metadata } from 'next'
import { getAllProjects, getFeaturedProjects } from '@/lib/content'
import { sortByDate } from '@/lib/utils'
import ProjectsClient from '@/components/projects/ProjectsClient'

export const metadata: Metadata = {
  title: 'Projects | Sulayman Yusuf',
  description: 'Explore research projects and open-source contributions in geometric deep learning, ML infrastructure, and equivariant neural networks.',
}

export default function ProjectsPage() {
  const featuredProjects = getFeaturedProjects()
  const allProjects = sortByDate(getAllProjects())
  const regularProjects = allProjects.filter(p => !p.featured)

  return <ProjectsClient featuredProjects={featuredProjects} regularProjects={regularProjects} />
}
