'use client'

import { useEffect, useRef } from 'react'

// Career milestones — each "Event" curves the Minkowski spacetime grid around it.
// Hovering over an event amplifies its gravitational well — local Lensing effect.
const MILESTONES = [
  {
    label: 'UW Allen School',
    sublabel: 'BS Computer Science',
    date: '2023 →',
    t: 0.15,
    color: '6, 182, 212',
    mass: 2.5,
  },
  {
    label: 'Algoverse AI',
    sublabel: 'Research Fellow',
    date: 'May 2025 – Mar 2026',
    t: 0.48,
    color: '168, 85, 247',
    mass: 2.8,
  },
  {
    label: 'Stealth AI Startup',
    sublabel: 'ML Research Engineer',
    date: 'Feb 2026 →',
    t: 0.82,
    color: '6, 182, 212',
    mass: 3.2,
  },
]

function geodesicPoint(t: number, W: number, H: number): [number, number] {
  const x = W * (0.1 + t * 0.8)
  const base = H * 0.5
  const curve =
    -Math.sin(t * Math.PI * 1.5) * H * 0.15
    + Math.sin(t * Math.PI * 0.5 + 0.3) * H * 0.08
  return [x, base + curve]
}

// Gravitational warp — applies the local curvature of each milestone
function gridWarp(
  gx: number, gy: number,
  milestoneX: number, milestoneY: number,
  mass: number,
  hoveredMass: number,  // extra lensing on hovered milestone
  anim: number
): [number, number] {
  const dx = gx - milestoneX
  const dy = gy - milestoneY
  const d2 = dx * dx + dy * dy
  const d = Math.sqrt(d2)
  if (d < 1) return [gx, gy]
  const effectiveMass = mass + hoveredMass
  const strength = effectiveMass * 1200 / (d2 + 800)
  const pulse = 1 + Math.sin(anim * 2) * 0.1
  return [
    gx - (dx / d) * strength * pulse,
    gy - (dy / d) * strength * pulse,
  ]
}

export default function TemporalCurvature() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollRef = useRef(0)
  // Index of hovered milestone, or -1 for none
  const hoveredRef = useRef(-1)
  // Smooth lensing amplitudes per milestone
  const lensRef = useRef(MILESTONES.map(() => 0))

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

    const onScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener('scroll', onScroll)

    // Mouse hover detection — check proximity to each milestone node
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      const W = canvas.width
      const H = canvas.height

      let nearest = -1
      let nearestD = 30   // px threshold for hover
      MILESTONES.forEach((m, i) => {
        const [px, py] = geodesicPoint(m.t, W, H)
        const d = Math.sqrt((mx - px) ** 2 + (my - py) ** 2)
        if (d < nearestD) { nearestD = d; nearest = i }
      })
      hoveredRef.current = nearest
      canvas.style.cursor = nearest >= 0 ? 'pointer' : 'default'
    }
    const onMouseLeave = () => { hoveredRef.current = -1; canvas.style.cursor = 'default' }
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    // Pre-build glow sprites per milestone color — eliminates createRadialGradient per frame
    const glowSprites = MILESTONES.map(m => {
      const R = 70
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

    let isVisible = true
    const observer = new IntersectionObserver(([e]) => { isVisible = e.isIntersecting }, { threshold: 0.01 })
    observer.observe(canvas)

    let anim = 0
    let raf: number

    const animate = () => {
      raf = requestAnimationFrame(animate)
      if (!isVisible) return
      anim += 0.008
      const W = canvas.width
      const H = canvas.height

      // Always reset before partial clear — previous frame may have left 'lighter'
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.fillStyle = 'rgba(0,0,0,0.42)'
      ctx.fillRect(0, 0, W, H)

      // Smoothly animate per-milestone lens amplification
      const hovered = hoveredRef.current
      const lens = lensRef.current
      MILESTONES.forEach((_, i) => {
        const target = i === hovered ? 5.5 : 0   // extra mass when hovered
        lens[i] += (target - lens[i]) * 0.08
      })

      // Precompute milestone screen positions — avoid recomputing inside nested loops
      const mxArr: number[] = [], myArr: number[] = []
      const mMassArr: number[] = [], mColorArr: string[] = []
      for (let i = 0; i < MILESTONES.length; i++) {
        const [px, py] = geodesicPoint(MILESTONES[i].t, W, H)
        mxArr[i] = px; myArr[i] = py
        mMassArr[i] = MILESTONES[i].mass + lens[i]
        mColorArr[i] = MILESTONES[i].color
      }
      // mPositions still needed for node rendering
      const mPositions = MILESTONES.map((m, i) => ({ x: mxArr[i], y: myArr[i], ...m }))

      const gridCols = 24
      const gridRows = 14
      const cellW = W / gridCols
      const cellH = H / gridRows

      // Grid and geodesic use additive blending — crossing lines create bright hot-spots
      ctx.globalCompositeOperation = 'lighter'

      // Inline gridWarp — avoids function call overhead for 25×15×3 = 1125 calls/frame
      const pulse = 1 + Math.sin(anim * 2) * 0.1
      const NM = mxArr.length

      const warpPt = (gxIn: number, gyIn: number): [number, number] => {
        let gx = gxIn, gy = gyIn
        for (let mi = 0; mi < NM; mi++) {
          const dx = gx - mxArr[mi]; const dy = gy - myArr[mi]
          const d2 = dx * dx + dy * dy
          if (d2 < 1) continue
          const d = Math.sqrt(d2)
          const strength = mMassArr[mi] * 1200 / (d2 + 800) * pulse
          gx -= (dx / d) * strength
          gy -= (dy / d) * strength
        }
        return [gx, gy]
      }

      // Horizontal grid lines
      for (let row = 0; row <= gridRows; row++) {
        ctx.beginPath()
        for (let col = 0; col <= gridCols; col++) {
          const [gx, gy] = warpPt(col * cellW, row * cellH)
          if (col === 0) ctx.moveTo(gx, gy); else ctx.lineTo(gx, gy)
        }
        ctx.strokeStyle = row % 4 === 0 ? 'rgba(6,182,212,0.13)' : 'rgba(6,182,212,0.05)'
        ctx.lineWidth = row % 4 === 0 ? 0.7 : 0.35
        ctx.stroke()
      }

      // Vertical grid lines
      for (let col = 0; col <= gridCols; col++) {
        ctx.beginPath()
        for (let row = 0; row <= gridRows; row++) {
          const [gx, gy] = warpPt(col * cellW, row * cellH)
          if (row === 0) ctx.moveTo(gx, gy); else ctx.lineTo(gx, gy)
        }
        ctx.strokeStyle = col % 4 === 0 ? 'rgba(168,85,247,0.08)' : 'rgba(168,85,247,0.03)'
        ctx.lineWidth = 0.4
        ctx.stroke()
      }

      // ── Geodesic path — additive blending creates light-pipe effect ──
      ctx.globalCompositeOperation = 'lighter'
      const Nseg = 120

      const buildPath = () => {
        ctx.beginPath()
        for (let i = 0; i <= Nseg; i++) {
          const t = i / Nseg
          const [px, py] = geodesicPoint(t, W, H)
          if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py)
        }
      }

      const pathGrad = ctx.createLinearGradient(W * 0.1, 0, W * 0.9, 0)
      pathGrad.addColorStop(0, 'rgba(6, 182, 212, 0.65)')
      pathGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.65)')
      pathGrad.addColorStop(1, 'rgba(6, 182, 212, 0.65)')

      // Wide glow halo
      buildPath()
      ctx.strokeStyle = pathGrad
      ctx.lineWidth = 14
      ctx.globalAlpha = 0.18
      ctx.stroke()
      ctx.globalAlpha = 1

      // Medium halo
      buildPath()
      ctx.lineWidth = 5
      ctx.globalAlpha = 0.4
      ctx.stroke()
      ctx.globalAlpha = 1

      // Core line
      buildPath()
      ctx.lineWidth = 1.8
      ctx.globalAlpha = 1
      ctx.stroke()

      ctx.globalCompositeOperation = 'source-over'

      // Pulse along geodesic
      const pulseT = (anim * 0.2) % 1
      const [pulseX, pulseY] = geodesicPoint(pulseT, W, H)
      // Simple glow for pulse dot — no createRadialGradient per frame
      ctx.beginPath()
      ctx.arc(pulseX, pulseY, 20, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(6, 182, 212, 0.12)'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(6, 182, 212, 1)'
      ctx.fill()

      // Reset for nodes and labels (need normal blending for text)
      ctx.globalCompositeOperation = 'source-over'

      // ── Milestone nodes ──
      mPositions.forEach((mp, i) => {
        const col = mp.color
        const isHovered = i === hovered
        const lensAmt = lens[i]
        const pulse = 1 + Math.sin(anim * 2 + i * 1.1) * 0.15

        // Larger ring when hovered (gravitational focus)
        const baseRingR = isHovered ? 54 : 40
        const ringR = baseRingR * pulse + lensAmt * 1.2

        // Ring glow — pre-built sprite scaled to ringR
        const { sprite, R: sR } = glowSprites[i]
        ctx.globalAlpha = isHovered ? 0.22 : 0.15
        ctx.drawImage(sprite, mp.x - ringR, mp.y - ringR, ringR * 2, ringR * 2)
        ctx.globalAlpha = 1

        // Extra lensing ring when hovered — simple circle, no gradient
        if (isHovered && lensAmt > 0.5) {
          const outerRing = ringR * 1.5
          ctx.beginPath()
          ctx.arc(mp.x, mp.y, outerRing, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${col}, ${0.08 * (lensAmt / 5.5)})`
          ctx.lineWidth = 2; ctx.stroke()
        }

        // Node circle (larger when hovered)
        const nodeR = isHovered ? 13 : 10
        ctx.beginPath()
        ctx.arc(mp.x, mp.y, nodeR, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${col}, ${isHovered ? 0.4 : 0.3})`
        ctx.fill()
        ctx.strokeStyle = `rgba(${col}, ${isHovered ? 1 : 0.9})`
        ctx.lineWidth = isHovered ? 2.5 : 2
        ctx.shadowColor = `rgb(${col})`
        ctx.shadowBlur = isHovered ? 16 : 6
        ctx.stroke()
        ctx.shadowBlur = 0

        ctx.beginPath()
        ctx.arc(mp.x, mp.y, isHovered ? 5 : 4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${col}, 1)`
        ctx.fill()

        // Labels (above/below alternating)
        const above = i % 2 === 0
        const labelY = above ? mp.y - (isHovered ? 32 : 26) : mp.y + (isHovered ? 32 : 26)

        ctx.font = `bold ${isHovered ? 14 : 13}px monospace`
        ctx.fillStyle = `rgba(${col}, 1)`
        ctx.textAlign = 'center'
        ctx.fillText(mp.label, mp.x, labelY)

        ctx.font = `${isHovered ? 11 : 10}px monospace`
        ctx.fillStyle = `rgba(${col}, 0.75)`
        ctx.fillText(mp.sublabel, mp.x, labelY + (above ? 15 : -15))

        ctx.font = '9px monospace'
        ctx.fillStyle = `rgba(${col}, ${isHovered ? 0.6 : 0.4})`
        ctx.fillText(mp.date, mp.x, labelY + (above ? 28 : -28))

        // Hover hint
        if (isHovered) {
          ctx.font = '8px monospace'
          ctx.fillStyle = `rgba(${col}, 0.35)`
          ctx.fillText('⌖ gravitational event', mp.x, labelY + (above ? 42 : -42))
        }
      })

      // Caption
      ctx.font = '9px monospace'
      ctx.fillStyle = 'rgba(100, 120, 150, 0.5)'
      ctx.textAlign = 'left'
      ctx.fillText(
        hovered >= 0
          ? `EVENT: ${MILESTONES[hovered].label}  ·  hover to lens spacetime`
          : 'MINKOWSKI SPACE-TIME  ·  hover events to warp local geometry',
        16, H - 16
      )
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full canvas-void-tall"
      style={{ height: 380, display: 'block' }}
    />
  )
}
