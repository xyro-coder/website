'use client'

// Loss landscape + gradient descent visualization — pure 2D canvas.
// Replaces the old Three.js version (no WebGL dependency).
//
// Renders:
//   • Contour lines of f(x,y) = Σ Gaussians (the loss surface projected to 2D)
//   • Gradient descent trajectory animated from a random start
//   • Gradient vector field (arrows showing ∇f at each grid point)
//   • Color: cyan = low loss (global minima zone), purple = high loss saddles

import { useEffect, useRef } from 'react'

// Loss surface: sum of Gaussians (multiple local minima)
function loss(x: number, y: number): number {
  const g1 = 3.0 * Math.exp(-((x + 1.8) ** 2 + (y + 1.2) ** 2) / 1.2)
  const g2 = 2.2 * Math.exp(-((x - 2.0) ** 2 + (y - 1.6) ** 2) / 0.9)
  const g3 = 1.5 * Math.exp(-((x + 0.3) ** 2 + (y - 2.4) ** 2) / 0.7)
  const saddle = 0.18 * (Math.sin(x * 0.9) * Math.cos(y * 0.8))
  // Invert: high Gaussian = low loss
  return 3.5 - (g1 + g2 + g3) + saddle
}

// Numerical gradient
function grad(x: number, y: number, eps = 0.02): [number, number] {
  return [(loss(x + eps, y) - loss(x - eps, y)) / (2 * eps),
          (loss(x, y + eps) - loss(x, y - eps)) / (2 * eps)]
}

const RANGE = 4.5   // world-space ±range
const CONTOURS = 18 // number of contour levels

export default function GradientFlowVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // World → screen
    const toScreen = (wx: number, wy: number) => {
      const W = canvas.width; const H = canvas.height
      return {
        sx: W * 0.5 + wx / RANGE * W * 0.42,
        sy: H * 0.5 - wy / RANGE * H * 0.42,
      }
    }

    // Precompute loss grid for contours (resolution × resolution)
    const RES = 80
    let lossGrid: Float32Array
    let lossMin = Infinity, lossMax = -Infinity

    const buildGrid = () => {
      lossGrid = new Float32Array(RES * RES)
      lossMin = Infinity; lossMax = -Infinity
      for (let row = 0; row < RES; row++) {
        for (let col = 0; col < RES; col++) {
          const wx = -RANGE + col / (RES - 1) * 2 * RANGE
          const wy = RANGE - row / (RES - 1) * 2 * RANGE
          const v = loss(wx, wy)
          lossGrid[row * RES + col] = v
          if (v < lossMin) lossMin = v
          if (v > lossMax) lossMax = v
        }
      }
    }
    buildGrid()

    // Gradient descent trajectory — resets from random start
    let trajX = (Math.random() - 0.5) * RANGE * 1.6
    let trajY = (Math.random() - 0.5) * RANGE * 1.6
    const trajectory: [number, number][] = [[trajX, trajY]]
    const LR = 0.055
    const MAX_TRAIL = 120

    let t = 0; let raf: number
    let stepTimer = 0

    const animate = () => {
      t += 0.014
      stepTimer++

      const W = canvas.width
      const H = canvas.height

      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.fillStyle = 'rgba(0,0,0,0.32)'
      ctx.fillRect(0, 0, W, H)

      // ── Contour lines ──
      ctx.globalCompositeOperation = 'lighter'
      for (let c = 0; c < CONTOURS; c++) {
        const level = lossMin + (lossMax - lossMin) * (c / CONTOURS)
        const t01 = c / CONTOURS    // 0 = min (global min), 1 = max (saddles)
        // Cyan for low loss, purple for high loss
        const r = Math.round(6   + (168 - 6)   * t01)
        const g = Math.round(182 + (85  - 182) * t01)
        const b = Math.round(212 + (247 - 212) * t01)
        const alpha = 0.06 + (1 - t01) * 0.08

        // Marching squares (simplified — draw line segments where grid crosses level)
        for (let row = 0; row < RES - 1; row++) {
          for (let col = 0; col < RES - 1; col++) {
            const i = row * RES + col
            const v00 = lossGrid[i]
            const v10 = lossGrid[i + 1]
            const v01 = lossGrid[i + RES]
            const v11 = lossGrid[i + RES + 1]

            // World coords of cell corners
            const wx0 = -RANGE + col / (RES - 1) * 2 * RANGE
            const wx1 = -RANGE + (col + 1) / (RES - 1) * 2 * RANGE
            const wy0 = RANGE - row / (RES - 1) * 2 * RANGE
            const wy1 = RANGE - (row + 1) / (RES - 1) * 2 * RANGE

            // Lerp along each edge to find crossing point
            const lerp = (va: number, vb: number, wa: number, wb: number) =>
              wa + (level - va) / (vb - va) * (wb - wa)

            const pts: [number, number][] = []
            if ((v00 < level) !== (v10 < level)) pts.push([lerp(v00, v10, wx0, wx1), wy0])
            if ((v10 < level) !== (v11 < level)) pts.push([wx1, lerp(v10, v11, wy0, wy1)])
            if ((v01 < level) !== (v11 < level)) pts.push([lerp(v01, v11, wx0, wx1), wy1])
            if ((v00 < level) !== (v01 < level)) pts.push([wx0, lerp(v00, v01, wy0, wy1)])

            if (pts.length >= 2) {
              const a = toScreen(pts[0][0], pts[0][1])
              const b = toScreen(pts[1][0], pts[1][1])
              ctx.beginPath()
              ctx.moveTo(a.sx, a.sy)
              ctx.lineTo(b.sx, b.sy)
              ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`
              ctx.lineWidth = 0.6
              ctx.stroke()
            }
          }
        }
      }
      ctx.globalCompositeOperation = 'source-over'

      // ── Gradient vector field ──
      const GRID_STEP = RANGE * 2 / 10
      for (let gx = -RANGE + GRID_STEP / 2; gx < RANGE; gx += GRID_STEP) {
        for (let gy = -RANGE + GRID_STEP / 2; gy < RANGE; gy += GRID_STEP) {
          const [dx, dy] = grad(gx, gy)
          const mag = Math.sqrt(dx * dx + dy * dy)
          if (mag < 0.001) continue
          const nx = dx / mag; const ny = dy / mag
          const arrowLen = 0.22

          const start = toScreen(gx, gy)
          const end = toScreen(gx - nx * arrowLen, gy + ny * arrowLen)

          const lv = (loss(gx, gy) - lossMin) / (lossMax - lossMin)
          const arrowAlpha = 0.08 + lv * 0.06
          const acol = lv > 0.5 ? '168,85,247' : '6,182,212'

          ctx.beginPath()
          ctx.moveTo(start.sx, start.sy)
          ctx.lineTo(end.sx, end.sy)
          ctx.strokeStyle = `rgba(${acol},${arrowAlpha})`
          ctx.lineWidth = 0.7
          ctx.stroke()
        }
      }

      // ── Gradient descent step ──
      if (stepTimer % 2 === 0) {
        const [dx, dy] = grad(trajX, trajY)
        trajX -= LR * dx
        trajY -= LR * dy
        // Clamp to world bounds
        trajX = Math.max(-RANGE * 0.95, Math.min(RANGE * 0.95, trajX))
        trajY = Math.max(-RANGE * 0.95, Math.min(RANGE * 0.95, trajY))
        trajectory.push([trajX, trajY])
        if (trajectory.length > MAX_TRAIL) trajectory.shift()

        // Auto-reset when converged (near a minimum)
        const [gx, gy] = grad(trajX, trajY)
        if (Math.sqrt(gx * gx + gy * gy) < 0.04 || trajectory.length >= MAX_TRAIL) {
          trajX = (Math.random() - 0.5) * RANGE * 1.6
          trajY = (Math.random() - 0.5) * RANGE * 1.6
          trajectory.length = 0
          trajectory.push([trajX, trajY])
        }
      }

      // ── Draw trajectory ──
      if (trajectory.length > 1) {
        ctx.globalCompositeOperation = 'lighter'
        for (let i = 1; i < trajectory.length; i++) {
          const prog = i / trajectory.length
          const [ax, ay] = trajectory[i - 1]
          const [bx, by] = trajectory[i]
          const sa = toScreen(ax, ay)
          const sb = toScreen(bx, by)

          // Glow halo
          ctx.beginPath(); ctx.moveTo(sa.sx, sa.sy); ctx.lineTo(sb.sx, sb.sy)
          ctx.strokeStyle = `rgba(168,85,247,${prog * 0.2})`
          ctx.lineWidth = 6; ctx.stroke()
          // Core
          ctx.beginPath(); ctx.moveTo(sa.sx, sa.sy); ctx.lineTo(sb.sx, sb.sy)
          ctx.strokeStyle = `rgba(168,85,247,${prog * 0.9})`
          ctx.lineWidth = 1.8; ctx.stroke()
        }
        ctx.globalCompositeOperation = 'source-over'

        // Current position dot
        const cur = toScreen(trajX, trajY)
        const g = ctx.createRadialGradient(cur.sx, cur.sy, 0, cur.sx, cur.sy, 16)
        g.addColorStop(0, 'rgba(168,85,247,0.6)')
        g.addColorStop(1, 'rgba(168,85,247,0)')
        ctx.beginPath(); ctx.arc(cur.sx, cur.sy, 16, 0, Math.PI * 2)
        ctx.fillStyle = g; ctx.fill()
        ctx.beginPath(); ctx.arc(cur.sx, cur.sy, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(168,85,247,1)'; ctx.fill()
        ctx.strokeStyle = 'rgba(255,255,255,0.6)'
        ctx.lineWidth = 1; ctx.stroke()

        // Loss value label
        const curLoss = loss(trajX, trajY)
        ctx.font = '9px monospace'
        ctx.fillStyle = 'rgba(168,85,247,0.7)'
        ctx.textAlign = 'center'
        ctx.fillText(`ℒ = ${curLoss.toFixed(3)}`, cur.sx, cur.sy - 22)
      }

      // ── Global minima markers ──
      const MINIMA = [[-1.8, -1.2], [2.0, 1.6]]
      MINIMA.forEach(([mx, my]) => {
        const s = toScreen(mx, my)
        const pulse = 1 + Math.sin(t * 2) * 0.25
        ctx.beginPath(); ctx.arc(s.sx, s.sy, 6 * pulse, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(6,182,212,${0.5 + Math.sin(t * 2) * 0.3})`
        ctx.lineWidth = 1.5; ctx.stroke()
        ctx.beginPath(); ctx.arc(s.sx, s.sy, 3, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(6,182,212,0.85)'; ctx.fill()
        ctx.font = '8px monospace'
        ctx.fillStyle = 'rgba(6,182,212,0.5)'
        ctx.textAlign = 'center'
        ctx.fillText('min', s.sx, s.sy - 14)
      })

      // Caption
      ctx.font = '9px monospace'
      ctx.fillStyle = 'rgba(100,120,155,0.32)'
      ctx.textAlign = 'left'
      ctx.fillText(
        'LOSS LANDSCAPE  ·  gradient descent  ·  contours = iso-loss surfaces  ·  cyan = global minima',
        14, H - 14
      )

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
      className="w-full canvas-void"
      style={{ height: 400, display: 'block', cursor: 'default' }}
    />
  )
}
