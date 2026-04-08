'use client'

import { useEffect, useRef } from 'react'

const N = 700

interface Particle {
  // Sphere position (unit sphere surface)
  bx: number; by: number; bz: number
  // Letter target (normalized -1..1)
  tx: number; ty: number
  phase: number
  col: string
}

function buildSphere(): Particle[] {
  return Array.from({ length: N }, () => {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = 0.55 + Math.random() * 0.45
    return {
      bx: r * Math.sin(phi) * Math.cos(theta),
      by: r * Math.sin(phi) * Math.sin(theta),
      bz: r * Math.cos(phi),
      tx: 0, ty: 0,
      phase: Math.random() * Math.PI * 2,
      col: Math.random() > 0.5 ? '6,182,212' : '168,85,247',
    }
  })
}

export default function LatentCollapse() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const progRef = useRef(0)
  const ptsRef = useRef<Particle[]>(buildSphere())
  // Current interpolated positions (smooth)
  const curRef = useRef(ptsRef.current.map(p => ({ x: p.bx, y: p.by, z: p.bz })))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      buildLetterTargets()
    }

    const buildLetterTargets = () => {
      const W = canvas.width
      const H = canvas.height
      const oc = document.createElement('canvas')
      oc.width = W
      oc.height = H
      const octx = oc.getContext('2d')!
      const fontSize = Math.min(W / 8, 72)
      octx.font = `bold ${fontSize}px monospace`
      octx.textAlign = 'center'
      octx.textBaseline = 'middle'
      octx.fillStyle = 'white'
      octx.fillText('RT-TopKSAE', W / 2, H / 2)

      const imageData = octx.getImageData(0, 0, W, H)
      const positions: { x: number; y: number }[] = []
      const step = 5
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (imageData.data[(y * W + x) * 4] > 128) {
            positions.push({
              x: (x / W - 0.5) * 2,
              y: -(y / H - 0.5) * 2,
            })
          }
        }
      }

      // Shuffle positions
      for (let i = positions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[positions[i], positions[j]] = [positions[j], positions[i]]
      }

      ptsRef.current.forEach((p, i) => {
        const t = positions[i % positions.length]
        p.tx = t.x
        p.ty = t.y
      })
    }

    const onScroll = () => {
      progRef.current = Math.min(1, window.scrollY / window.innerHeight)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    resize()
    window.addEventListener('resize', resize)

    let t = 0
    let raf: number

    const animate = () => {
      t += 0.012
      const W = canvas.width
      const H = canvas.height
      const prog = progRef.current

      // Phase split:
      // 0.0–0.45: collapse z axis (3D → 2D)
      // 0.45–1.0: flow to letter positions
      const collapseP = Math.min(1, prog / 0.45)
      const letterP = Math.max(0, Math.min(1, (prog - 0.45) / 0.55))

      ctx.fillStyle = 'rgba(8,12,30,0.18)'
      ctx.fillRect(0, 0, W, H)

      const scale = Math.min(W, H) * 0.36
      const cx = W / 2
      const cy = H / 2
      // Gentle tilt fades out as we approach letter phase
      const tilt = 0.32 * (1 - letterP)

      const cur = curRef.current

      ptsRef.current.forEach((p, i) => {
        // Sphere base with gentle drift
        const drift = (1 - letterP) * 0.022
        const baseX = p.bx + Math.sin(t * 0.55 + p.phase) * drift
        const baseY = p.by + Math.cos(t * 0.42 + p.phase) * drift
        const baseZ = p.bz * (1 - collapseP) // collapse z to 0

        // Target letter position
        const targX = p.tx
        const targY = p.ty

        // Lerp from sphere to letter
        const goalX = baseX + (targX - baseX) * letterP
        const goalY = baseY + (targY - baseY) * letterP
        const goalZ = baseZ * (1 - letterP)

        // Smooth toward goal
        cur[i].x += (goalX - cur[i].x) * 0.07
        cur[i].y += (goalY - cur[i].y) * 0.07
        cur[i].z += (goalZ - cur[i].z) * 0.07

        const sx = cx + cur[i].x * scale
        const sy = cy - cur[i].y * scale + cur[i].z * scale * tilt

        const inLetterPhase = letterP > 0.55
        const glow = inLetterPhase ? 0.45 + Math.sin(t * 3 + p.phase) * 0.3 : 0

        if (glow > 0.1) {
          const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, 6)
          g.addColorStop(0, `rgba(${p.col},${glow * 0.5})`)
          g.addColorStop(1, 'rgba(0,0,0,0)')
          ctx.beginPath()
          ctx.arc(sx, sy, 6, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()
        }

        const alpha = inLetterPhase
          ? 0.55 + Math.sin(t * 2 + p.phase) * 0.35
          : 0.18 + Math.sin(t * 1.5 + p.phase) * 0.08
        const size = inLetterPhase ? 1.6 : 1.0

        ctx.beginPath()
        ctx.arc(sx, sy, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.col},${alpha})`
        ctx.fill()
      })

      // Status caption
      ctx.font = '9px monospace'
      ctx.textAlign = 'left'
      const caption =
        letterP > 0.4
          ? 'MANIFOLD PROJECTION  ·  feature directions crystallising'
          : collapseP < 0.98
            ? `DIMENSIONALITY REDUCTION  ·  collapsing z-axis  [${Math.round(collapseP * 100)}%]`
            : 'HIGH-ENTROPY 3D LATENT SPACE'
      ctx.fillStyle = `rgba(100,120,155,${0.25 + collapseP * 0.2})`
      ctx.fillText(caption, 16, H - 16)

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
      className="absolute inset-0 w-full h-full canvas-void"
      style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
    />
  )
}
