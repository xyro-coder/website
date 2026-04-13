'use client'

import dynamic from 'next/dynamic'
import SchlierenFilter from './SchlierenFilter'
import CRTScanlines from './CRTScanlines'

const FilmGrain = dynamic(() => import('./FilmGrain'), { ssr: false })
const ChromaticAberration = dynamic(() => import('./ChromaticAberration'), { ssr: false })
const ScrollVelocityBlur = dynamic(() => import('./ScrollVelocityBlur'), { ssr: false })

export default function CinematicOverlays() {
  return (
    <>
      <SchlierenFilter />
      <ScrollVelocityBlur />
      <FilmGrain />
      <ChromaticAberration />
      <CRTScanlines />
    </>
  )
}
