'use client'

import dynamic from 'next/dynamic'
import Header from './Header'
import Footer from './Footer'
import PageTransitionWrapper from './PageTransitionWrapper'

const CinematicOverlays = dynamic(() => import('@/components/effects/CinematicOverlays'), { ssr: false })

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <PageTransitionWrapper>
        {children}
      </PageTransitionWrapper>
      <Footer />
      <CinematicOverlays />
    </div>
  )
}
