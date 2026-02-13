'use client'

import { useEffect, useRef, useState } from 'react'

// Organizations / community nodes
const ORGS = [
  { id: 'algoverse', label: 'Algoverse AI', type: 'research', color: '6, 182, 212', x: 0.5, y: 0.25 },
  { id: 'uw', label: 'UW Allen School', type: 'academic', color: '6, 182, 212', x: 0.3, y: 0.4 },
  { id: 'colorstack', label: 'ColorStack', type: 'community', color: '168, 85, 247', x: 0.7, y: 0.4 },
  { id: 'nsbe', label: 'NSBE', type: 'community', color: '168, 85, 247', x: 0.2, y: 0.65 },
  { id: 'codepath', label: 'CodePath', type: 'academic', color: '99, 102, 241', x: 0.5, y: 0.6 },
  { id: 'math', label: 'BC Math Club', type: 'academic', color: '99, 102, 241', x: 0.75, y: 0.65 },
  { id: 'robotics', label: 'BC Robotics', type: 'academic', color: '99, 102, 241', x: 0.4, y: 0.8 },
  { id: 'outamation', label: 'Outamation', type: 'industry', color: '168, 85, 247', x: 0.65, y: 0.8 },
]

const EDGES = [
  ['algoverse', 'uw'],
  ['algoverse', 'outamation'],
  ['uw', 'colorstack'],
  ['uw', 'nsbe'],
  ['uw', 'codepath'],
  ['colorstack', 'nsbe'],
  ['codepath', 'math'],
  ['math', 'robotics'],
  ['robotics', 'codepath'],
  ['outamation', 'colorstack'],
]

// Icosahedron vertices (normalized)
const ICO_VERTS: [number, number, number][] = (() => {
  const phi = (1 + Math.sqrt(5)) / 2
  const verts: [number, number, number][] = [
    [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
    [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
    [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1],
  ]
  return verts.map(v => {
    const len = Math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2)
    return [v[0] / len, v[1] / len, v[2] / len]
  })
})()

// Project 3D point to 2D
function project3D(
  x: number, y: number, z: number,
  cx: number, cy: number, R: number,
  rotX: number, rotY: number
): [number, number, number] {
  // Rotate around Y
  const x1 = x * Math.cos(rotY) + z * Math.sin(rotY)
  const z1 = -x * Math.sin(rotY) + z * Math.cos(rotY)
  const y1 = y
  // Rotate around X
  const y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX)
  const z2 = y1 * Math.sin(rotX) + z1 * Math.cos(rotX)
  // Simple perspective
  const fov = 3
  const scale = fov / (fov + z2 * 0.3)
  return [cx + x1 * R * scale, cy + y2 * R * scale, z2]
}

type ViewMode = 'graph' | 'simplicial'

export default function StructuralInvariance() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mode, setMode] = useState<ViewMode>('graph')
  const modeRef = useRef<ViewMode>('graph')

  useEffect(() => { modeRef.current = mode }, [mode])

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

    // Graph physics state
    interface PhysicsNode {
      x: number; y: number; vx: number; vy: number
      id: string; label: string; color: string; type: string
    }

    let nodes: PhysicsNode[] = ORGS.map(o => ({
      ...o,
      x: o.x * canvas.width,
      y: o.y * canvas.height,
      vx: 0, vy: 0,
    }))

    const edgeIdx = EDGES.map(([a, b]) => [
      nodes.findIndex(n => n.id === a),
      nodes.findIndex(n => n.id === b),
    ]).filter(([a, b]) => a >= 0 && b >= 0)

    let rotX = 0.3
    let rotY = 0
    let anim = 0
    let raf: number
    let transitionT = 0 // 0 = graph, 1 = simplicial

    const animate = () => {
      anim += 0.01
      const W = canvas.width
      const H = canvas.height
      const targetT = modeRef.current === 'simplicial' ? 1 : 0
      transitionT += (targetT - transitionT) * 0.05

      rotY = anim * 0.3
      rotX = 0.3 + Math.sin(anim * 0.2) * 0.1

      ctx.fillStyle = 'rgba(8, 12, 30, 0.3)'
      ctx.fillRect(0, 0, W, H)

      // ── GRAPH VIEW ──
      if (transitionT < 0.98) {
        const alpha = 1 - transitionT

        // Physics
        nodes.forEach((a, i) => {
          const tx = ORGS[i].x * W
          const ty = ORGS[i].y * H
          a.vx += (tx - a.x) * 0.004
          a.vy += (ty - a.y) * 0.004

          nodes.forEach((b, j) => {
            if (i === j) return
            const dx = a.x - b.x
            const dy = a.y - b.y
            const d = Math.sqrt(dx * dx + dy * dy) || 1
            const minD = 80
            if (d < minD) {
              a.vx += (dx / d) * (minD - d) * 0.03
              a.vy += (dy / d) * (minD - d) * 0.03
            }
          })

          edgeIdx.forEach(([ai, bi]) => {
            if (ai !== i && bi !== i) return
            const other = nodes[ai === i ? bi : ai]
            const dx = other.x - a.x
            const dy = other.y - a.y
            const d = Math.sqrt(dx * dx + dy * dy) || 1
            a.vx += (dx / d) * Math.max(0, d - 100) * 0.01
            a.vy += (dy / d) * Math.max(0, d - 100) * 0.01
          })

          a.vx *= 0.85
          a.vy *= 0.85
          a.x += a.vx
          a.y += a.vy
        })

        // Draw edges
        edgeIdx.forEach(([ai, bi]) => {
          const a = nodes[ai]
          const b = nodes[bi]
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.strokeStyle = `rgba(100, 120, 200, ${0.3 * alpha})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        })

        // Draw nodes
        nodes.forEach(n => {
          const col = n.color
          const pulse = 1 + Math.sin(anim * 2 + nodes.indexOf(n) * 0.6) * 0.1

          // Glow
          const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 35)
          glow.addColorStop(0, `rgba(${col}, ${0.15 * alpha})`)
          glow.addColorStop(1, `rgba(${col}, 0)`)
          ctx.beginPath()
          ctx.arc(n.x, n.y, 35, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()

          // Node
          ctx.beginPath()
          ctx.arc(n.x, n.y, 10 * pulse, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${col}, ${0.25 * alpha})`
          ctx.fill()
          ctx.strokeStyle = `rgba(${col}, ${0.8 * alpha})`
          ctx.lineWidth = 1.5
          ctx.stroke()

          ctx.font = '10px monospace'
          ctx.fillStyle = `rgba(${col}, ${0.9 * alpha})`
          ctx.textAlign = 'center'
          ctx.fillText(n.label, n.x, n.y + 24)
        })
      }

      // ── SIMPLICIAL VIEW ──
      if (transitionT > 0.02) {
        const alpha = transitionT
        const cx = W / 2
        const cy = H * 0.48
        const R = Math.min(W, H) * 0.28

        // Project all icosahedron vertices
        const projected = ICO_VERTS.map(([x, y, z]) =>
          project3D(x, y, z, cx, cy, R, rotX, rotY)
        )

        // Draw edges of icosahedron (distance-based)
        for (let i = 0; i < ICO_VERTS.length; i++) {
          for (let j = i + 1; j < ICO_VERTS.length; j++) {
            const [ax, ay, az] = ICO_VERTS[i]
            const [bx, by, bz] = ICO_VERTS[j]
            const d = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2)
            if (d > 1.05) continue // only adjacent vertices

            const [px1, py1, pz1] = projected[i]
            const [px2, py2, pz2] = projected[j]

            // Depth-based alpha
            const avgZ = (pz1 + pz2) / 2
            const depthAlpha = (0.5 - avgZ * 0.3) * alpha

            ctx.beginPath()
            ctx.moveTo(px1, py1)
            ctx.lineTo(px2, py2)
            ctx.strokeStyle = `rgba(6, 182, 212, ${Math.max(0, depthAlpha * 0.5)})`
            ctx.lineWidth = 0.8
            ctx.stroke()
          }
        }

        // Draw faces
        for (let i = 0; i < ICO_VERTS.length; i++) {
          for (let j = i + 1; j < ICO_VERTS.length; j++) {
            for (let k = j + 1; k < ICO_VERTS.length; k++) {
              const [ax, ay, az] = ICO_VERTS[i]
              const [bx, by, bz] = ICO_VERTS[j]
              const [cx2, cy2, cz2] = ICO_VERTS[k]
              const dab = Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2 + (az - bz) ** 2)
              const dac = Math.sqrt((ax - cx2) ** 2 + (ay - cy2) ** 2 + (az - cz2) ** 2)
              const dbc = Math.sqrt((bx - cx2) ** 2 + (by - cy2) ** 2 + (bz - cz2) ** 2)
              if (dab > 1.05 || dac > 1.05 || dbc > 1.05) continue

              const [px1, py1, pz1] = projected[i]
              const [px2, py2, pz2] = projected[j]
              const [px3, py3, pz3] = projected[k]

              const avgZ = (pz1 + pz2 + pz3) / 3
              if (avgZ > 0.4) continue // back-face culling

              ctx.beginPath()
              ctx.moveTo(px1, py1)
              ctx.lineTo(px2, py2)
              ctx.lineTo(px3, py3)
              ctx.closePath()

              const faceAlpha = (0.3 - avgZ * 0.15) * alpha
              ctx.fillStyle = `rgba(168, 85, 247, ${Math.max(0, faceAlpha * 0.3)})`
              ctx.fill()
              ctx.strokeStyle = `rgba(168, 85, 247, ${Math.max(0, faceAlpha)})`
              ctx.lineWidth = 0.5
              ctx.stroke()
            }
          }
        }

        // Draw vertices with org labels
        projected.forEach(([px, py, pz], i) => {
          const orgIdx = i % ORGS.length
          const org = ORGS[orgIdx]
          const depthScale = 0.7 + pz * 0.1
          const col = org.color

          ctx.beginPath()
          ctx.arc(px, py, 5 * depthScale, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${col}, ${0.6 * alpha})`
          ctx.fill()
          ctx.strokeStyle = `rgba(${col}, ${0.9 * alpha})`
          ctx.lineWidth = 1
          ctx.stroke()

          if (pz < 0.2) {
            ctx.font = `${9 * depthScale}px monospace`
            ctx.fillStyle = `rgba(${col}, ${0.7 * alpha})`
            ctx.textAlign = 'center'
            ctx.fillText(org.label, px, py - 10)
          }
        })

        // Center label
        ctx.font = '9px monospace'
        ctx.fillStyle = `rgba(168, 85, 247, ${0.4 * alpha})`
        ctx.textAlign = 'center'
        ctx.fillText('ICOSAHEDRAL SYMMETRY  ·  Equivariant under SO(3)', cx, H - 16)
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
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full rounded-2xl border border-slate-800/50"
        style={{ height: 420, display: 'block' }}
      />
      {/* Symmetry Toggle */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={() => setMode('graph')}
          className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${
            mode === 'graph'
              ? 'border-cyan-500/60 bg-cyan-500/10 text-cyan-400'
              : 'border-slate-700 text-slate-500 hover:border-slate-600'
          }`}
        >
          Graph
        </button>
        <button
          onClick={() => setMode('simplicial')}
          className={`px-3 py-1.5 text-xs font-mono rounded-lg border transition-all ${
            mode === 'simplicial'
              ? 'border-purple-500/60 bg-purple-500/10 text-purple-400'
              : 'border-slate-700 text-slate-500 hover:border-slate-600'
          }`}
        >
          Simplicial
        </button>
      </div>
    </div>
  )
}
