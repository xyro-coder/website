'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import katex from 'katex'

// ─── Types ────────────────────────────────────────────────────────────────────
interface Pt3 {
  baseX: number; baseY: number; baseZ: number
  phase: number; isTopK: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function ortho(x: number, y: number, z: number, cx: number, cy: number, scale: number) {
  return { sx: cx + x * scale, sy: cy - y * scale + z * scale * 0.35 }
}

function buildCloud(N: number): Pt3[] {
  return Array.from({ length: N }, (_, i) => {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 0.5 + Math.random() * 0.5
    return {
      baseX: r * Math.sin(phi) * Math.cos(theta),
      baseY: r * Math.sin(phi) * Math.sin(theta),
      baseZ: r * Math.cos(phi),
      phase: Math.random() * Math.PI * 2,
      isTopK: i < N * 0.35,
    }
  })
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function RotationTrickField({ scrollProgress: _unused }: { scrollProgress?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotRef = useRef(false)          // whether SO(3) rotation is ON
  const transRef = useRef(0)            // 0 = chaos, 1 = aligned (animated)
  const sparsityRef = useRef(10)        // live metric value
  const ptsRef = useRef<Pt3[]>([])
  const targetsRef = useRef<{ x: number; y: number; z: number }[]>([])

  const [rotationOn, setRotationOn] = useState(false)
  const [sparsityDisplay, setSparsityDisplay] = useState(10)
  const [hovered, setHovered] = useState(false)
  const [katexHTML, setKatexHTML] = useState('')

  useEffect(() => {
    setKatexHTML(katex.renderToString('\\mathbf{R} \\in SO(3)', { throwOnError: false, output: 'html' }))
  }, [])

  const matrixRef = useRef<HTMLPreElement>(null)
  const fRotRef = useRef(0)

  const toggle = useCallback(() => {
    const next = !rotRef.current
    rotRef.current = next
    setRotationOn(next)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const N = 100
    ptsRef.current = buildCloud(N)

    // Aligned targets: isTopK → X axis (sparse), rest → pushed outward
    targetsRef.current = ptsRef.current.map((p, i) => {
      if (p.isTopK) {
        const t = (i / (N * 0.35)) * 2 - 1
        return { x: t, y: 0, z: 0 }
      }
      return { x: p.baseX * 1.4, y: p.baseY * 1.6, z: p.baseZ * 1.4 }
    })

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onEnter = () => setHovered(true)
    const onLeave = () => setHovered(false)
    canvas.addEventListener('mouseenter', onEnter)
    canvas.addEventListener('mouseleave', onLeave)

    let t = 0
    let raf: number

    const animate = () => {
      t += 0.01
      const W = canvas.width
      const H = canvas.height
      const on = rotRef.current

      // Transition speed
      const targetT = on ? 1 : 0
      transRef.current += (targetT - transRef.current) * 0.028

      // Sparsity metric (10% → 40%)
      const targetSparsity = on ? 40 : 10
      sparsityRef.current += (targetSparsity - sparsityRef.current) * 0.018
      setSparsityDisplay(Math.round(sparsityRef.current))

      const tr = transRef.current

      ctx.clearRect(0, 0, W, H)

      const scale = Math.min(W, H) * 0.34
      const cx = W / 2
      const cy = H / 2
      const rot = t * 0.22   // slow ambient rotation

      // ── Principal axis (emerges as tr increases) ──
      if (tr > 0.08) {
        const axLen = 0.92 * tr
        const ap1 = ortho(-axLen, 0, 0, cx, cy, scale)
        const ap2 = ortho(axLen, 0, 0, cx, cy, scale)

        const axGrad = ctx.createLinearGradient(ap1.sx, ap1.sy, ap2.sx, ap2.sy)
        axGrad.addColorStop(0, 'rgba(6,182,212,0)')
        axGrad.addColorStop(0.5, `rgba(6,182,212,${0.28 * tr})`)
        axGrad.addColorStop(1, 'rgba(6,182,212,0)')
        ctx.beginPath()
        ctx.moveTo(ap1.sx, ap1.sy)
        ctx.lineTo(ap2.sx, ap2.sy)
        ctx.strokeStyle = axGrad
        ctx.lineWidth = 14
        ctx.stroke()

        ctx.strokeStyle = `rgba(6,182,212,${0.9 * tr})`
        ctx.lineWidth = 1.5
        ctx.shadowColor = '#06b6d4'
        ctx.shadowBlur = 10
        ctx.stroke()
        ctx.shadowBlur = 0
      }

      // ── SO(3) frame axes (spin in with tr) ──
      if (tr > 0.05) {
        const frameAxes = [
          { dx: 1, dy: 0, dz: 0, col: '6,182,212', label: 'e₁' },
          { dx: 0, dy: 1, dz: 0, col: '168,85,247', label: 'e₂' },
          { dx: 0, dy: 0, dz: 1, col: '99,102,241', label: 'e₃' },
        ]
        const fRot = t * 0.32
        fRotRef.current = fRot

        // Live matrix display — update DOM directly (no React re-render overhead)
        if (matrixRef.current) {
          const c = Math.cos(fRot)
          const s = Math.sin(fRot)
          const fmt = (v: number) => (v >= 0 ? ' ' : '') + v.toFixed(3)
          matrixRef.current.textContent =
            `⎡${fmt(c)} ${fmt(-s)}  0.000⎤\n` +
            `⎢${fmt(s)}  ${fmt(c)}  0.000⎥\n` +
            `⎣ 0.000   0.000  1.000⎦`
        }
        frameAxes.forEach(({ dx, dy, dz, col, label }) => {
          const ex = Math.cos(fRot) * dx - Math.sin(fRot) * dy
          const ey = Math.sin(fRot) * dx + Math.cos(fRot) * dy
          const len = 0.46 * tr
          const ep = ortho(ex * len, ey * len, dz * len, cx, cy, scale)
          const op = ortho(0, 0, 0, cx, cy, scale)
          ctx.beginPath()
          ctx.moveTo(op.sx, op.sy)
          ctx.lineTo(ep.sx, ep.sy)
          ctx.strokeStyle = `rgba(${col},${0.7 * tr})`
          ctx.lineWidth = 1.5
          ctx.stroke()
          ctx.beginPath()
          ctx.arc(ep.sx, ep.sy, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${col},${0.9 * tr})`
          ctx.fill()
          ctx.font = '8px monospace'
          ctx.fillStyle = `rgba(${col},${0.65 * tr})`
          ctx.textAlign = 'center'
          ctx.fillText(label, ep.sx, ep.sy - 8)
        })
      }

      // ── Points ──
      ptsRef.current.forEach((p, i) => {
        const tg = targetsRef.current[i]
        // Chaos drift (1−tr) + target alignment (tr)
        const drift = (1 - tr) * 0.05
        const baseWithDrift = {
          x: p.baseX + Math.sin(t * 0.85 + p.phase) * drift,
          y: p.baseY + Math.cos(t * 0.65 + p.phase) * drift,
        }
        const curX = baseWithDrift.x + (tg.x - baseWithDrift.x) * tr
        const curY = baseWithDrift.y + (tg.y - baseWithDrift.y) * tr
        const curZ = p.baseZ * (1 - tr) + tg.z * tr

        // Apply slow ambient rotation
        const rx = Math.cos(rot) * curX - Math.sin(rot) * curY
        const ry = Math.sin(rot) * curX + Math.cos(rot) * curY

        const { sx, sy } = ortho(rx, ry, curZ, cx, cy, scale)

        const crystallized = tr > 0.55 && p.isTopK
        const pulse = crystallized ? 0.6 + Math.sin(t * 4.5 + p.phase) * 0.4 : 1

        if (crystallized) {
          const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 11)
          g.addColorStop(0, `rgba(6,182,212,${0.45 * pulse})`)
          g.addColorStop(1, 'rgba(6,182,212,0)')
          ctx.beginPath()
          ctx.arc(sx, sy, 11, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()

          ctx.beginPath()
          ctx.arc(sx, sy, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(6,182,212,${0.95 * pulse})`
          ctx.fill()
        } else {
          const col = p.isTopK ? '168,85,247' : '80,100,140'
          const alpha = p.isTopK
            ? 0.4 + Math.sin(t * 1.6 + p.phase) * 0.12
            : 0.12 + Math.sin(t * 1.1 + p.phase) * 0.04
          ctx.beginPath()
          ctx.arc(sx, sy, p.isTopK ? 2 : 1.2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${col},${alpha})`
          ctx.fill()
        }
      })

      // ── State annotation ──
      ctx.font = '8px monospace'
      ctx.textAlign = 'center'
      ctx.fillStyle = on
        ? `rgba(6,182,212,${0.35 + tr * 0.2})`
        : 'rgba(148,163,184,0.25)'
      ctx.fillText(
        on ? '↳ principal components aligned  ·  gradient preserved' : '↳ principal components mixed  ·  gradient signal lost',
        cx, H - 20
      )

      raf = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mouseenter', onEnter)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <div className="relative w-full" style={{ height: 380 }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full canvas-void"
        style={{ cursor: 'crosshair' }}
      />

      {/* ── Live SO(3) matrix — updates every frame via direct DOM write ── */}
      <div
        className="absolute top-4 left-4 z-10 transition-opacity duration-500"
        style={{ opacity: rotationOn ? 1 : 0.3 }}
      >
        <div className="text-xs font-mono text-slate-600 mb-1 uppercase tracking-widest">
          R ∈ SO(3)
        </div>
        <pre
          ref={matrixRef}
          className="text-xs font-mono leading-relaxed"
          style={{
            color: rotationOn ? 'rgba(6,182,212,0.85)' : 'rgba(168,85,247,0.45)',
            background: 'rgba(8,12,30,0.6)',
            backdropFilter: 'blur(8px)',
            padding: '0.5rem 0.75rem',
            borderRadius: 8,
            border: `1px solid ${rotationOn ? 'rgba(6,182,212,0.2)' : 'rgba(168,85,247,0.1)'}`,
            letterSpacing: '0.03em',
            whiteSpace: 'pre',
            transition: 'color 0.5s, border-color 0.5s',
          }}
        >
          {`⎡ 1.000  0.000  0.000⎤\n⎢ 0.000  1.000  0.000⎥\n⎣ 0.000  0.000  1.000⎦`}
        </pre>
      </div>

      {/* ── Toggle button ── */}
      <div className="absolute top-4 right-4 flex items-center gap-3 z-10">
        <span className="text-xs font-mono text-slate-600">
          {rotationOn ? 'SO(3) ACTIVE' : 'BASELINE'}
        </span>
        <button
          onClick={toggle}
          className="relative w-12 h-6 rounded-full focus:outline-none transition-colors duration-500"
          style={{
            background: rotationOn ? 'rgba(6,182,212,0.25)' : 'rgba(255,255,255,0.07)',
            border: rotationOn ? '1px solid rgba(6,182,212,0.55)' : '1px solid rgba(255,255,255,0.1)',
          }}
          aria-label="Toggle SO(3) rotation"
        >
          <span
            className="absolute top-0.5 w-5 h-5 rounded-full transition-all duration-500"
            style={{
              left: rotationOn ? '1.5rem' : '0.125rem',
              background: rotationOn ? 'rgb(6,182,212)' : 'rgba(100,120,160,0.6)',
              boxShadow: rotationOn ? '0 0 12px rgba(6,182,212,0.9)' : 'none',
            }}
          />
        </button>
        <span
          className="text-xs font-mono uppercase tracking-widest"
          style={{ color: rotationOn ? 'rgb(6,182,212)' : 'rgb(80,100,130)' }}
        >
          Toggle Rotation
        </span>
      </div>

      {/* ── Live sparsity metric ── */}
      <div className="absolute bottom-8 left-5 font-mono z-10">
        <div className="text-xs text-slate-700 mb-1 uppercase tracking-widest">Sparsity Metric</div>
        <div className="flex items-end gap-2 mb-2">
          <span
            className="text-4xl font-bold leading-none transition-colors duration-500"
            style={{ color: rotationOn ? 'rgb(6,182,212)' : 'rgb(168,85,247)' }}
          >
            {sparsityDisplay}%
          </span>
          <span className="text-xs text-slate-600 mb-1">
            {rotationOn ? '↑ RT mode' : 'baseline'}
          </span>
        </div>
        <div className="w-36 h-px rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${(sparsityDisplay / 40) * 100}%`,
              background: rotationOn ? 'rgb(6,182,212)' : 'rgb(168,85,247)',
              boxShadow: rotationOn ? '0 0 8px rgba(6,182,212,0.6)' : 'none',
            }}
          />
        </div>
      </div>

      {/* ── KaTeX overlay on hover ── */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none transition-opacity duration-500"
        style={{ opacity: hovered ? 1 : 0 }}
      >
        <div
          className="px-4 py-2 rounded-xl text-slate-300 font-mono text-sm"
          style={{ background: 'rgba(8,12,30,0.88)', border: '1px solid rgba(6,182,212,0.3)' }}
          dangerouslySetInnerHTML={{ __html: katexHTML }}
        />
      </div>
    </div>
  )
}
