'use client'

import dynamic from 'next/dynamic'

const FilmGrain = dynamic(() => import('./FilmGrain'), { ssr: false })
const ChromaticAberration = dynamic(() => import('./ChromaticAberration'), { ssr: false })

export default function CinematicOverlays() {
  return (
    <>
      <FilmGrain />
      <ChromaticAberration />
    </>
  )
}
