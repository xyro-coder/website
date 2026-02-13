'use client'

import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 5000
const K_NEAREST = 30
const GRID_CELL_SIZE = 80

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  brightness: number
  phase: number
}

export default function LatentManifold() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -9999, y: -9999 })
  const particles = useRef<Particle[]>([])

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

    // Initialize 5000 particles
    particles.current = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      brightness: 0,
      phase: Math.random() * Math.PI * 2,
    }))

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMouseMove)

    let frame = 0
    let raf: number

    const animate = () => {
      frame++
      ctx.fillStyle = 'rgba(8, 12, 30, 0.18)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const mx = mouse.current.x
      const my = mouse.current.y

      // Spatial grid for fast k-nearest
      const cols = Math.ceil(canvas.width / GRID_CELL_SIZE)
      const rows = Math.ceil(canvas.height / GRID_CELL_SIZE)
      const grid: number[][] = Array.from({ length: cols * rows }, () => [])

      particles.current.forEach((p, i) => {
        // Update position
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        p.x = Math.max(0, Math.min(canvas.width, p.x))
        p.y = Math.max(0, Math.min(canvas.height, p.y))

        // Place in grid
        const cx = Math.floor(p.x / GRID_CELL_SIZE)
        const cy = Math.floor(p.y / GRID_CELL_SIZE)
        const ci = cy * cols + cx
        if (ci >= 0 && ci < grid.length) grid[ci].push(i)

        // Fade toward rest
        p.brightness *= 0.92
      })

      // Find k-nearest to mouse, activate them
      const activatedIndices: number[] = []
      const cx0 = Math.floor(mx / GRID_CELL_SIZE)
      const cy0 = Math.floor(my / GRID_CELL_SIZE)

      const candidates: { idx: number; dist: number }[] = []
      for (let dy = -2; dy <= 2; dy++) {
        for (let dx = -2; dx <= 2; dx++) {
          const ncx = cx0 + dx
          const ncy = cy0 + dy
          if (ncx < 0 || ncx >= cols || ncy < 0 || ncy >= rows) continue
          const cell = grid[ncy * cols + ncx]
          cell.forEach(idx => {
            const p = particles.current[idx]
            const d2 = (p.x - mx) ** 2 + (p.y - my) ** 2
            candidates.push({ idx, dist: d2 })
          })
        }
      }

      candidates.sort((a, b) => a.dist - b.dist)
      const kNearest = candidates.slice(0, K_NEAREST)
      kNearest.forEach(({ idx, dist }) => {
        const p = particles.current[idx]
        const falloff = Math.max(0, 1 - Math.sqrt(dist) / 300)
        p.brightness = Math.max(p.brightness, falloff)
        activatedIndices.push(idx)
      })

      // Draw activated wireframe mesh (Rotation Trick)
      if (kNearest.length >= 3) {
        const pts = kNearest.slice(0, 20).map(({ idx }) => particles.current[idx])

        // Apply rotation trick: rotate coordinates around mouse point
        const rotAngle = frame * 0.02
        const cosr = Math.cos(rotAngle)
        const sinr = Math.sin(rotAngle)

        const rotated = pts.map(p => {
          const rx = p.x - mx
          const ry = p.y - my
          return {
            x: mx + rx * cosr - ry * sinr,
            y: my + rx * sinr + ry * cosr,
          }
        })

        // Draw triangular faces between nearest points
        for (let i = 0; i < rotated.length - 2; i += 3) {
          const a = rotated[i]
          const b = rotated[i + 1]
          const c = rotated[i + 2]

          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.lineTo(c.x, c.y)
          ctx.closePath()
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)'
          ctx.lineWidth = 1
          ctx.stroke()
          ctx.fillStyle = 'rgba(6, 182, 212, 0.04)'
          ctx.fill()
        }

        // Draw connection lines between k-nearest
        for (let i = 0; i < rotated.length; i++) {
          for (let j = i + 1; j < Math.min(i + 4, rotated.length); j++) {
            ctx.beginPath()
            ctx.moveTo(rotated[i].x, rotated[i].y)
            ctx.lineTo(rotated[j].x, rotated[j].y)
            ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)'
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Draw all particles
      particles.current.forEach((p, i) => {
        const brightness = p.brightness
        if (brightness < 0.02) {
          // Dim resting particle
          ctx.beginPath()
          ctx.arc(p.x, p.y, 0.8, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(100, 120, 180, 0.25)'
          ctx.fill()
        } else {
          // Activated particle
          const size = 1.5 + brightness * 4
          const alpha = 0.4 + brightness * 0.6

          // Glow
          const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, size * 3)
          grad.addColorStop(0, `rgba(6, 182, 212, ${alpha})`)
          grad.addColorStop(1, 'rgba(6, 182, 212, 0)')
          ctx.beginPath()
          ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2)
          ctx.fillStyle = grad
          ctx.fill()

          ctx.beginPath()
          ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`
          ctx.fill()
        }
      })

      raf = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
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
