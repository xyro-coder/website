'use client'

import { useEffect, useRef } from 'react'

// Oriented bivector V(x,y): each needle aligns its plane perpendicular to cursor direction.
// This visualises a live vector field — the bivector at (x,y) points toward the cursor,
// demonstrating that the site "respects the local geometry of the user's interaction".

const GRID_SPACING = 44

interface Bivector {
  x: number   // canvas x (static grid position)
  y: number   // canvas y (static grid position)
  angle: number       // current displayed angle
  scale: number
}

export default function CliffordRotors() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)
  const scrollRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      buildGrid()
    }

    let bivectors: Bivector[] = []

    const buildGrid = () => {
      bivectors = []
      for (let gy = GRID_SPACING / 2; gy < canvas.height + GRID_SPACING; gy += GRID_SPACING) {
        for (let gx = GRID_SPACING / 2; gx < canvas.width + GRID_SPACING; gx += GRID_SPACING) {
          bivectors.push({
            x: gx,
            y: gy,
            angle: Math.random() * Math.PI,
            scale: 0.55 + Math.random() * 0.45,
          })
        }
      }
    }

    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    const onMouseLeave = () => { mouseRef.current = null }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)

    const onScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('scroll', onScroll, { passive: true })

    let t = 0
    let raf: number

    const animate = () => {
      t += 0.01
      const scroll = scrollRef.current
      const mouse = mouseRef.current
      const W = canvas.width
      const H = canvas.height

      ctx.fillStyle = 'rgba(8,12,30,0.2)'
      ctx.fillRect(0, 0, W, H)

      bivectors.forEach(bv => {
        // Screen-space Y after scroll
        const sy = bv.y - scroll
        if (sy < -GRID_SPACING || sy > H + GRID_SPACING) return

        let targetAngle: number

        if (mouse) {
          // Point toward cursor — Clifford rotor aligns to field direction V(x,y) = cursor - bv
          const dx = mouse.x - bv.x
          const dy = mouse.y - sy
          targetAngle = Math.atan2(dy, dx)
        } else {
          // Ambient wave pattern when no cursor
          targetAngle = Math.sin(bv.x * 0.012 + bv.y * 0.009 + t * 0.7) * Math.PI
        }

        // Smooth SLERP toward target
        const diff = ((targetAngle - bv.angle + Math.PI * 3) % (Math.PI * 2)) - Math.PI
        bv.angle += diff * 0.09

        const len = GRID_SPACING * 0.38 * bv.scale
        const hw = 1.4   // half-width of needle

        const cosA = Math.cos(bv.angle)
        const sinA = Math.sin(bv.angle)
        const cosP = Math.cos(bv.angle + Math.PI / 2)
        const sinP = Math.sin(bv.angle + Math.PI / 2)

        // Distance to cursor for brightness
        let proximity = 0
        if (mouse) {
          const dx = mouse.x - bv.x
          const dy = mouse.y - sy
          const d = Math.sqrt(dx * dx + dy * dy)
          proximity = Math.max(0, 1 - d / 220)
        }

        // Clifford rotor coloring: orientation encodes which "plane" the bivector spans
        // close to cursor → cyan, far → purple, ambient → muted purple
        const aligned = proximity > 0.3

        const fillA = aligned ? 0.35 + proximity * 0.3 : 0.06 + Math.abs(Math.sin(bv.angle - t)) * 0.04
        const strokeA = aligned ? 0.7 + proximity * 0.25 : 0.18 + Math.abs(Math.sin(bv.angle - t)) * 0.06
        const col = aligned ? '6,182,212' : '168,85,247'

        // Four-corner needle (oriented bivector)
        const pts = [
          [bv.x - cosA * len - cosP * hw, sy - sinA * len - sinP * hw],
          [bv.x + cosA * len - cosP * hw, sy + sinA * len - sinP * hw],
          [bv.x + cosA * len + cosP * hw, sy + sinA * len + sinP * hw],
          [bv.x - cosA * len + cosP * hw, sy - sinA * len + sinP * hw],
        ]

        ctx.beginPath()
        ctx.moveTo(pts[0][0], pts[0][1])
        ctx.lineTo(pts[1][0], pts[1][1])
        ctx.lineTo(pts[2][0], pts[2][1])
        ctx.lineTo(pts[3][0], pts[3][1])
        ctx.closePath()
        ctx.fillStyle = `rgba(${col},${fillA})`
        ctx.strokeStyle = `rgba(${col},${strokeA})`
        ctx.lineWidth = 0.5
        ctx.fill()
        ctx.stroke()

        // Direction dot at "head" of bivector
        ctx.beginPath()
        ctx.arc(bv.x + cosA * len, sy + sinA * len, aligned ? 2 : 1.2, 0, Math.PI * 2)
        ctx.fillStyle = aligned
          ? `rgba(6,182,212,${0.85 + proximity * 0.15})`
          : `rgba(168,85,247,0.22)`
        ctx.fill()

        // Glow for highly aligned bivectors
        if (proximity > 0.55) {
          const g = ctx.createRadialGradient(bv.x, sy, 0, bv.x, sy, len * 1.8)
          g.addColorStop(0, `rgba(6,182,212,${proximity * 0.12})`)
          g.addColorStop(1, 'rgba(6,182,212,0)')
          ctx.beginPath()
          ctx.arc(bv.x, sy, len * 1.8, 0, Math.PI * 2)
          ctx.fillStyle = g
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
      window.removeEventListener('mouseleave', onMouseLeave)
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
