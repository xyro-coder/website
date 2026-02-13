'use client'

import { useEffect, useRef } from 'react'

// Career milestones — each "curves" the spacetime grid around it
const MILESTONES = [
  {
    label: 'UW Allen School',
    sublabel: 'BS Computer Science',
    date: '2023 →',
    t: 0.15,   // normalized position along path 0-1
    color: '6, 182, 212',
    mass: 2.5,
  },
  {
    label: 'Outamation',
    sublabel: 'AI Engineering Intern',
    date: '2025',
    t: 0.5,
    color: '168, 85, 247',
    mass: 2.0,
  },
  {
    label: 'Algoverse AI',
    sublabel: 'Research Fellow',
    date: '2025 →',
    t: 0.82,
    color: '6, 182, 212',
    mass: 3.0,
  },
]

// Geodesic path: cubic bezier through milestones
function geodesicPoint(t: number, W: number, H: number): [number, number] {
  // Parameterized S-curve through the canvas
  const x = W * (0.1 + t * 0.8)
  // Height oscillates — career has "gravity wells"
  const base = H * 0.5
  const curve =
    -Math.sin(t * Math.PI * 1.5) * H * 0.15
    + Math.sin(t * Math.PI * 0.5 + 0.3) * H * 0.08
  return [x, base + curve]
}

// Gravitational warp: each milestone dips the grid toward it
function gridWarp(
  gx: number, gy: number,
  milestoneX: number, milestoneY: number,
  mass: number,
  anim: number
): [number, number] {
  const dx = gx - milestoneX
  const dy = gy - milestoneY
  const d2 = dx * dx + dy * dy
  const d = Math.sqrt(d2)
  if (d < 1) return [gx, gy]
  const strength = mass * 1200 / (d2 + 800)
  const pulse = 1 + Math.sin(anim * 2) * 0.1
  return [
    gx - (dx / d) * strength * pulse,
    gy - (dy / d) * strength * pulse,
  ]
}

export default function TemporalCurvature() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollRef = useRef(0)

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

    let anim = 0
    let raf: number

    const animate = () => {
      anim += 0.008
      const W = canvas.width
      const H = canvas.height

      ctx.fillStyle = 'rgba(8, 12, 30, 0.35)'
      ctx.fillRect(0, 0, W, H)

      // Compute milestone screen positions
      const mPositions = MILESTONES.map(m => {
        const [px, py] = geodesicPoint(m.t, W, H)
        return { x: px, y: py, ...m }
      })

      // Draw warped spacetime grid
      const gridCols = 24
      const gridRows = 14
      const cellW = W / gridCols
      const cellH = H / gridRows

      // Horizontal grid lines
      for (let row = 0; row <= gridRows; row++) {
        ctx.beginPath()
        for (let col = 0; col <= gridCols; col++) {
          let gx = col * cellW
          let gy = row * cellH

          // Apply gravitational warp from each milestone
          mPositions.forEach(mp => {
            ;[gx, gy] = gridWarp(gx, gy, mp.x, mp.y, mp.mass, anim)
          })

          if (col === 0) ctx.moveTo(gx, gy)
          else ctx.lineTo(gx, gy)
        }
        const alpha = row % 4 === 0 ? 0.12 : 0.05
        ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`
        ctx.lineWidth = row % 4 === 0 ? 0.7 : 0.35
        ctx.stroke()
      }

      // Vertical grid lines
      for (let col = 0; col <= gridCols; col++) {
        ctx.beginPath()
        for (let row = 0; row <= gridRows; row++) {
          let gx = col * cellW
          let gy = row * cellH

          mPositions.forEach(mp => {
            ;[gx, gy] = gridWarp(gx, gy, mp.x, mp.y, mp.mass, anim)
          })

          if (row === 0) ctx.moveTo(gx, gy)
          else ctx.lineTo(gx, gy)
        }
        const alpha = col % 4 === 0 ? 0.08 : 0.03
        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`
        ctx.lineWidth = 0.4
        ctx.stroke()
      }

      // Draw geodesic path
      const N = 120
      ctx.beginPath()
      for (let i = 0; i <= N; i++) {
        const t = i / N
        const [px, py] = geodesicPoint(t, W, H)
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      const pathGrad = ctx.createLinearGradient(W * 0.1, 0, W * 0.9, 0)
      pathGrad.addColorStop(0, 'rgba(6, 182, 212, 0.8)')
      pathGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.8)')
      pathGrad.addColorStop(1, 'rgba(6, 182, 212, 0.8)')
      ctx.strokeStyle = pathGrad
      ctx.lineWidth = 2
      ctx.shadowColor = '#06b6d4'
      ctx.shadowBlur = 8
      ctx.stroke()
      ctx.shadowBlur = 0

      // Animated pulse along the geodesic
      const pulseT = (anim * 0.2) % 1
      const [pulseX, pulseY] = geodesicPoint(pulseT, W, H)
      const pulseGlow = ctx.createRadialGradient(pulseX, pulseY, 0, pulseX, pulseY, 20)
      pulseGlow.addColorStop(0, 'rgba(6, 182, 212, 0.6)')
      pulseGlow.addColorStop(1, 'rgba(6, 182, 212, 0)')
      ctx.beginPath()
      ctx.arc(pulseX, pulseY, 20, 0, Math.PI * 2)
      ctx.fillStyle = pulseGlow
      ctx.fill()
      ctx.beginPath()
      ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(6, 182, 212, 1)'
      ctx.fill()

      // Draw milestone nodes and labels
      mPositions.forEach((mp, i) => {
        const col = mp.color
        const pulse = 1 + Math.sin(anim * 2 + i * 1.1) * 0.15

        // Gravity well ring
        const ringR = 40 * pulse
        const ringGrad = ctx.createRadialGradient(mp.x, mp.y, 0, mp.x, mp.y, ringR)
        ringGrad.addColorStop(0, `rgba(${col}, 0.15)`)
        ringGrad.addColorStop(0.6, `rgba(${col}, 0.06)`)
        ringGrad.addColorStop(1, `rgba(${col}, 0)`)
        ctx.beginPath()
        ctx.arc(mp.x, mp.y, ringR, 0, Math.PI * 2)
        ctx.fillStyle = ringGrad
        ctx.fill()

        // Node
        ctx.beginPath()
        ctx.arc(mp.x, mp.y, 10, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${col}, 0.3)`
        ctx.fill()
        ctx.strokeStyle = `rgba(${col}, 0.9)`
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(mp.x, mp.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${col}, 1)`
        ctx.fill()

        // Label (above or below alternating)
        const above = i % 2 === 0
        const labelY = above ? mp.y - 26 : mp.y + 26

        ctx.font = 'bold 13px monospace'
        ctx.fillStyle = `rgba(${col}, 1)`
        ctx.textAlign = 'center'
        ctx.fillText(mp.label, mp.x, labelY)

        ctx.font = '10px monospace'
        ctx.fillStyle = `rgba(${col}, 0.7)`
        ctx.fillText(mp.sublabel, mp.x, labelY + (above ? 14 : -14))

        ctx.font = '9px monospace'
        ctx.fillStyle = `rgba(${col}, 0.4)`
        ctx.fillText(mp.date, mp.x, labelY + (above ? 26 : -26))
      })

      // Caption
      ctx.font = '9px monospace'
      ctx.fillStyle = 'rgba(100, 120, 150, 0.5)'
      ctx.textAlign = 'left'
      ctx.fillText('GEODESIC PATH  ·  Research milestones curve spacetime', 16, H - 16)

      raf = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full rounded-2xl border border-slate-800/50"
      style={{ height: 380, display: 'block' }}
    />
  )
}
