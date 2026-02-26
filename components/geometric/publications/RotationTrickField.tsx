'use client'

import { useEffect, useRef, useState } from 'react'
import katex from 'katex'

// ─── Types ──────────────────────────────────────────────────────────────────
interface Pt3 { x: number; y: number; z: number; baseX: number; baseY: number; baseZ: number; phase: number; isTopK: boolean }

// ─── Helpers ─────────────────────────────────────────────────────────────────
function orthoProject(x: number, y: number, z: number, cx: number, cy: number, scale: number) {
  // Pure orthographic — no perspective divide. Blueprint / lab-scan aesthetic.
  return {
    sx: cx + x * scale,
    sy: cy - y * scale + z * scale * 0.35,
  }
}

function buildCloud(N: number): Pt3[] {
  return Array.from({ length: N }, (_, i) => {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 0.5 + Math.random() * 0.5
    return {
      x: r * Math.sin(phi) * Math.cos(theta),
      y: r * Math.sin(phi) * Math.sin(theta),
      z: r * Math.cos(phi),
      baseX: r * Math.sin(phi) * Math.cos(theta),
      baseY: r * Math.sin(phi) * Math.sin(theta),
      baseZ: r * Math.cos(phi),
      phase: Math.random() * Math.PI * 2,
      isTopK: i < N * 0.35,
    }
  })
}

// ─── Main Component ──────────────────────────────────────────────────────────
export default function RotationTrickField({ scrollProgress }: { scrollProgress: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollRef = useRef(scrollProgress)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)
  const [hovered, setHovered] = useState(false)
  const [katexHTML, setKatexHTML] = useState('')

  useEffect(() => { scrollRef.current = scrollProgress }, [scrollProgress])

  useEffect(() => {
    setKatexHTML(katex.renderToString('\\mathbf{R} \\in SO(3)', { throwOnError: false, output: 'html' }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const N = 80
    const basePoints = buildCloud(N)
    // Separate sets for left (baseline) and right (RT)
    const leftPts: Pt3[] = basePoints.map(p => ({ ...p }))
    const rightPts: Pt3[] = basePoints.map(p => ({ ...p }))

    // Targets for right side: isTopK → snap to X axis, rest pushed far off
    const rightTargets = rightPts.map((p, i) => {
      if (p.isTopK) {
        const t = (i / (N * 0.35)) * 2 - 1
        return { x: t, y: p.baseY * 0.08, z: p.baseZ * 0.08 }
      } else {
        return { x: p.baseX * 1.2, y: p.baseY * 1.4, z: p.baseZ * 1.4 }
      }
    })

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      setHovered(true)
    }
    const onMouseLeave = () => {
      mouseRef.current = null
      setHovered(false)
    }
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    let t = 0
    let raf: number

    const animate = () => {
      t += 0.008
      const W = canvas.width
      const H = canvas.height
      const prog = Math.max(0, Math.min(1, scrollRef.current))

      ctx.clearRect(0, 0, W, H)

      // ── Panel divider ──
      const midX = W / 2
      ctx.beginPath()
      ctx.moveTo(midX, 20)
      ctx.lineTo(midX, H - 20)
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Panel labels
      ctx.font = '9px monospace'
      ctx.textAlign = 'center'
      ctx.fillStyle = 'rgba(148,163,184,0.3)'
      ctx.fillText('Baseline TopK-SAE', midX / 2, 20)
      ctx.fillStyle = 'rgba(6,182,212,0.4)'
      ctx.fillText('Ours (Geometric Rotation)', midX + midX / 2, 20)

      // Scale factor
      const scale = Math.min(W, H) * 0.28

      // ── LEFT: Baseline — always chaotic, gently rotate ──
      const leftCx = W * 0.25
      const leftCy = H * 0.5
      const lRot = t * 0.4

      // Coordinate frame (faint, baseline)
      const axes = [
        { dx: 1, dy: 0, dz: 0, color: '239,68,68' },
        { dx: 0, dy: 1, dz: 0, color: '34,197,94' },
        { dx: 0, dy: 0, dz: 1, color: '99,102,241' },
      ]
      axes.forEach(({ dx, dy, dz, color }) => {
        const ex = Math.cos(lRot) * dx - Math.sin(lRot) * dy
        const ey = Math.sin(lRot) * dx + Math.cos(lRot) * dy
        const ep = orthoProject(ex * 0.55, ey * 0.55, dz * 0.55, leftCx, leftCy, scale)
        const op = orthoProject(0, 0, 0, leftCx, leftCy, scale)
        ctx.beginPath()
        ctx.moveTo(op.sx, op.sy)
        ctx.lineTo(ep.sx, ep.sy)
        ctx.strokeStyle = `rgba(${color}, 0.25)`
        ctx.lineWidth = 1
        ctx.stroke()
      })

      leftPts.forEach((p) => {
        const rx = Math.cos(lRot) * p.baseX - Math.sin(lRot) * p.baseY
        const ry = Math.sin(lRot) * p.baseX + Math.cos(lRot) * p.baseY
        const { sx, sy } = orthoProject(rx, ry, p.baseZ, leftCx, leftCy, scale)
        const alpha = 0.3 + Math.sin(t * 1.5 + p.phase) * 0.1
        ctx.beginPath()
        ctx.arc(sx, sy, 1.8, 0, Math.PI * 2)
        ctx.fillStyle = p.isTopK
          ? `rgba(168,85,247,${alpha})`
          : `rgba(100,120,160,${alpha * 0.5})`
        ctx.fill()
      })

      // Information loss annotation on left
      if (prog > 0.3) {
        ctx.font = '8px monospace'
        ctx.fillStyle = `rgba(239,68,68,${(prog - 0.3) * 0.6})`
        ctx.textAlign = 'center'
        ctx.fillText('↳ principal components mixed', leftCx, H - 24)
      }

      // ── RIGHT: RT-TopKSAE — R sweeps through, points crystallize ──
      const rightCx = W * 0.75
      const rightCy = H * 0.5
      const rRot = t * 0.3

      // Lerp points toward aligned targets
      rightPts.forEach((p, i) => {
        p.x += (rightTargets[i].x * prog - p.x) * 0.04
        p.y += (rightTargets[i].y * prog + p.baseY * (1 - prog) - p.y) * 0.04
        p.z += (rightTargets[i].z * prog + p.baseZ * (1 - prog) - p.z) * 0.04
      })

      // Principal axis appears with progress
      if (prog > 0.15) {
        const axProg = Math.min(1, (prog - 0.15) / 0.5)
        const axLen = 0.9 * axProg
        const ap1 = orthoProject(-axLen, 0, 0, rightCx, rightCy, scale)
        const ap2 = orthoProject(axLen, 0, 0, rightCx, rightCy, scale)

        // Glow
        const axGrad = ctx.createLinearGradient(ap1.sx, ap1.sy, ap2.sx, ap2.sy)
        axGrad.addColorStop(0, 'rgba(6,182,212,0)')
        axGrad.addColorStop(0.5, `rgba(6,182,212,${0.3 * axProg})`)
        axGrad.addColorStop(1, 'rgba(6,182,212,0)')
        ctx.beginPath()
        ctx.moveTo(ap1.sx, ap1.sy)
        ctx.lineTo(ap2.sx, ap2.sy)
        ctx.strokeStyle = axGrad
        ctx.lineWidth = 10
        ctx.stroke()
        // Core
        ctx.strokeStyle = `rgba(6,182,212,${0.85 * axProg})`
        ctx.lineWidth = 1.5
        ctx.shadowColor = '#06b6d4'
        ctx.shadowBlur = 8
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      // Rotation Operator R frame (rotates at rRot, sweeps in with prog)
      if (prog > 0.05) {
        const rProg = Math.min(1, (prog - 0.05) / 0.5)
        const frameAxes = [
          { dx: 1, dy: 0, dz: 0, color: '6,182,212', label: 'e₁' },
          { dx: 0, dy: 1, dz: 0, color: '168,85,247', label: 'e₂' },
          { dx: 0, dy: 0, dz: 1, color: '99,102,241', label: 'e₃' },
        ]
        frameAxes.forEach(({ dx, dy, dz, color, label }) => {
          const ex = Math.cos(rRot) * dx - Math.sin(rRot) * dy
          const ey = Math.sin(rRot) * dx + Math.cos(rRot) * dy
          const len = 0.5 * rProg
          const ep = orthoProject(ex * len, ey * len, dz * len, rightCx, rightCy, scale)
          const op = orthoProject(0, 0, 0, rightCx, rightCy, scale)
          ctx.beginPath()
          ctx.moveTo(op.sx, op.sy)
          ctx.lineTo(ep.sx, ep.sy)
          ctx.strokeStyle = `rgba(${color}, ${0.7 * rProg})`
          ctx.lineWidth = 1.5
          ctx.stroke()
          // tip dot
          ctx.beginPath()
          ctx.arc(ep.sx, ep.sy, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${color}, ${0.9 * rProg})`
          ctx.fill()
          // label
          ctx.font = `9px monospace`
          ctx.fillStyle = `rgba(${color}, ${0.6 * rProg})`
          ctx.textAlign = 'center'
          ctx.fillText(label, ep.sx, ep.sy - 6)
        })
      }

      rightPts.forEach((p) => {
        const rx = Math.cos(rRot * 0.2) * p.x - Math.sin(rRot * 0.2) * p.y
        const ry = Math.sin(rRot * 0.2) * p.x + Math.cos(rRot * 0.2) * p.y
        const { sx, sy } = orthoProject(rx, ry, p.z, rightCx, rightCy, scale)

        const crystallized = prog > 0.4 && p.isTopK
        const pulse = crystallized ? 0.6 + Math.sin(t * 4 + p.phase) * 0.4 : 1

        if (crystallized) {
          // Glow halo
          const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 8)
          g.addColorStop(0, `rgba(6,182,212,${0.4 * pulse})`)
          g.addColorStop(1, 'rgba(6,182,212,0)')
          ctx.beginPath()
          ctx.arc(sx, sy, 8, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()

          ctx.beginPath()
          ctx.arc(sx, sy, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(6,182,212,${0.9 * pulse})`
          ctx.fill()
        } else {
          const alpha = p.isTopK ? 0.5 : 0.15
          ctx.beginPath()
          ctx.arc(sx, sy, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = p.isTopK
            ? `rgba(168,85,247,${alpha})`
            : `rgba(80,100,140,${alpha})`
          ctx.fill()
        }
      })

      // Retention metric
      if (prog > 0.5) {
        const metricProg = Math.min(1, (prog - 0.5) / 0.4)
        const pct = Math.round(40 * metricProg)
        ctx.font = 'bold 22px monospace'
        ctx.fillStyle = `rgba(6,182,212,${0.8 * metricProg})`
        ctx.textAlign = 'center'
        ctx.fillText(`+${pct}%`, rightCx, H - 36)
        ctx.font = '8px monospace'
        ctx.fillStyle = `rgba(100,160,200,${0.5 * metricProg})`
        ctx.fillText('principal component retention', rightCx, H - 22)
      }

      raf = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <div className="relative w-full" style={{ height: 380 }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ cursor: 'crosshair' }}
      />
      {/* KaTeX overlay fades in on hover */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-500 font-mono text-sm"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        <div
          className="px-4 py-2 rounded-xl text-slate-300"
          style={{ background: 'rgba(8,12,30,0.85)', border: '1px solid rgba(6,182,212,0.3)' }}
          dangerouslySetInnerHTML={{ __html: katexHTML }}
        />
      </div>
    </div>
  )
}
