'use client'

import { useEffect, useRef } from 'react'

interface Bivector {
  x: number
  y: number
  angle: number      // current orientation
  targetAngle: number
  scale: number
}

const GRID_SPACING = 40

// Rotor: R = cos(θ/2) + sin(θ/2)·e12
// Applied rotation: V' = R V R†
// For our 2D bivectors, this just means rotating the needle by θ
function applyRotor(angle: number, scrollInfluence: number, waveX: number, waveY: number, t: number): number {
  // Wave pattern from scroll
  const wave = Math.sin(waveX * 0.08 + waveY * 0.05 + t) * 0.7
  return angle + scrollInfluence * 0.3 + wave
}

export default function CliffordRotors() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onScroll = () => {
      scrollRef.current = window.scrollY
    }
    window.addEventListener('scroll', onScroll)

    // Create grid of bivectors
    const bivectors: Bivector[] = []
    for (let y = GRID_SPACING / 2; y < 2000; y += GRID_SPACING) {
      for (let x = GRID_SPACING / 2; x < 2000; x += GRID_SPACING) {
        bivectors.push({
          x,
          y,
          angle: Math.random() * Math.PI,
          targetAngle: 0,
          scale: 0.6 + Math.random() * 0.4,
        })
      }
    }

    let t = 0
    let raf: number

    const animate = () => {
      t += 0.01

      // Recompute canvas-space positions
      const w = canvas.width
      const h = canvas.height

      ctx.fillStyle = 'rgba(8, 12, 30, 0.2)'
      ctx.fillRect(0, 0, w, h)

      const scroll = scrollRef.current
      const scrollInfluence = (scroll / (document.body.scrollHeight || 1000)) * Math.PI * 4

      bivectors.forEach(bv => {
        // Only draw if visible
        if (bv.x > w + GRID_SPACING || bv.y - scroll > h + GRID_SPACING) return
        if (bv.y - scroll < -GRID_SPACING) return

        const screenY = bv.y - scroll

        // Clifford rotor determines orientation
        bv.targetAngle = applyRotor(
          bv.angle,
          scrollInfluence,
          bv.x,
          bv.y,
          t
        )

        // Smooth rotation using slerp-like approach
        const diff = ((bv.targetAngle - bv.angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI
        bv.angle += diff * 0.08

        // Draw bivector as oriented "needle" / thin rectangle
        const len = GRID_SPACING * 0.4 * bv.scale
        const width = 1.5

        const cosA = Math.cos(bv.angle)
        const sinA = Math.sin(bv.angle)

        // Perpendicular direction
        const cosP = Math.cos(bv.angle + Math.PI / 2)
        const sinP = Math.sin(bv.angle + Math.PI / 2)

        // Four corners of the needle
        const pts = [
          [bv.x - cosA * len - cosP * width, screenY - sinA * len - sinP * width],
          [bv.x + cosA * len - cosP * width, screenY + sinA * len - sinP * width],
          [bv.x + cosA * len + cosP * width, screenY + sinA * len + sinP * width],
          [bv.x - cosA * len + cosP * width, screenY - sinA * len + sinP * width],
        ]

        // Color based on orientation angle
        const hue = ((bv.angle / Math.PI) * 60 + 180) % 360
        const isAligned = Math.abs(Math.sin(bv.angle - t)) > 0.8

        ctx.beginPath()
        ctx.moveTo(pts[0][0], pts[0][1])
        ctx.lineTo(pts[1][0], pts[1][1])
        ctx.lineTo(pts[2][0], pts[2][1])
        ctx.lineTo(pts[3][0], pts[3][1])
        ctx.closePath()

        if (isAligned) {
          ctx.fillStyle = 'rgba(6, 182, 212, 0.35)'
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.7)'
        } else {
          ctx.fillStyle = `rgba(168, 85, 247, 0.08)`
          ctx.strokeStyle = `rgba(168, 85, 247, 0.2)`
        }
        ctx.lineWidth = 0.5
        ctx.fill()
        ctx.stroke()

        // Draw orientation dot at one end (shows direction of rotor)
        ctx.beginPath()
        ctx.arc(
          bv.x + cosA * len,
          screenY + sinA * len,
          1.5, 0, Math.PI * 2
        )
        ctx.fillStyle = isAligned ? 'rgba(6, 182, 212, 0.8)' : 'rgba(168, 85, 247, 0.3)'
        ctx.fill()
      })

      raf = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
    />
  )
}
