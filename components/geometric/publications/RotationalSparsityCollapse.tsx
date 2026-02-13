'use client'

import { useEffect, useRef } from 'react'

// A dense cloud of points that "collapse" via the Rotation Trick
// Phase 0: chaotic cloud (raw data, high-dim)
// Phase 1: rotation axis appears (glowing cyan line)
// Phase 2: points snap/rotate toward the principal axis (sparse line/plane)

const N_POINTS = 280

interface Point {
  // raw position (messy cloud)
  ox: number; oy: number
  // collapsed position (on a line / sparse plane)
  tx: number; ty: number
  // current
  x: number; y: number
  vx: number; vy: number
  brightness: number // 0-1
  phase: number // random offset for stagger
}

export default function RotationalSparsityCollapse({ collapsed }: { collapsed: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const collapsedRef = useRef(collapsed)
  useEffect(() => { collapsedRef.current = collapsed }, [collapsed])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      buildPoints()
    }

    let points: Point[] = []

    const buildPoints = () => {
      const W = canvas.width
      const H = canvas.height
      const cx = W / 2
      const cy = H / 2

      points = Array.from({ length: N_POINTS }, (_, i) => {
        // Messy cloud: random Gaussian-like spread
        const angle = Math.random() * Math.PI * 2
        const r = Math.random() * Math.min(W, H) * 0.38
        const ox = cx + Math.cos(angle) * r * (0.5 + Math.random() * 0.5)
        const oy = cy + Math.sin(angle) * r * (0.5 + Math.random() * 0.5)

        // Collapsed: majority on principal line (horizontal, slight tilt)
        // Top-k kept: bright, near-axis; rest pushed very sparse
        const isTopK = i < N_POINTS * 0.35  // 35% principal
        let tx: number, ty: number

        if (isTopK) {
          // Snap to horizontal axis with small spread
          const t = (i / (N_POINTS * 0.35)) * 2 - 1
          tx = cx + t * W * 0.38
          ty = cy + t * W * 0.015 + (Math.random() - 0.5) * 8
        } else {
          // Pushed far off-axis — sparse, faint
          const j = i - N_POINTS * 0.35
          const spread = 0.55
          tx = cx + (Math.random() - 0.5) * W * spread
          ty = cy + (Math.random() > 0.5 ? 1 : -1) * (H * 0.3 + Math.random() * H * 0.1)
        }

        return {
          ox, oy, tx, ty,
          x: ox, y: oy,
          vx: 0, vy: 0,
          brightness: isTopK ? 0.8 + Math.random() * 0.2 : 0.15 + Math.random() * 0.15,
          phase: Math.random() * Math.PI * 2,
        }
      })
    }

    buildPoints()
    window.addEventListener('resize', resize)

    let t = 0
    let raf: number

    const animate = () => {
      t += 0.012
      const W = canvas.width
      const H = canvas.height
      const cx = W / 2
      const cy = H / 2
      const isCollapsed = collapsedRef.current

      ctx.fillStyle = 'rgba(8, 12, 30, 0.2)'
      ctx.fillRect(0, 0, W, H)

      // Spring physics toward target
      points.forEach(p => {
        const tx = isCollapsed ? p.tx : p.ox
        const ty = isCollapsed ? p.ty : p.oy
        const stagger = isCollapsed ? 1 : 1

        const dx = tx - p.x
        const dy = ty - p.y
        p.vx += dx * 0.06 * stagger
        p.vy += dy * 0.06 * stagger
        p.vx *= 0.82
        p.vy *= 0.82
        p.x += p.vx
        p.y += p.vy
      })

      // ── Draw rotation axis (appears when collapsed) ──
      const axisProgress = Math.max(0, Math.min(1,
        isCollapsed
          ? (t % 20 > 2 ? 1 : (t % 20) / 2)
          : 0
      ))

      if (axisProgress > 0.01) {
        const axisLen = W * 0.44 * axisProgress
        const tiltY = axisLen * 0.04  // slight tilt to match collapsed line

        // Glow aura
        const axisGrad = ctx.createLinearGradient(cx - axisLen, cy - tiltY, cx + axisLen, cy + tiltY)
        axisGrad.addColorStop(0, 'rgba(6, 182, 212, 0)')
        axisGrad.addColorStop(0.5, `rgba(6, 182, 212, ${0.25 * axisProgress})`)
        axisGrad.addColorStop(1, 'rgba(6, 182, 212, 0)')
        ctx.beginPath()
        ctx.moveTo(cx - axisLen, cy - tiltY)
        ctx.lineTo(cx + axisLen, cy + tiltY)
        ctx.strokeStyle = axisGrad
        ctx.lineWidth = 12
        ctx.stroke()

        // Core axis line
        const coreGrad = ctx.createLinearGradient(cx - axisLen, cy - tiltY, cx + axisLen, cy + tiltY)
        coreGrad.addColorStop(0, 'rgba(6, 182, 212, 0)')
        coreGrad.addColorStop(0.5, `rgba(6, 182, 212, ${0.9 * axisProgress})`)
        coreGrad.addColorStop(1, 'rgba(6, 182, 212, 0)')
        ctx.beginPath()
        ctx.moveTo(cx - axisLen, cy - tiltY)
        ctx.lineTo(cx + axisLen, cy + tiltY)
        ctx.strokeStyle = coreGrad
        ctx.lineWidth = 1.5
        ctx.shadowColor = '#06b6d4'
        ctx.shadowBlur = 6
        ctx.stroke()
        ctx.shadowBlur = 0

        // "Rotation Trick" label
        ctx.font = '9px monospace'
        ctx.fillStyle = `rgba(6, 182, 212, ${0.5 * axisProgress})`
        ctx.textAlign = 'center'
        ctx.fillText('ROTATION AXIS  ·  Principal Subspace', cx, cy - Math.min(H, W) * 0.38 - 8)
      }

      // ── Draw points ──
      points.forEach((p, i) => {
        const isTopK = i < N_POINTS * 0.35
        const pulse = isTopK ? 0.7 + Math.sin(t * 3 + p.phase) * 0.3 : 1

        // Color: principal = cyan, sparse = dim slate
        const alpha = isCollapsed
          ? (isTopK ? p.brightness * pulse : p.brightness * 0.4)
          : p.brightness * 0.5

        if (isTopK && isCollapsed) {
          // Bright principal components with glow
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 7)
          glow.addColorStop(0, `rgba(6, 182, 212, ${alpha * 0.6})`)
          glow.addColorStop(1, 'rgba(6, 182, 212, 0)')
          ctx.beginPath()
          ctx.arc(p.x, p.y, 7, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()

          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(6, 182, 212, ${alpha})`
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = isCollapsed
            ? `rgba(80, 100, 140, ${alpha})`
            : `rgba(200, 210, 240, ${alpha})`
          ctx.fill()
        }
      })

      // Caption
      ctx.font = '9px monospace'
      ctx.fillStyle = 'rgba(100, 120, 160, 0.4)'
      ctx.textAlign = 'right'
      ctx.fillText(
        isCollapsed ? '35% principal  ·  65% sparse' : 'Raw high-dimensional data',
        W - 12,
        H - 12
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
      className="absolute inset-0 w-full h-full"
      style={{ pointerEvents: 'none' }}
    />
  )
}
