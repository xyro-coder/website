'use client'

// Subtle film grain overlay — 2% noise makes it feel like a scientific recording
// rather than a rendered webpage. Regenerates every 2 frames to save CPU.
import { useEffect, useRef } from 'react'

const TILE = 256   // noise tile size — tiled across the full viewport

export default function FilmGrain() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Offscreen tile canvas — only 256×256 pixels written per regeneration
    const tile = document.createElement('canvas')
    tile.width = TILE
    tile.height = TILE
    const tctx = tile.getContext('2d')!
    const imageData = tctx.createImageData(TILE, TILE)
    const data = imageData.data

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
        const v = Math.random() * 255
        data[i] = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = 255
      }
      tctx.putImageData(imageData, 0, 0)
      pattern = ctx.createPattern(tile, 'repeat')
    }

    regenerateNoise()

    const animate = () => {
      frame++
      // Regenerate every 2 frames — visible flicker = "live signal" texture
      if (frame % 2 === 0) regenerateNoise()

      const W = canvas.width
      const H = canvas.height

      if (pattern) {
        ctx.globalAlpha = 0.022   // 2.2% opacity
        ctx.fillStyle = pattern
        ctx.fillRect(0, 0, W, H)
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
