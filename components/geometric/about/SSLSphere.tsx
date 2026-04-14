'use client'

import { useEffect, useRef } from 'react'

// SSL Representation Geometry — 300 points on S²
// Cycles between two states that mirror Sulayman's SSL research:
//   UNIFORM  — well-distributed on sphere (good SSL geometry)
//   COLLAPSE — all points squeezed to a thin equatorial band (dimensional collapse)
// Mouse drag rotates the sphere. Additive glow blending for depth.

const N      = 300
const PERIOD = 7.0   // seconds per mode

// Spherical Fibonacci — maximally uniform distribution on S²
function sphereFib(n: number): [number, number, number][] {
  const pts: [number, number, number][] = []
  const phi = Math.PI * (1 + Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const theta = Math.acos(1 - 2 * (i + 0.5) / n)
    const p     = phi * i
    pts.push([Math.sin(theta) * Math.cos(p), Math.sin(theta) * Math.sin(p), Math.cos(theta)])
  }
  return pts
}

// Collapsed positions — same azimuth, theta near π/2 (equatorial band)
function collapsed(n: number): [number, number, number][] {
  const pts: [number, number, number][] = []
  const phi = Math.PI * (1 + Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const theta = Math.PI / 2 + (Math.random() - 0.5) * 0.22
    const p     = phi * i
    pts.push([Math.sin(theta) * Math.cos(p), Math.sin(theta) * Math.sin(p), Math.cos(theta)])
  }
  return pts
}

export default function SSLSphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dragRef   = useRef<{ down: boolean; lastX: number; lastY: number }>({ down: false, lastX: 0, lastY: 0 })
  const rotRef    = useRef<{ x: number; y: number; vx: number; vy: number }>({ x: 0.38, y: 0, vx: 0, vy: 0.003 })

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx    = canvas.getContext('2d')!

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const uniform  = sphereFib(N)
    const collapse = collapsed(N)

    // Per-point phase offset for subtle individual drift
    const phases = Array.from({ length: N }, () => Math.random() * Math.PI * 2)

    // Glow sprite
    const mkGlow = (r: number, g: number, b: number, R: number) => {
      const s  = document.createElement('canvas')
      s.width  = R * 2; s.height = R * 2
      const sc = s.getContext('2d')!
      const gr = sc.createRadialGradient(R, R, 0, R, R, R)
      gr.addColorStop(0,   `rgba(${r},${g},${b},1)`)
      gr.addColorStop(0.4, `rgba(${r},${g},${b},0.35)`)
      gr.addColorStop(1,   `rgba(${r},${g},${b},0)`)
      sc.fillStyle = gr; sc.fillRect(0, 0, R * 2, R * 2)
      return s
    }
    const gCyan   = mkGlow(6,   182, 212, 22)
    const gPurple = mkGlow(168,  85, 247, 16)

    // ── Drag to rotate ──────────────────────────────────────────────────────
    const onMouseDown  = (e: MouseEvent) => { dragRef.current = { down: true, lastX: e.clientX, lastY: e.clientY } }
    const onMouseUp    = ()              => { dragRef.current.down = false }
    const onMouseMove  = (e: MouseEvent) => {
      const d = dragRef.current
      if (!d.down) return
      const dx = e.clientX - d.lastX; const dy = e.clientY - d.lastY
      rotRef.current.vy += dx * 0.006
      rotRef.current.vx += dy * 0.006
      d.lastX = e.clientX; d.lastY = e.clientY
    }
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0]
      dragRef.current = { down: true, lastX: t.clientX, lastY: t.clientY }
    }
    const onTouchMove  = (e: TouchEvent) => {
      const d  = dragRef.current; if (!d.down) return
      const tc = e.touches[0]
      rotRef.current.vy += (tc.clientX - d.lastX) * 0.006
      rotRef.current.vx += (tc.clientY - d.lastY) * 0.006
      d.lastX = tc.clientX; d.lastY = tc.clientY
    }
    canvas.addEventListener('mousedown',  onMouseDown)
    window.addEventListener('mouseup',    onMouseUp)
    window.addEventListener('mousemove',  onMouseMove)
    canvas.addEventListener('touchstart', onTouchStart, { passive: true })
    canvas.addEventListener('touchmove',  onTouchMove,  { passive: true })
    window.addEventListener('touchend',   onMouseUp)

    let isVisible = true
    const obs = new IntersectionObserver(([e]) => { isVisible = e.isIntersecting }, { threshold: 0.01 })
    obs.observe(canvas)

    // ── Project 3D → 2D with current rotation ───────────────────────────────
    const project = (
      [x, y, z]: [number, number, number],
      rx: number, ry: number,
      cx: number, cy: number, R: number
    ): [number, number, number] => {
      // Rotate around Y
      const x1 =  x * Math.cos(ry) + z * Math.sin(ry)
      const z1 = -x * Math.sin(ry) + z * Math.cos(ry)
      // Rotate around X
      const y2 =  y * Math.cos(rx) - z1 * Math.sin(rx)
      const z2 =  y * Math.sin(rx) + z1 * Math.cos(rx)
      // Soft perspective
      const fov   = 2.8
      const scale = fov / (fov + z2 * 0.25)
      return [cx + x1 * R * scale, cy + y2 * R * scale, z2]
    }

    let t   = 0
    let raf = 0

    const draw = () => {
      raf = requestAnimationFrame(draw)
      if (!isVisible) return
      t += 0.016

      const W  = canvas.width,  H  = canvas.height
      const cx = W / 2,         cy = H / 2
      const R  = Math.min(W, H) * 0.36

      // Auto-rotate with drag inertia
      const rot = rotRef.current
      if (!dragRef.current.down) {
        rot.vy += 0.0005   // gentle auto-spin
        rot.vx *= 0.96; rot.vy *= 0.96
      }
      rot.x += rot.vx; rot.y += rot.vy

      // Ghost trail
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1
      ctx.fillStyle = 'rgba(0,0,0,0.25)'
      ctx.fillRect(0, 0, W, H)

      // Mode blend: cycle between uniform and collapse
      const cycle   = (t / PERIOD) % 2
      const rawBlend = cycle < 1 ? cycle : 2 - cycle   // 0→1→0 sawtooth
      // Smooth with smoothstep
      const blend = rawBlend * rawBlend * (3 - 2 * rawBlend)

      // Mode labels
      const mode      = blend < 0.5 ? 'UNIFORM' : 'COLLAPSED'
      const modeColor = blend < 0.5 ? '6,182,212' : '168,85,247'

      // Projected points sorted by depth
      const pts = uniform.map((u, i) => {
        const col = collapse[i]
        const px = u[0] + (col[0] - u[0]) * blend
        const py = u[1] + (col[1] - u[1]) * blend
        const pz = u[2] + (col[2] - u[2]) * blend
        const [sx, sy, sz] = project([px, py, pz], rot.x, rot.y, cx, cy, R)
        return { sx, sy, sz, i, blend }
      })
      pts.sort((a, b) => a.sz - b.sz)

      // ── Additive glow pass ───────────────────────────────────────────────
      ctx.globalCompositeOperation = 'lighter'

      pts.forEach(({ sx, sy, sz, i }) => {
        const depth   = (sz + 1) * 0.5                   // 0=back, 1=front
        const pulse   = (Math.sin(t * 1.2 + phases[i]) + 1) * 0.5
        const isBack  = depth < 0.45
        const glowR   = 10 + pulse * 4
        const alpha   = isBack
          ? (1 - blend) * depth * 0.12
          : depth * (0.12 + blend * 0.04) + (1 - blend) * 0.08

        ctx.globalAlpha = alpha
        const sprite = blend > 0.5 ? gPurple : gCyan
        ctx.drawImage(sprite, sx - glowR, sy - glowR, glowR * 2, glowR * 2)
      })
      ctx.globalAlpha = 1

      // ── Source-over pass: point dots ─────────────────────────────────────
      ctx.globalCompositeOperation = 'source-over'

      pts.forEach(({ sx, sy, sz, i }) => {
        const depth = (sz + 1) * 0.5
        const isBack = depth < 0.42
        const r     = 1.2 + depth * 1.8
        const cyanA = (1 - blend) * depth * 0.7 + 0.1
        const purpA = blend * depth * 0.7 + 0.1
        const col   = blend < 0.5
          ? `rgba(6,182,212,${Math.max(0.05, (isBack ? cyanA * 0.4 : cyanA))})`
          : `rgba(168,85,247,${Math.max(0.05, (isBack ? purpA * 0.4 : purpA))})`

        ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2)
        ctx.fillStyle = col; ctx.fill()
      })

      // Equatorial ring (shows where collapse concentrates points)
      if (blend > 0.1) {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(1, Math.abs(Math.cos(rot.x)) * 0.25 + 0.02)
        ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(168,85,247,${blend * 0.18})`; ctx.lineWidth = 1.5; ctx.stroke()
        ctx.restore()
      }

      // Wireframe great circles (subtle)
      for (let gc = 0; gc < 3; gc++) {
        const angle = gc * Math.PI / 3
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate(rot.y + angle)
        ctx.scale(1, Math.abs(Math.cos(rot.x + gc * 0.3)) * 0.6 + 0.05)
        ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(${modeColor},${0.04 + gc * 0.01})`
        ctx.lineWidth = 0.6; ctx.stroke()
        ctx.restore()
      }

      // Mode label
      ctx.globalCompositeOperation = 'source-over'
      ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'
      ctx.font = '9px monospace'
      ctx.fillStyle = `rgba(${modeColor},0.55)`
      ctx.fillText(mode, cx, H - 16)

      // HUD
      ctx.textAlign = 'left'; ctx.font = '8px monospace'
      ctx.fillStyle = 'rgba(100,120,150,0.45)'
      ctx.fillText(
        `S² REPRESENTATION GEOMETRY  ·  N = ${N}  ·  drag to rotate`,
        16, H - 16,
      )

      // Transition label
      if (blend > 0.05 && blend < 0.95) {
        ctx.textAlign = 'right'
        ctx.fillStyle = `rgba(${modeColor},0.35)`
        ctx.fillText(
          blend < 0.5
            ? `collapse → ${Math.round(blend * 100)}%`
            : `uniform ← ${Math.round((1 - blend) * 100)}%`,
          W - 16, H - 16,
        )
      }
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
      window.removeEventListener('resize',   resize)
      canvas.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup',   onMouseUp)
      window.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchmove',  onTouchMove)
      window.removeEventListener('touchend',   onMouseUp)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: 320, display: 'block', cursor: 'grab' }}
    />
  )
}
