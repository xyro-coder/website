'use client'

import { useEffect, useRef } from 'react'

// Noise tile — regenerated every 8 frames (was every 2), 128px tile (was 256px)
// 4× less CPU for noise generation, visually indistinguishable.
const TILE = 128

export default function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const tile = document.createElement('canvas')
    tile.width = TILE
    tile.height = TILE
    const tctx = tile.getContext('2d')!
    const imageData = tctx.createImageData(TILE, TILE)
    const data = imageData.data

    // Pre-fill alpha channel once — no need to set it every regen
    for (let i = 3; i < data.length; i += 4) data[i] = 255

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let frame = 0
    let raf: number
    let pattern: CanvasPattern | null = null

    const regenerateNoise = () => {
      for (let i = 0; i < data.length; i += 4) {
        const v = (Math.random() * 255) | 0
        data[i] = v
        data[i + 1] = v
        data[i + 2] = v
      }
      tctx.putImageData(imageData, 0, 0)
      pattern = ctx.createPattern(tile, 'repeat')
    }

    regenerateNoise()

    const animate = () => {
      frame++
      if (frame % 8 === 0) regenerateNoise()

      if (pattern) {
        ctx.globalAlpha = 0.022
        ctx.fillStyle = pattern
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.globalAlpha = 1
      }

      raf = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        pointerEvents: 'none',
        mixBlendMode: 'overlay',
      }}
    />
  )
}
