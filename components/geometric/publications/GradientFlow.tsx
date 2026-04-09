'use client'

import { useEffect, useRef, useState } from 'react'

// Gradient particles flow from paper entry down through a sparsity filter mesh.
// Mode "baseline": 70% of particles stop at filter nodes (gradient vanishing).
// Mode "rt": particles pass through gaps smoothly (gradient preservation).

const N_PARTICLES = 44
const N_FILTER_NODES = 12 // mesh nodes where baseline blocks

interface Particle {
  x: number
  y: number
  vy: number
  vx: number
  phase: number
  absorbed: boolean // baseline only
  alpha: number
  trail: { x: number; y: number }[]
}

interface FilterNode {
  x: number   // normalized 0-1
  y: number   // normalized 0-1, placed in middle band
}

export default function GradientFlow({ mode }: { mode: 'baseline' | 'rt' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const modeRef = useRef(mode)
  const particlesRef = useRef<Particle[]>([])
  const nodesRef = useRef<FilterNode[]>([])
  const [bibtexLit, setBibtexLit] = useState<number[]>([])
  const bibtexLitRef = useRef<number[]>([])

  useEffect(() => { modeRef.current = mode }, [mode])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0; let H = 0

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      W = canvas.width; H = canvas.height
      buildNodes()
    }

    const buildNodes = () => {
      // 3 rows of filter nodes staggered, in the middle 30% of height
      const topBand = 0.38
      const rows = [topBand, topBand + 0.07, topBand + 0.14]
      nodesRef.current = []
      rows.forEach((rowY, ri) => {
        const count = ri % 2 === 0 ? 5 : 4
        for (let i = 0; i < count; i++) {
          nodesRef.current.push({
            x: (i + 0.5 + (ri % 2 === 1 ? 0.5 : 0)) / (count + (ri % 2 === 1 ? 0.5 : -0.5)),
            y: rowY,
          })
        }
      })
    }

    const spawnParticle = (W: number): Particle => ({
      x: (0.1 + Math.random() * 0.8) * W,
      y: -6,
      vx: (Math.random() - 0.5) * 0.4,
      vy: 0.6 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      absorbed: false,
      alpha: 0.6 + Math.random() * 0.4,
      trail: [],
    })

    // Spawn initial particles
    particlesRef.current = Array.from({ length: N_PARTICLES }, () => spawnParticle(400))

    resize()
    window.addEventListener('resize', resize)

    let t = 0; let raf: number

    const animate = () => {
      t += 0.012
      const rtMode = modeRef.current === 'rt'

      // Reset composite state before partial clear
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.fillStyle = 'rgba(0,0,0,0.55)'
      ctx.fillRect(0, 0, W, H)

      // Additive blending — where light pipes cross, intersection doubles in brightness
      ctx.globalCompositeOperation = 'lighter'

      const nodes = nodesRef.current
      const col = rtMode ? '6,182,212' : '168,85,247'

      // ── Draw filter mesh as light pipes ──
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < 0.22) {
            const x1 = nodes[i].x * W; const y1 = nodes[i].y * H
            const x2 = nodes[j].x * W; const y2 = nodes[j].y * H

            // Core bright line (additive — intersections naturally hot-spot)
            const grad = ctx.createLinearGradient(x1, y1, x2, y2)
            grad.addColorStop(0, `rgba(${col},0.35)`)
            grad.addColorStop(0.5, `rgba(${col},0.55)`)
            grad.addColorStop(1, `rgba(${col},0.35)`)
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.strokeStyle = grad
            ctx.lineWidth = 1.2
            ctx.stroke()

            // Glow halo around each pipe (wider, dimmer — additive accumulates)
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.strokeStyle = `rgba(${col},0.1)`
            ctx.lineWidth = 6
            ctx.stroke()
          }
        }
      }

      // Node dots — brighter with additive blending
      nodes.forEach(n => {
        const nx = n.x * W; const ny = n.y * H

        // Outer glow
        const g = ctx.createRadialGradient(nx, ny, 0, nx, ny, 14)
        g.addColorStop(0, `rgba(${col},0.45)`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath(); ctx.arc(nx, ny, 14, 0, Math.PI * 2)
        ctx.fillStyle = g; ctx.fill()

        // Core
        ctx.beginPath(); ctx.arc(nx, ny, 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${col},0.9)`
        ctx.fill()
      })

      // Filter label (drawn in normal mode — text on top of additive layer)
      ctx.globalCompositeOperation = 'source-over'
      ctx.font = '8px monospace'
      ctx.textAlign = 'center'
      ctx.fillStyle = rtMode ? 'rgba(6,182,212,0.35)' : 'rgba(168,85,247,0.4)'
      if (nodes.length > 0) {
        ctx.fillText(
          rtMode ? '↓  Sparsity Filter  (gradient passes through)' : '↓  Sparsity Filter  (gradient vanishes)',
          W / 2, nodes[0].y * H - 10
        )
      }

      // BibTeX destination zone
      const bibY = H * 0.78
      ctx.globalCompositeOperation = 'lighter'
      const bibGrad = ctx.createLinearGradient(0, bibY, 0, H)
      bibGrad.addColorStop(0, 'rgba(6,182,212,0)')
      bibGrad.addColorStop(0.5, `rgba(6,182,212,${rtMode ? 0.06 : 0.015})`)
      bibGrad.addColorStop(1, 'rgba(6,182,212,0)')
      ctx.fillStyle = bibGrad
      ctx.fillRect(0, bibY, W, H - bibY)
      ctx.globalCompositeOperation = 'source-over'

      ctx.font = '9px monospace'
      ctx.textAlign = 'center'
      ctx.fillStyle = rtMode ? 'rgba(6,182,212,0.3)' : 'rgba(100,120,160,0.18)'
      ctx.fillText('@ BibTeX · RT-TopKSAE', W / 2, bibY + 14)

      // ── Update & draw particles ──
      const newLit: number[] = []

      particlesRef.current = particlesRef.current.map(p => {
        if (p.absorbed) return p

        // Check if absorbed by any filter node (baseline mode)
        if (!rtMode) {
          for (const n of nodes) {
            const nx = n.x * W; const ny = n.y * H
            const d = Math.sqrt((p.x - nx) ** 2 + (p.y - ny) ** 2)
            if (d < 8 && Math.random() < 0.7) {
              return { ...p, absorbed: true, alpha: 0, trail: [] }
            }
          }
        }

        // Move
        const newP = {
          ...p,
          x: p.x + p.vx + Math.sin(t * 1.2 + p.phase) * 0.3,
          y: p.y + p.vy,
          trail: [...p.trail.slice(-8), { x: p.x, y: p.y }],
        }

        // Reached BibTeX zone
        if (newP.y > bibY + 10 && rtMode) {
          const slot = Math.floor((p.x / W) * 6)
          newLit.push(slot)
        }

        // Respawn if off-screen
        if (newP.y > H + 10) {
          return spawnParticle(W)
        }

        return newP
      })

      // Spawn replacement for absorbed
      particlesRef.current = particlesRef.current.map(p =>
        p.absorbed ? spawnParticle(W) : p
      )

      bibtexLitRef.current = newLit
      if (newLit.length > 0) setBibtexLit([...newLit])

      // Draw particles + trails — all additive, so density accumulates naturally
      particlesRef.current.forEach(p => {
        if (p.absorbed) return
        const color = rtMode ? '6,182,212' : '168,85,247'

        // Trail — smears light behind particle
        p.trail.forEach((pt, i) => {
          const trailAlpha = (i / p.trail.length) * p.alpha * 0.45
          ctx.beginPath()
          ctx.arc(pt.x, pt.y, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${color},${trailAlpha})`
          ctx.fill()
        })

        // Glow — larger, because additive keeps it subtle overall
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 8)
        g.addColorStop(0, `rgba(${color},${p.alpha * 0.6})`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.beginPath()
        ctx.arc(p.x, p.y, 8, 0, Math.PI * 2)
        ctx.fillStyle = g; ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color},${p.alpha})`
        ctx.fill()
      })

      // Reset composite mode for text/UI elements
      ctx.globalCompositeOperation = 'source-over'

      raf = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="relative w-full" style={{ height: 240, overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: 'none' }}
      />
    </div>
  )
}
