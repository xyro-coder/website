'use client'

import { useEffect, useRef } from 'react'

// Möbius transformation in the Poincaré disk model
// Maps unit disk to unit disk
function mobiusTransform(
  x: number, y: number,
  ax: number, ay: number // translation parameter in the disk
): [number, number] {
  // T_a(z) = (z - a) / (1 - ā·z)
  const denom_r = 1 - (ax * x + ay * y)
  const denom_i = -(ax * y - ay * x) // simplified conjugate
  const num_r = x - ax
  const num_i = y - ay

  const denom2 = denom_r * denom_r + denom_i * denom_i
  if (denom2 < 1e-10) return [x, y]

  return [
    (num_r * denom_r + num_i * denom_i) / denom2,
    (num_i * denom_r - num_r * denom_i) / denom2,
  ]
}

// Geodesic in Poincaré disk: arc of a circle orthogonal to the boundary
function drawGeodesic(
  ctx: CanvasRenderingContext2D,
  cx: number, cy: number, R: number,
  // Two points on the disk boundary [-1,1]
  t1: number, t2: number,
  anim: number
) {
  const N = 80
  ctx.beginPath()
  for (let i = 0; i <= N; i++) {
    const t = t1 + (t2 - t1) * (i / N)
    // Point on geodesic in hyperbolic space: straight line through origin
    // For a general geodesic, parameterize arc in Poincaré model
    const angle = t
    const r = 0.9 // near boundary

    let px = r * Math.cos(angle)
    let py = r * Math.sin(angle)

    // Apply animated Möbius shift
    const shift = Math.sin(anim) * 0.15
    ;[px, py] = mobiusTransform(px, py, shift * 0.3, shift * 0.2)

    // Clamp to disk
    const len = Math.sqrt(px * px + py * py)
    if (len >= 1) { px /= len * 1.01; py /= len * 1.01 }

    const sx = cx + px * R
    const sy = cy + py * R

    if (i === 0) ctx.moveTo(sx, sy)
    else ctx.lineTo(sx, sy)
  }
  ctx.stroke()
}

export default function HyperbolicEmbedding() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let raf: number
    let anim = 0

    const animate = () => {
      anim += 0.003
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / 2
      const cy = canvas.height / 2
      const R = Math.min(canvas.width, canvas.height) * 0.48

      // Draw boundary circle
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.08)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw Poincaré disk grid — geodesics
      // Radial geodesics (straight lines through center)
      const radialCount = 24
      for (let i = 0; i < radialCount; i++) {
        const angle = (i / radialCount) * Math.PI * 2
        const wobble = Math.sin(anim * 0.5 + i * 0.4) * 0.02

        let p1x = Math.cos(angle + wobble)
        let p1y = Math.sin(angle + wobble)
        let p2x = -p1x
        let p2y = -p1y

        // Möbius shift animates the "center" of the disk
        const shift = Math.sin(anim * 0.7) * 0.15
        ;[p1x, p1y] = mobiusTransform(p1x * 0.97, p1y * 0.97, shift * 0.2, shift * 0.1)
        ;[p2x, p2y] = mobiusTransform(p2x * 0.97, p2y * 0.97, shift * 0.2, shift * 0.1)

        const depth = (i % 4 === 0) ? 0.15 : 0.06
        ctx.beginPath()
        ctx.moveTo(cx + p1x * R, cy + p1y * R)
        ctx.lineTo(cx + p2x * R, cy + p2y * R)
        ctx.strokeStyle = `rgba(6, 182, 212, ${depth})`
        ctx.lineWidth = i % 6 === 0 ? 0.8 : 0.4
        ctx.stroke()
      }

      // Concentric circles in hyperbolic space (equidistant curves)
      const circleCount = 12
      for (let ring = 1; ring <= circleCount; ring++) {
        // In hyperbolic space, equal distance rings map to increasingly
        // compressed euclidean circles in the Poincaré disk
        const d = ring / circleCount  // hyperbolic "distance" parameter
        // Euclidean radius of this hyperbolic circle: tanh(d * 2.5)
        const eucR = Math.tanh(d * 2.2) * 0.97

        const animShift = Math.sin(anim * 0.4 + ring * 0.3) * 0.01
        const r = (eucR + animShift) * R

        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        const depth = (ring % 3 === 0) ? 0.12 : 0.05
        ctx.strokeStyle = `rgba(168, 85, 247, ${depth})`
        ctx.lineWidth = ring % 3 === 0 ? 0.7 : 0.35
        ctx.stroke()
      }

      // Draw scattered nodes in hyperbolic space
      for (let i = 0; i < 40; i++) {
        const angle = (i / 40) * Math.PI * 2 + anim * 0.05
        const depth = (i % 5 + 1) / 5
        const eucR = Math.tanh(depth * 1.8) * 0.95

        let px = eucR * Math.cos(angle)
        let py = eucR * Math.sin(angle)

        const shift = Math.sin(anim) * 0.1
        ;[px, py] = mobiusTransform(px, py, shift * 0.15, shift * 0.08)

        const sx = cx + px * R
        const sy = cy + py * R

        const scale = 1 - eucR * 0.5 // nodes appear smaller near boundary
        ctx.beginPath()
        ctx.arc(sx, sy, scale * 4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(6, 182, 212, ${0.2 + scale * 0.3})`
        ctx.fill()
      }

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
      style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
    />
  )
}
