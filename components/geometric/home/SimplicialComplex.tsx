'use client'

import { useEffect, useRef } from 'react'

interface Node { x: number; y: number; z: number; vx: number; vy: number; vz: number }

const NODE_COUNT = 80
const CONNECT_DIST = 160
const FACE_DIST = 200
const CONNECT_DIST2 = CONNECT_DIST * CONNECT_DIST
const FACE_DIST2 = FACE_DIST * FACE_DIST

// Spatial hash — O(1) neighbor lookup, replaces O(n²) brute force
const CELL = FACE_DIST * 0.9
const cellKey = (cx: number, cy: number) => (cx & 0xFFFF) << 16 | (cy & 0xFFFF)

export default function SimplicialComplex() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)

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

    const onMouseMove = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY } }
    const onMouseLeave = () => { mouseRef.current = null }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)

    // Pause when section is off-screen — biggest free win
    let isVisible = true
    const observer = new IntersectionObserver(([e]) => { isVisible = e.isIntersecting }, { threshold: 0.01 })
    observer.observe(canvas)

    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: (Math.random() - 0.5) * 600,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      vz: (Math.random() - 0.5) * 0.4,
    }))

    const trianglePersistence = new Map<number, number>()
    // Reusable adjacency sets — no allocation per frame
    const faceAdj: Set<number>[] = Array.from({ length: NODE_COUNT }, () => new Set())
    const edgeAdj: Set<number>[] = Array.from({ length: NODE_COUNT }, () => new Set())

    // Spatial hash state
    const spatialCells = new Map<number, number[]>()

    const buildSpatialHash = () => {
      spatialCells.clear()
      for (let i = 0; i < nodes.length; i++) {
        const cx = (nodes[i].x / CELL) | 0
        const cy = (nodes[i].y / CELL) | 0
        const key = cellKey(cx, cy)
        const cell = spatialCells.get(key)
        if (cell) cell.push(i); else spatialCells.set(key, [i])
      }
    }

    const getCandidates = (x: number, y: number): number[] => {
      const cx = (x / CELL) | 0
      const cy = (y / CELL) | 0
      const out: number[] = []
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          const cell = spatialCells.get(cellKey(cx + dx, cy + dy))
          if (cell) for (let k = 0; k < cell.length; k++) out.push(cell[k])
        }
      }
      return out
    }

    let cachedEdges: [number, number, number][] = []
    let cachedTriangles: { a: number; b: number; c: number; persistence: number }[] = []
    let frame = 0
    let raf: number

    const project = (x: number, y: number, z: number) => {
      const s = 600 / (600 + z)
      const cx = canvas.width * 0.5; const cy = canvas.height * 0.5
      return { sx: cx + (x - cx) * s, sy: cy + (y - cy) * s, scale: s }
    }

    const animate = () => {
      raf = requestAnimationFrame(animate)
      if (!isVisible) return

      frame++
      ctx.fillStyle = 'rgba(8,12,30,0.12)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const mouse = mouseRef.current

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        n.x += n.vx; n.y += n.vy; n.z += n.vz

        if (mouse) {
          const dx = mouse.x - n.x; const dy = mouse.y - n.y
          const d2 = dx * dx + dy * dy
          if (d2 < 62500 && d2 > 1) { // 250^2
            const inv = 0.18 / Math.sqrt(d2)
            n.vx += dx * inv; n.vy += dy * inv
          }
        }

        if (n.x < 0 || n.x > canvas.width) n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
        if (n.z < -400 || n.z > 400) n.vz *= -1
        n.vx *= 0.978; n.vy *= 0.978; n.vz *= 0.992
        n.x = Math.max(0, Math.min(canvas.width, n.x))
        n.y = Math.max(0, Math.min(canvas.height, n.y))
      }

      // Rebuild topology every 3 frames — spatial hash makes this fast
      if (frame % 3 === 0) {
        buildSpatialHash()
        cachedEdges = []
        for (let i = 0; i < nodes.length; i++) { faceAdj[i].clear(); edgeAdj[i].clear() }

        const seenFacePairs = new Set<number>()

        for (let i = 0; i < nodes.length; i++) {
          const ni = nodes[i]
          const candidates = getCandidates(ni.x, ni.y)
          for (let ci = 0; ci < candidates.length; ci++) {
            const j = candidates[ci]
            if (j <= i) continue
            const nj = nodes[j]
            const dx = ni.x - nj.x; const dy = ni.y - nj.y; const dz = ni.z - nj.z
            const d2 = dx * dx + dy * dy + dz * dz
            if (d2 >= FACE_DIST2) continue
            faceAdj[i].add(j); faceAdj[j].add(i)
            if (d2 < CONNECT_DIST2) {
              edgeAdj[i].add(j); edgeAdj[j].add(i)
              cachedEdges.push([i, j, Math.sqrt(d2)])
            }
            seenFacePairs.add(i * 10000 + j)
          }
        }

        // Triangles: for each edge (i,j), find k ∈ faceAdj[i] ∩ faceAdj[j]
        cachedTriangles = []
        const seenTriangles = new Set<number>()
        for (let ei = 0; ei < cachedEdges.length; ei++) {
          const [i, j] = cachedEdges[ei]
          faceAdj[i].forEach(k => {
            if (k <= j) return
            if (!faceAdj[j].has(k)) return
            const tkey = i * 10000 + j * 100 + (k % 100)
            if (seenTriangles.has(tkey)) return
            seenTriangles.add(tkey)
            const prev = (trianglePersistence.get(tkey) ?? 0) + 1
            trianglePersistence.set(tkey, prev)
            cachedTriangles.push({ a: i, b: j, c: k, persistence: Math.min(prev / 30, 1) })
          })
        }
        // Decay triangles no longer seen
        trianglePersistence.forEach((_, k) => { if (!seenTriangles.has(k)) trianglePersistence.delete(k) })
      }

      // Sort by z depth
      cachedTriangles.sort((t1, t2) =>
        (nodes[t1.a].z + nodes[t1.b].z + nodes[t1.c].z) -
        (nodes[t2.a].z + nodes[t2.b].z + nodes[t2.c].z)
      )

      for (let ti = 0; ti < cachedTriangles.length; ti++) {
        const { a, b, c, persistence } = cachedTriangles[ti]
        const pa = project(nodes[a].x, nodes[a].y, nodes[a].z)
        const pb = project(nodes[b].x, nodes[b].y, nodes[b].z)
        const pc = project(nodes[c].x, nodes[c].y, nodes[c].z)
        ctx.beginPath()
        ctx.moveTo(pa.sx, pa.sy); ctx.lineTo(pb.sx, pb.sy); ctx.lineTo(pc.sx, pc.sy)
        ctx.closePath()
        ctx.fillStyle = `rgba(168,85,247,${persistence * 0.12})`
        ctx.fill()
        ctx.strokeStyle = `rgba(6,182,212,${0.15 + persistence * 0.3})`
        ctx.lineWidth = 0.7; ctx.stroke()
      }

      for (let ei = 0; ei < cachedEdges.length; ei++) {
        const [i, j, d] = cachedEdges[ei]
        const pa = project(nodes[i].x, nodes[i].y, nodes[i].z)
        const pb = project(nodes[j].x, nodes[j].y, nodes[j].z)
        ctx.beginPath(); ctx.moveTo(pa.sx, pa.sy); ctx.lineTo(pb.sx, pb.sy)
        ctx.strokeStyle = `rgba(168,85,247,${(1 - d / CONNECT_DIST) * 0.25})`
        ctx.lineWidth = 0.5; ctx.stroke()
      }

      for (let i = 0; i < nodes.length; i++) {
        const { sx, sy, scale } = project(nodes[i].x, nodes[i].y, nodes[i].z)
        ctx.beginPath(); ctx.arc(sx, sy, scale * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(168,85,247,${0.3 * scale})`
        ctx.fill()
      }
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      observer.disconnect()
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
