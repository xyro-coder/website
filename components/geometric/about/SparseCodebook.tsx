'use client'

import { useEffect, useRef } from 'react'

// RT-TopKSAE Feature Dictionary — 128 feature atoms as oriented needles on a unit circle.
// Mouse = input probe; top-K activate via cosine similarity.
// The activated subspace drifts (rotation trick) — keeping all atoms alive.
// Interference bridges drawn between co-active features < 28° apart.
// Orbit particles on active features show equivariant SO(2) motion.

const DICT  = 128
const TOP_K = 8

interface Feature {
  angle:      number
  activation: number
  target:     number
  phase:      number
  mag:        number  // base magnitude 0.6–1
}

export default function SparseCodebook() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const rng = (a: number, b: number) => a + Math.random() * (b - a)

    // ── Feature vectors ──────────────────────────────────────────────────────
    const features: Feature[] = Array.from({ length: DICT }, (_, i) => ({
      angle:      (i / DICT) * Math.PI * 2 + rng(-0.08, 0.08),
      activation: 0,
      target:     0,
      phase:      rng(0, Math.PI * 2),
      mag:        rng(0.6, 1.0),
    }))

    // ── Pre-built glow sprites — no createRadialGradient per frame ───────────
    const mkGlow = (r: number, g: number, b: number, R: number) => {
      const s  = document.createElement('canvas')
      s.width  = R * 2; s.height = R * 2
      const sc = s.getContext('2d')!
      const gr = sc.createRadialGradient(R, R, 0, R, R, R)
      gr.addColorStop(0,   `rgba(${r},${g},${b},1)`)
      gr.addColorStop(0.35,`rgba(${r},${g},${b},0.45)`)
      gr.addColorStop(1,   `rgba(${r},${g},${b},0)`)
      sc.fillStyle = gr; sc.fillRect(0, 0, R * 2, R * 2)
      return s
    }
    const gCyan   = mkGlow(6,   182, 212, 72)
    const gPurple = mkGlow(168,  85, 247, 52)
    const gWhite  = mkGlow(255, 255, 255, 90)

    // ── Orbit particles ──────────────────────────────────────────────────────
    const orbiters = Array.from({ length: 32 }, () => ({
      fi:    Math.floor(Math.random() * DICT),
      angle: rng(0, Math.PI * 2),
      speed: rng(0.06, 0.16) * (Math.random() < 0.5 ? 1 : -1),
      dist:  rng(8, 20),
    }))

    // ── Fire-flash state ─────────────────────────────────────────────────────
    const fireTimer = new Float32Array(DICT)
    let prevTopK: number[] = []
    let pulsePow = 0
    let pulseRad = 0

    let t   = 0
    let raf = 0
    let isVisible = true
    const obs = new IntersectionObserver(([e]) => { isVisible = e.isIntersecting }, { threshold: 0.01 })
    obs.observe(canvas)

    const onMouseMove  = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const onMouseLeave = () => { mouseRef.current = null }
    canvas.addEventListener('mousemove',  onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    const getTopK = (probe: number): number[] =>
      features
        .map((f, i) => ({ i, sim: Math.cos(f.angle - probe) }))
        .sort((a, b) => b.sim - a.sim)
        .slice(0, TOP_K)
        .map(s => s.i)

    // ── Main loop ────────────────────────────────────────────────────────────
    const draw = () => {
      raf = requestAnimationFrame(draw)
      if (!isVisible) return
      t += 0.016

      const W  = canvas.width,  H  = canvas.height
      const cx = W / 2,         cy = H / 2
      const R  = Math.min(W, H) * 0.40   // outer radius px
      const INNER = 0.12                  // needle start fraction
      const OUTER = 0.92                  // needle tip fraction

      // Ghost trail
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.fillStyle   = 'rgba(0,0,0,0.22)'
      ctx.fillRect(0, 0, W, H)

      // Probe angle
      const mouse      = mouseRef.current
      const probeAngle = mouse
        ? Math.atan2(mouse.y - cy, mouse.x - cx)
        : (t * 0.15) % (Math.PI * 2) - Math.PI

      // TopK
      const topK    = getTopK(probeAngle)
      const topKSet = new Set(topK)

      // Pulse on set change
      if (topK.some(i => !prevTopK.includes(i))) { pulsePow = 1; pulseRad = 0 }
      prevTopK = topK

      // Rotation trick: active atoms drift
      topK.forEach(i => { features[i].angle += 0.00042 })

      // Fire timers
      topK.forEach(i => { if (fireTimer[i] < 0.1) fireTimer[i] = 1.0 })
      for (let i = 0; i < DICT; i++) {
        if (fireTimer[i] > 0) { fireTimer[i] *= 0.88; if (fireTimer[i] < 0.015) fireTimer[i] = 0 }
      }

      // Smooth activations
      features.forEach((f, i) => {
        f.target     = topKSet.has(i) ? 1.0 : 0.0
        f.activation += (f.target - f.activation) * 0.13
      })

      // ── Additive layer ───────────────────────────────────────────────────
      ctx.globalCompositeOperation = 'lighter'

      // Pulse ring
      if (pulsePow > 0.02) {
        pulsePow *= 0.91; pulseRad += 11
        ctx.globalAlpha = pulsePow * 0.32
        ctx.beginPath(); ctx.arc(cx, cy, pulseRad, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(6,182,212,1)'; ctx.lineWidth = 3; ctx.stroke()
        ctx.globalAlpha = 1
      }

      // Inactive halos — dim purple pulse
      features.forEach(f => {
        if (f.activation > 0.08) return
        const fx = cx + Math.cos(f.angle) * R * OUTER
        const fy = cy + Math.sin(f.angle) * R * OUTER
        const dim = ((Math.sin(t * 0.7 + f.phase) + 1) * 0.5) * 0.032 * f.mag
        ctx.globalAlpha = dim
        ctx.drawImage(gPurple, fx - 26, fy - 26, 52, 52)
      })
      ctx.globalAlpha = 1

      // Active halos — bright cyan
      features.forEach((f, i) => {
        if (f.activation < 0.05) return
        const fx  = cx + Math.cos(f.angle) * R * OUTER
        const fy  = cy + Math.sin(f.angle) * R * OUTER
        const a   = f.activation
        const fb  = fireTimer[i]
        const gr  = (55 + fb * 38) * a
        ctx.globalAlpha = (a * 0.55 + fb * 0.28) * 0.85
        ctx.drawImage(gCyan, fx - gr, fy - gr, gr * 2, gr * 2)
        ctx.globalAlpha = a * 0.85 + fb * 0.4
        ctx.drawImage(gCyan, fx - 14, fy - 14, 28, 28)
      })
      ctx.globalAlpha = 1

      // Interference bridges — warm amber between nearby co-active features
      for (let i = 0; i < DICT; i++) {
        if (features[i].activation < 0.38) continue
        for (let j = i + 1; j < DICT; j++) {
          if (features[j].activation < 0.38) continue
          let dA = Math.abs(features[i].angle - features[j].angle)
          if (dA > Math.PI) dA = Math.PI * 2 - dA
          if (dA < 0.01 || dA > 0.48) continue
          const x1 = cx + Math.cos(features[i].angle) * R * OUTER
          const y1 = cy + Math.sin(features[i].angle) * R * OUTER
          const x2 = cx + Math.cos(features[j].angle) * R * OUTER
          const y2 = cy + Math.sin(features[j].angle) * R * OUTER
          ctx.globalAlpha = features[i].activation * features[j].activation * 0.45
          ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2)
          ctx.strokeStyle = 'rgba(255,180,80,1)'; ctx.lineWidth = 1.4; ctx.stroke()
        }
      }
      ctx.globalAlpha = 1

      // Orbit particles
      orbiters.forEach(p => {
        const f = features[p.fi]
        if (f.activation < 0.25) return
        p.angle += p.speed * (1 + f.activation) * 0.8
        const fx = cx + Math.cos(f.angle) * R * OUTER
        const fy = cy + Math.sin(f.angle) * R * OUTER
        const px = fx + Math.cos(p.angle) * p.dist
        const py = fy + Math.sin(p.angle) * p.dist
        ctx.globalAlpha = f.activation * 0.75
        ctx.beginPath(); ctx.arc(px, py, 1.8, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(6,212,255,1)'; ctx.fill()
      })
      ctx.globalAlpha = 1

      // ── Source-over layer: structure + needles ───────────────────────────
      ctx.globalCompositeOperation = 'source-over'

      // Dictionary rings
      for (const [frac, alpha] of [[OUTER, 0.07], [INNER, 0.04]] as [number, number][]) {
        ctx.beginPath(); ctx.arc(cx, cy, R * frac, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(100,120,180,${alpha})`; ctx.lineWidth = 0.8; ctx.stroke()
      }

      // Active subspace arc
      if (topK.length > 0) {
        const sorted = topK.map(i => features[i].angle).sort((a, b) => a - b)
        ctx.globalCompositeOperation = 'lighter'
        ctx.beginPath()
        ctx.arc(cx, cy, R * (OUTER + 0.07), sorted[0] - 0.05, sorted[sorted.length - 1] + 0.05)
        ctx.strokeStyle = 'rgba(6,182,212,0.18)'; ctx.lineWidth = 9; ctx.stroke()
        ctx.globalCompositeOperation = 'source-over'
      }

      // Feature needles
      features.forEach((f, i) => {
        const a   = f.activation
        const fb  = fireTimer[i]
        const ix  = cx + Math.cos(f.angle) * R * INNER
        const iy  = cy + Math.sin(f.angle) * R * INNER
        const ox  = cx + Math.cos(f.angle) * R * OUTER
        const oy  = cy + Math.sin(f.angle) * R * OUTER

        if (a < 0.05 && fb < 0.05) {
          // Inactive stub
          const tx = cx + Math.cos(f.angle) * R * 0.62
          const ty = cy + Math.sin(f.angle) * R * 0.62
          ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(tx, ty)
          ctx.strokeStyle = `rgba(70,50,110,${0.07 + Math.sin(t * 0.5 + f.phase) * 0.025})`
          ctx.lineWidth = 0.5; ctx.stroke()
          ctx.beginPath(); ctx.arc(tx, ty, 1, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(168,85,247,0.18)'; ctx.fill()
        } else {
          // Active needle with gradient
          const grad = ctx.createLinearGradient(ix, iy, ox, oy)
          const eff  = a + fb * 0.5
          grad.addColorStop(0,   `rgba(168,85,247,${eff * 0.35})`)
          grad.addColorStop(0.5, `rgba(6,182,212,${eff * 0.85})`)
          grad.addColorStop(1,   `rgba(140,240,255,${eff})`)
          ctx.beginPath(); ctx.moveTo(ix, iy); ctx.lineTo(ox, oy)
          ctx.strokeStyle = grad; ctx.lineWidth = 1 + a * 2.5 + fb * 0.8; ctx.stroke()

          // Arrowhead
          const hl = 7 + a * 4; const ha = 0.38
          ctx.beginPath()
          ctx.moveTo(ox, oy)
          ctx.lineTo(ox - hl * Math.cos(f.angle - ha), oy - hl * Math.sin(f.angle - ha))
          ctx.moveTo(ox, oy)
          ctx.lineTo(ox - hl * Math.cos(f.angle + ha), oy - hl * Math.sin(f.angle + ha))
          ctx.strokeStyle = `rgba(6,182,212,${a * 0.9})`; ctx.lineWidth = 1; ctx.stroke()

          // Tip
          ctx.beginPath(); ctx.arc(ox, oy, 2 + a * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200,245,255,${a})`; ctx.fill()

          // Index label on highly active
          if (a > 0.75) {
            ctx.font = '7px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
            ctx.fillStyle = `rgba(6,182,212,0.45)`
            ctx.fillText(`${i}`, ox + Math.cos(f.angle) * 14, oy + Math.sin(f.angle) * 14)
          }
        }
      })

      // Reconstruction centroid
      let rcx = 0, rcy = 0, tw = 0
      features.forEach(f => {
        if (f.activation < 0.1) return
        rcx += Math.cos(f.angle) * f.activation
        rcy += Math.sin(f.angle) * f.activation
        tw  += f.activation
      })
      if (tw > 0.2) {
        const rx = cx + (rcx / tw) * R * 0.48
        const ry = cy + (rcy / tw) * R * 0.48
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(rx, ry)
        ctx.strokeStyle = 'rgba(255,255,255,0.28)'; ctx.lineWidth = 1.5
        ctx.setLineDash([3, 4]); ctx.stroke(); ctx.setLineDash([])
        ctx.globalCompositeOperation = 'lighter'
        ctx.globalAlpha = 0.5
        ctx.drawImage(gWhite, rx - 45, ry - 45, 90, 90)
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over'
        ctx.beginPath(); ctx.arc(rx, ry, 5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.95)'; ctx.fill()
      }

      // Origin
      ctx.beginPath(); ctx.arc(cx, cy, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.fill()

      // Probe dashed ray
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + Math.cos(probeAngle) * R * 0.28, cy + Math.sin(probeAngle) * R * 0.28)
      ctx.strokeStyle = 'rgba(255,255,255,0.10)'; ctx.lineWidth = 1
      ctx.setLineDash([3, 5]); ctx.stroke(); ctx.setLineDash([])

      // HUD
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'
      ctx.font = '8px monospace'; ctx.fillStyle = 'rgba(100,120,150,0.5)'
      ctx.fillText(
        mouse
          ? `PROBE cursor  ·  TOP-K = ${TOP_K}  ·  DICT = ${DICT}  ·  DEAD = 0%  ·  UTIL = 100%`
          : `RT-TOPKSAE FEATURE DICTIONARY  ·  K = ${TOP_K}  ·  D = ${DICT}  ·  UTIL = 100%  ·  hover to probe`,
        16, H - 16,
      )
      ctx.textAlign = 'right'
      ctx.fillStyle = 'rgba(6,182,212,0.18)'
      ctx.fillText('ROTATION TRICK — ACTIVE SUBSPACE', W - 16, H - 16)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove',  onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: 480, display: 'block', cursor: 'crosshair' }}
    />
  )
}
