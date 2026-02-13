import { Metadata } from 'next'
import { getAllPublications } from '@/lib/content'
import { sortByDate } from '@/lib/utils'
import PublicationsClient from '@/components/publications/PublicationsClient'

export const metadata: Metadata = {
  title: 'Publications | Sulayman Yusuf',
  description: 'Research publications on geometric deep learning, sparse autoencoders, and mechanistic interpretability.',
}

export default function PublicationsPage() {
  const publications = sortByDate(getAllPublications())
  const featuredPub = publications.find(p => p.status === 'under-review')
  const otherPubs = publications.filter(p => p.slug !== featuredPub?.slug)

  return <PublicationsClient featuredPub={featuredPub} otherPubs={otherPubs} />
}
