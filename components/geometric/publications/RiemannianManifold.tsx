'use client'

import { useEffect, useRef } from 'react'

// Research interests as "mass points" — each creates a gravity well on the manifold grid.
// Depth of well = mastery/focus. Orthographic projection gives the ICLR-blueprint look.

const MASS_POINTS = [
  { label: 'Geometric\nDeep Learning', ux: 0.3, uy: 0.38, mass: 2.8, color: '6,182,212' },
  { label: 'Sparse\nAutoencoders', ux: 0.55, uy: 0.3, mass: 3.2, color: '168,85,247' },
  { label: 'Mechanistic\nInterpretability', ux: 0.73, uy: 0.5, mass: 2.5, color: '168,85,247' },
  { label: 'Equivariant\nNetworks', ux: 0.2, uy: 0.58, mass: 2.0, color: '6,182,212' },
  { label: 'Manifold\nLearning', ux: 0.45, uy: 0.65, mass: 1.8, color: '99,102,241' },
  { label: 'Persistent\nHomology', ux: 0.25, uy: 0.78, mass: 1.4, color: '99,102,241' },
  { label: 'ML Infra', ux: 0.75, uy: 0.75, mass: 0.9, color: '34,197,94' },
]

const GRID_COLS = 32
const GRID_ROWS = 22

// Orthographic 3D → 2D (no perspective, pure isometric tilt)
function ortho(gx: number, gy: number, gz: number, W: number, H: number) {
  const scale = Math.min(W, H) * 0.85
  // Isometric-style tilt: rotate ~30° around X axis
  const cosA = Math.cos(0.52)
  const sinA = Math.sin(0.52)
  const sx = W * 0.5 + (gx - 0.5) * scale * 0.88
  const sy = H * 0.45 + (gy - 0.5) * scale * cosA * 0.62 - gz * scale * sinA * 0.5
  return { sx, sy }
}

export default function RiemannianManifold() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)
  const pinnedRef = useRef<number>(-1) // index of clicked/pinned node

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
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onMouseLeave = () => { mouseRef.current = null }
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    // Click to pin/unpin a well — amplifies it persistently
    const onClick = () => {
      const mouse = mouseRef.current
      if (!mouse) return
      let nearest = -1
      let nearestD = 48
      MASS_POINTS.forEach((m, i) => {
        const { sx, sy } = ortho(m.ux, m.uy, depth(m.ux, m.uy, MASS_POINTS, 0), W, H)
        const d = Math.sqrt((sx - mouse.x) ** 2 + (sy - mouse.y) ** 2)
        if (d < nearestD) { nearestD = d; nearest = i }
      })
      pinnedRef.current = pinnedRef.current === nearest ? -1 : nearest
    }
    canvas.addEventListener('click', onClick)

    // Pre-build glow sprites per mass point — replaces per-frame createRadialGradient
    const glowSprites = MASS_POINTS.map(m => {
      const R = 40
      const s = document.createElement('canvas')
      s.width = R * 2; s.height = R * 2
      const sc = s.getContext('2d')!
      const g = sc.createRadialGradient(R, R, 0, R, R, R)
      g.addColorStop(0, `rgba(${m.color},1)`)
      g.addColorStop(1, `rgba(${m.color},0)`)
      sc.beginPath(); sc.arc(R, R, R, 0, Math.PI * 2)
      sc.fillStyle = g; sc.fill()
      return { sprite: s, R }
    })

    let t = 0; let raf: number

    // Compute well depth at grid point (gx, gy in [0,1])
    const depth = (gx: number, gy: number, massPoints: typeof MASS_POINTS, breathe: number) => {
      let d = 0
      massPoints.forEach(m => {
        const dx = gx - m.ux
        const dy = gy - m.uy
        const r2 = dx * dx + dy * dy
        d += (m.mass * (1 + 0.04 * breathe * Math.sin(t * 1.2 + m.mass))) / (r2 * 180 + 1.2)
      })
      return Math.min(d, 0.38) // clamp max depth
    }

    let isVisible = true
    const observer = new IntersectionObserver(([e]) => { isVisible = e.isIntersecting }, { threshold: 0.01 })
    observer.observe(canvas)

    const animate = () => {
      raf = requestAnimationFrame(animate)
      if (!isVisible) return
      t += 0.007
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.fillStyle = 'rgba(0,0,0,0.52)'
      ctx.fillRect(0, 0, W, H)

      const mouse = mouseRef.current

      // Find hovered mass point
      let hoveredIdx = -1
      if (mouse) {
        MASS_POINTS.forEach((m, i) => {
          const { sx, sy } = ortho(m.ux, m.uy, depth(m.ux, m.uy, MASS_POINTS, 0), W, H)
          const d = Math.sqrt((sx - mouse.x) ** 2 + (sy - mouse.y) ** 2)
          if (d < 38) hoveredIdx = i
        })
      }
      const pinned = pinnedRef.current

      // Grid in additive mode — line crossings brighten naturally
      ctx.globalCompositeOperation = 'lighter'

      // ── Draw grid ──
      // Horizontal lines (vary gy, sweep gx)
      for (let row = 0; row <= GRID_ROWS; row++) {
        const gy = row / GRID_ROWS
        ctx.beginPath()
        for (let col = 0; col <= GRID_COLS; col++) {
          const gx = col / GRID_COLS
          const gz = depth(gx, gy, MASS_POINTS, Math.sin(t))
          const { sx, sy } = ortho(gx, gy, gz, W, H)
          if (col === 0) ctx.moveTo(sx, sy)
          else ctx.lineTo(sx, sy)
        }
        // Line brightness based on proximity to a mass point
        const rowBright = MASS_POINTS.reduce((acc, m) => {
          const dy = Math.abs(gy - m.uy)
          return Math.max(acc, Math.exp(-dy * dy * 30) * m.mass * 0.18)
        }, 0)
        ctx.strokeStyle = `rgba(99,120,180,${0.12 + rowBright})`
        ctx.lineWidth = 0.7
        ctx.stroke()
      }

      // Vertical lines (vary gx, sweep gy)
      for (let col = 0; col <= GRID_COLS; col++) {
        const gx = col / GRID_COLS
        ctx.beginPath()
        for (let row = 0; row <= GRID_ROWS; row++) {
          const gy = row / GRID_ROWS
          const gz = depth(gx, gy, MASS_POINTS, Math.sin(t))
          const { sx, sy } = ortho(gx, gy, gz, W, H)
          if (row === 0) ctx.moveTo(sx, sy)
          else ctx.lineTo(sx, sy)
        }
        const colBright = MASS_POINTS.reduce((acc, m) => {
          const dx = Math.abs(gx - m.ux)
          return Math.max(acc, Math.exp(-dx * dx * 30) * m.mass * 0.18)
        }, 0)
        ctx.strokeStyle = `rgba(99,120,180,${0.09 + colBright})`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }

      // Reset for nodes (need normal blending for glow layering)
      ctx.globalCompositeOperation = 'source-over'

      // ── Draw mass points ──
      MASS_POINTS.forEach((m, i) => {
        const gz = depth(m.ux, m.uy, MASS_POINTS, Math.sin(t))
        const { sx, sy } = ortho(m.ux, m.uy, gz, W, H)
        const isHov = i === hoveredIdx
        const isPinned = i === pinned
        const pulse = 0.7 + Math.sin(t * 2 + i * 0.9) * 0.3
        const depthNorm = gz / 0.38 // how deep is this well (0-1)

        // Well cone: vertical line to show depth
        const baseP = ortho(m.ux, m.uy, 0, W, H)
        const lineGrad = ctx.createLinearGradient(sx, sy, baseP.sx, baseP.sy)
        lineGrad.addColorStop(0, `rgba(${m.color},${0.4 * depthNorm * pulse})`)
        lineGrad.addColorStop(1, `rgba(${m.color},0)`)
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(baseP.sx, baseP.sy)
        ctx.strokeStyle = lineGrad
        ctx.lineWidth = isHov ? 1.5 : 0.8
        ctx.stroke()

        // Pinned: pulsing outer ring
        if (isPinned) {
          const ringR = 44 + Math.sin(t * 3) * 8
          const ringGrad = ctx.createRadialGradient(sx, sy, 26, sx, sy, ringR)
          ringGrad.addColorStop(0, `rgba(${m.color},0.25)`)
          ringGrad.addColorStop(1, `rgba(${m.color},0)`)
          ctx.beginPath()
          ctx.arc(sx, sy, ringR, 0, Math.PI * 2)
          ctx.fillStyle = ringGrad; ctx.fill()
          ctx.beginPath()
          ctx.arc(sx, sy, 28 + Math.sin(t * 4) * 4, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${m.color},0.5)`
          ctx.lineWidth = 1; ctx.stroke()
        }

        // Glow halo — pre-built sprite, no createRadialGradient per frame
        const active = isHov || isPinned
        const r = active ? 36 : 20
        const { sprite, R: sR } = glowSprites[i]
        ctx.globalAlpha = active ? 0.5 : 0.2 * pulse
        ctx.drawImage(sprite, sx - r, sy - r, r * 2, r * 2)
        ctx.globalAlpha = 1

        // Node
        ctx.beginPath()
        ctx.arc(sx, sy, active ? 6 : 3.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${m.color},${active ? 1 : 0.7 * pulse})`
        ctx.fill()

        // Label
        const lines = m.label.split('\n')
        const fSize = isHov ? 11 : 9
        ctx.font = `${isHov ? 'bold ' : ''}${fSize}px monospace`
        ctx.textAlign = 'center'
        lines.forEach((line, li) => {
          const labelY = sy - (isHov ? 14 : 10) - (lines.length - 1 - li) * (fSize + 1)
          ctx.fillStyle = isHov
            ? `rgba(${m.color},1)`
            : `rgba(${m.color},0.6)`
          ctx.fillText(line, sx, labelY)
        })

        // Depth annotation on hover or pin
        if (isHov || isPinned) {
          const depthLabel = isPinned ? `★ pinned  depth: ${(m.mass * 0.31).toFixed(2)}` : `depth: ${(m.mass * 0.31).toFixed(2)}`
          ctx.font = '8px monospace'
          ctx.fillStyle = `rgba(${m.color},${isPinned ? 0.8 : 0.5})`
          ctx.fillText(depthLabel, sx, sy + 18)
        }
      })

      // ── Label ──
      ctx.font = '8px monospace'
      ctx.textAlign = 'left'
      ctx.fillStyle = 'rgba(99,120,180,0.25)'
      ctx.fillText(
        pinned >= 0
          ? `PINNED: ${MASS_POINTS[pinned].label.replace('\n', ' ')}  ·  click again to release`
          : 'Riemannian Manifold  ·  Hover to probe  ·  Click to pin a well',
        16, H - 14
      )
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      canvas.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: 420, display: 'block', cursor: 'pointer' }}
    />
  )
}
