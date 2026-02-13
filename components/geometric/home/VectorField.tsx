'use client'

import { useEffect, useRef } from 'react'

// Smooth noise helper (value noise)
function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10) }
function lerp(a: number, b: number, t: number) { return a + t * (b - a) }

function noise2D(x: number, y: number, seed: number): number {
  const X = Math.floor(x) & 255
  const Y = Math.floor(y) & 255
  x -= Math.floor(x)
  y -= Math.floor(y)
  const u = fade(x)
  const v = fade(y)
  // Pseudo-random gradients
  const hash = (n: number) => {
    let h = (n ^ seed) * 2654435761
    h = (h ^ (h >>> 16)) * 0x45d9f3b
    return (h ^ (h >>> 16)) / 0x100000000
  }
  const a = hash(X + Y * 256)
  const b = hash(X + 1 + Y * 256)
  const c = hash(X + (Y + 1) * 256)
  const d = hash(X + 1 + (Y + 1) * 256)
  return lerp(lerp(a, b, u), lerp(c, d, u), v)
}

// Curl noise: curl of a 2D noise field gives a divergence-free vector field
function curlNoise(x: number, y: number, t: number): [number, number] {
  const eps = 0.01
  const n = 0.003 // scale

  const dx1 = noise2D(x * n, y * n + eps, 1 + Math.floor(t))
  const dx2 = noise2D(x * n, y * n - eps, 1 + Math.floor(t))
  const dy1 = noise2D(x * n + eps, y * n, 2 + Math.floor(t))
  const dy2 = noise2D(x * n - eps, y * n, 2 + Math.floor(t))

  const dPdx = (dx1 - dx2) / (2 * eps)
  const dPdy = (dy1 - dy2) / (2 * eps)

  // Curl: (-dPdy, dPdx)
  const mag = 2.0
  return [-dPdy * mag, dPdx * mag]
}

interface Streamline {
  points: [number, number][]
  age: number
  isPrincipal: boolean // 10% glow bright
  opacity: number
}

const LINE_COUNT = 600
const LINE_LENGTH = 50

export default function VectorField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

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

    // Initialize streamlines
    const lines: Streamline[] = Array.from({ length: LINE_COUNT }, (_, i) => ({
      points: [[Math.random() * canvas.width, Math.random() * canvas.height]],
      age: Math.floor(Math.random() * LINE_LENGTH),
      isPrincipal: i < LINE_COUNT * 0.1, // 10% principal components
      opacity: Math.random() * 0.5 + 0.5,
    }))

    let t = 0
    let raf: number

    const animate = () => {
      t += 0.002
      ctx.fillStyle = 'rgba(8, 12, 30, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      lines.forEach(line => {
        line.age++

        if (line.age > LINE_LENGTH || line.points.length === 0) {
          // Reset
          line.points = [[Math.random() * canvas.width, Math.random() * canvas.height]]
          line.age = 0
          return
        }

        const [lx, ly] = line.points[line.points.length - 1]
        const [dvx, dvy] = curlNoise(lx, ly, t)

        const nx = lx + dvx
        const ny = ly + dvy

        // Bounce at boundaries
        if (nx < 0 || nx > canvas.width || ny < 0 || ny > canvas.height) {
          line.points = [[Math.random() * canvas.width, Math.random() * canvas.height]]
          line.age = 0
          return
        }

        line.points.push([nx, ny])
        if (line.points.length > 20) line.points.shift()

        // Draw the streamline
        if (line.points.length < 2) return

        const progress = line.age / LINE_LENGTH
        const fade = Math.sin(progress * Math.PI)

        ctx.beginPath()
        ctx.moveTo(line.points[0][0], line.points[0][1])
        for (let i = 1; i < line.points.length; i++) {
          ctx.lineTo(line.points[i][0], line.points[i][1])
        }

        if (line.isPrincipal) {
          // 10% bright principal components
          ctx.strokeStyle = `rgba(6, 182, 212, ${fade * 0.9})`
          ctx.lineWidth = 1.5
          ctx.shadowColor = '#06b6d4'
          ctx.shadowBlur = 8
        } else {
          // 90% dimmed sparse paths
          ctx.strokeStyle = `rgba(50, 80, 120, ${fade * 0.25})`
          ctx.lineWidth = 0.5
          ctx.shadowBlur = 0
        }

        ctx.stroke()
        ctx.shadowBlur = 0
      })

      // Draw arrowheads on principal lines
      lines.filter(l => l.isPrincipal && l.points.length >= 2).forEach(line => {
        const last = line.points[line.points.length - 1]
        const prev = line.points[line.points.length - 2]
        const angle = Math.atan2(last[1] - prev[1], last[0] - prev[0])
        const size = 6

        ctx.beginPath()
        ctx.moveTo(last[0] + Math.cos(angle) * size, last[1] + Math.sin(angle) * size)
        ctx.lineTo(last[0] + Math.cos(angle + 2.4) * size, last[1] + Math.sin(angle + 2.4) * size)
        ctx.lineTo(last[0] + Math.cos(angle - 2.4) * size, last[1] + Math.sin(angle - 2.4) * size)
        ctx.closePath()
        ctx.fillStyle = 'rgba(6, 182, 212, 0.6)'
        ctx.fill()
      })

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
      className="absolute inset-0 w-full h-full"
      style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
    />
  )
}
