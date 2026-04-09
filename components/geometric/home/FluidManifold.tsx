'use client'

// Ferrofluid / Non-Newtonian surface simulation — manifold learning visualised
// as a physical medium that responds to cursor force.
//
// MATH: 2D wave equation   h_new = 2h - h_old + c²∇²h · damping
//   c² = 0.46  (propagation speed)
//   damping = 0.987  (energy dissipation per step)
//   Cursor applies Gaussian impulse: h += A·exp(-‖r - r_mouse‖² / σ²)
//
// RENDER: Triple-buffer Float32Array (no GC per frame).
// Surface drawn to a 100×65 ImageData tile, scaled up via drawImage.
// Peaks (|h|>0.1) get individual glow particles with vertical displacement.
// Surface mesh drawn every 4 rows/cols with additive blending.

import { useEffect, useRef } from 'react'

const GW = 100   // grid width
const GH = 65    // grid height
const C2 = 0.46  // wave speed²
const DAMP = 0.987
const SIZE = GW * GH

const idx = (x: number, y: number) => y * GW + x

export default function FluidManifold() {
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

    // Triple buffer — zero GC per frame
    const buf0 = new Float32Array(SIZE)  // h_old
    const buf1 = new Float32Array(SIZE)  // h_current
    const buf2 = new Float32Array(SIZE)  // h_new (scratch)
    let h0 = buf0, h = buf1, h_new = buf2

    // Offscreen tile for surface ImageData (100×65 pixels, stretched to full canvas)
    const tile = document.createElement('canvas')
    tile.width = GW; tile.height = GH
    const tctx = tile.getContext('2d')!
    const imgData = tctx.createImageData(GW, GH)
    const px = imgData.data   // Uint8ClampedArray — no realloc

    // Mouse state
    let mx = -1, my = -1, prevMx = -1, prevMy = -1

    const applyImpulse = (gx: number, gy: number, amplitude: number) => {
      const R = 5
      const sig2 = R * R * 0.55
      for (let dy = -R; dy <= R; dy++) {
        for (let dx = -R; dx <= R; dx++) {
          const nx = gx + dx; const ny = gy + dy
          if (nx < 1 || nx >= GW - 1 || ny < 1 || ny >= GH - 1) continue
          h[idx(nx, ny)] += amplitude * Math.exp(-(dx * dx + dy * dy) / sig2)
        }
      }
    }

    const toGrid = (sx: number, sy: number) => ({
      gx: Math.max(1, Math.min(GW - 2, Math.floor((sx / canvas.width) * GW))),
      gy: Math.max(1, Math.min(GH - 2, Math.floor((sy / canvas.height) * GH))),
    })

    const onMouseMove = (e: MouseEvent) => {
      prevMx = mx; prevMy = my
      mx = e.clientX; my = e.clientY
      const { gx, gy } = toGrid(mx, my)
      applyImpulse(gx, gy, -0.52)
    }
    window.addEventListener('mousemove', onMouseMove)

    // Touch support
    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      const { gx, gy } = toGrid(touch.clientX, touch.clientY)
      applyImpulse(gx, gy, -0.48)
    }
    window.addEventListener('touchmove', onTouchMove, { passive: true })

    let t = 0
    let raf: number

    const animate = () => {
      t += 0.011
      const W = canvas.width; const H = canvas.height
      const cellW = W / GW; const cellH = H / GH

      // Ambient random perturbations (keeps fluid alive when not interacting)
      if (Math.random() < 0.14) {
        const rx = 3 + Math.floor(Math.random() * (GW - 6))
        const ry = 3 + Math.floor(Math.random() * (GH - 6))
        h[idx(rx, ry)] += (Math.random() - 0.5) * 0.11
      }

      // ── Wave equation update ──
      for (let y = 1; y < GH - 1; y++) {
        for (let x = 1; x < GW - 1; x++) {
          const i = idx(x, y)
          const laplacian =
            h[idx(x + 1, y)] + h[idx(x - 1, y)] +
            h[idx(x, y + 1)] + h[idx(x, y - 1)] - 4 * h[i]
          h_new[i] = (2 * h[i] - h0[i] + C2 * laplacian) * DAMP
        }
      }
      // Absorbing boundary (damp edges)
      for (let x = 0; x < GW; x++) {
        h_new[idx(x, 0)] = h_new[idx(x, 1)] * 0.25
        h_new[idx(x, GH - 1)] = h_new[idx(x, GH - 2)] * 0.25
      }
      for (let y = 0; y < GH; y++) {
        h_new[idx(0, y)] = h_new[idx(1, y)] * 0.25
        h_new[idx(GW - 1, y)] = h_new[idx(GW - 2, y)] * 0.25
      }

      // Advance triple buffer (just pointer swap — zero allocation)
      const tmp = h0; h0 = h; h = h_new; h_new = tmp

      // ── Render ──
      ctx.clearRect(0, 0, W, H)

      // Layer 1: Surface ImageData — write pixel colors directly to 100×65 tile
      for (let y = 0; y < GH; y++) {
        for (let x = 0; x < GW; x++) {
          const hv = h[idx(x, y)]
          const abs = Math.abs(hv)
          const brightness = Math.min(220, abs * 1100)
          const pi = (y * GW + x) * 4

          if (hv > 0.005) {
            // Rising — cyan (6, 182, 212)
            px[pi]     = Math.round(6 * brightness / 220)
            px[pi + 1] = Math.round(182 * brightness / 220)
            px[pi + 2] = Math.round(212 * brightness / 220)
            px[pi + 3] = Math.round(brightness * 1.1)
          } else if (hv < -0.005) {
            // Depressed — purple (168, 85, 247)
            px[pi]     = Math.round(168 * brightness / 220)
            px[pi + 1] = Math.round(85 * brightness / 220)
            px[pi + 2] = Math.round(247 * brightness / 220)
            px[pi + 3] = Math.round(brightness * 0.9)
          } else {
            // Flat — transparent
            px[pi + 3] = 0
          }
        }
      }
      tctx.putImageData(imgData, 0, 0)

      // Stretch tile to full canvas with screen blending
      ctx.globalCompositeOperation = 'lighter'
      ctx.globalAlpha = 0.72
      ctx.drawImage(tile, 0, 0, W, H)
      ctx.globalAlpha = 1

      // Layer 2: Peaks — glow particles with vertical displacement
      // Only for cells where |h| > 0.09 (hot spots on the surface)
      for (let y = 0; y < GH; y++) {
        for (let x = 0; x < GW; x++) {
          const hv = h[idx(x, y)]
          if (Math.abs(hv) < 0.09) continue

          const sx = (x + 0.5) * cellW
          const sy = (y + 0.5) * cellH + hv * 72   // vertical displacement
          const bright = Math.min(1, Math.abs(hv) * 6)
          const col = hv > 0 ? '6,182,212' : '168,85,247'

          const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, cellW * 2.2)
          g.addColorStop(0, `rgba(${col},${bright * 0.7})`)
          g.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.beginPath()
          ctx.arc(sx, sy, cellW * 2.2, 0, Math.PI * 2)
          ctx.fillStyle = g; ctx.fill()
        }
      }

      // Layer 3: Surface mesh lines (every 4th row/col)
      ctx.globalCompositeOperation = 'lighter'

      // Horizontal
      for (let y = 0; y < GH; y += 4) {
        ctx.beginPath()
        for (let x = 0; x < GW; x++) {
          const hv = h[idx(x, y)]
          const sx = (x + 0.5) * cellW
          const sy = (y + 0.5) * cellH + hv * 72
          if (x === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy)
        }
        const tension = Math.max(...Array.from({ length: GW }, (_, x) => Math.abs(h[idx(x, y)])))
        ctx.strokeStyle = `rgba(6,182,212,${0.045 + tension * 0.22})`
        ctx.lineWidth = 0.6
        ctx.stroke()
      }

      // Vertical
      for (let x = 0; x < GW; x += 5) {
        ctx.beginPath()
        for (let y = 0; y < GH; y++) {
          const hv = h[idx(x, y)]
          const sx = (x + 0.5) * cellW
          const sy = (y + 0.5) * cellH + hv * 72
          if (y === 0) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy)
        }
        const tension = Math.max(...Array.from({ length: GH }, (_, y) => Math.abs(h[idx(x, y)])))
        ctx.strokeStyle = `rgba(168,85,247,${0.03 + tension * 0.16})`
        ctx.lineWidth = 0.4
        ctx.stroke()
      }

      ctx.globalCompositeOperation = 'source-over'

      // Caption
      ctx.font = '9px monospace'
      ctx.fillStyle = 'rgba(100,120,155,0.28)'
      ctx.textAlign = 'left'
      ctx.fillText('NON-NEWTONIAN SURFACE  ·  cursor applies field force  ·  ripples propagate at c²=0.46', 16, H - 14)

      raf = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full canvas-void"
      style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
    />
  )
}
