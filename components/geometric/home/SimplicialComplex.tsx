'use client'

import { useEffect, useRef } from 'react'

interface Node {
  x: number; y: number; z: number
  vx: number; vy: number; vz: number
}

interface Triangle {
  a: number; b: number; c: number
  persistence: number // how long this simplex has existed
}

const NODE_COUNT = 80
const CONNECT_DIST = 160
const FACE_DIST = 200

export default function SimplicialComplex() {
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

    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: (Math.random() - 0.5) * 600,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      vz: (Math.random() - 0.5) * 0.4,
    }))

    const trianglePersistence = new Map<string, number>()

    let raf: number

    const project = (x: number, y: number, z: number) => {
      const fov = 600
      const scale = fov / (fov + z)
      const cx = canvas.width / 2
      const cy = canvas.height / 2
      return {
        sx: cx + (x - cx) * scale,
        sy: cy + (y - cy) * scale,
        scale,
      }
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(8, 12, 30, 0.12)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update nodes
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy; n.z += n.vz
        if (n.x < 0 || n.x > canvas.width) n.vx *= -1
        if (n.y < 0 || n.y > canvas.height) n.vy *= -1
        if (n.z < -400 || n.z > 400) n.vz *= -1
        n.x = Math.max(0, Math.min(canvas.width, n.x))
        n.y = Math.max(0, Math.min(canvas.height, n.y))
      })

      // Find edges and triangles
      const edges: [number, number, number][] = [] // [i, j, dist]
      const triangles: Triangle[] = []

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dz = nodes[i].z - nodes[j].z
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz)

          if (d < CONNECT_DIST) {
            edges.push([i, j, d])

            // Find triangles (k-simplices)
            for (let k = j + 1; k < nodes.length; k++) {
              const dx2 = nodes[i].x - nodes[k].x
              const dy2 = nodes[i].y - nodes[k].y
              const dz2 = nodes[i].z - nodes[k].z
              const d2 = Math.sqrt(dx2 * dx2 + dy2 * dy2 + dz2 * dz2)

              const dx3 = nodes[j].x - nodes[k].x
              const dy3 = nodes[j].y - nodes[k].y
              const dz3 = nodes[j].z - nodes[k].z
              const d3 = Math.sqrt(dx3 * dx3 + dy3 * dy3 + dz3 * dz3)

              if (d2 < FACE_DIST && d3 < FACE_DIST) {
                const key = `${i}-${j}-${k}`
                const prev = trianglePersistence.get(key) || 0
                trianglePersistence.set(key, prev + 1)
                triangles.push({ a: i, b: j, c: k, persistence: Math.min(trianglePersistence.get(key)! / 30, 1) })
              }
            }
          } else {
            // Decay persistence
            const key1 = `${i}-${j}`
            trianglePersistence.delete(key1)
          }
        }
      }

      // Sort by z-depth for painter's algorithm
      triangles.sort((t1, t2) => {
        const z1 = (nodes[t1.a].z + nodes[t1.b].z + nodes[t1.c].z) / 3
        const z2 = (nodes[t2.a].z + nodes[t2.b].z + nodes[t2.c].z) / 3
        return z1 - z2
      })

      // Draw triangular faces (k-simplices)
      triangles.forEach(({ a, b, c, persistence }) => {
        const pa = project(nodes[a].x, nodes[a].y, nodes[a].z)
        const pb = project(nodes[b].x, nodes[b].y, nodes[b].z)
        const pc = project(nodes[c].x, nodes[c].y, nodes[c].z)

        ctx.beginPath()
        ctx.moveTo(pa.sx, pa.sy)
        ctx.lineTo(pb.sx, pb.sy)
        ctx.lineTo(pc.sx, pc.sy)
        ctx.closePath()

        // Transparency mapped to persistence
        const faceAlpha = persistence * 0.12
        ctx.fillStyle = `rgba(168, 85, 247, ${faceAlpha})`
        ctx.fill()

        // Edges of the simplex
        const edgeAlpha = 0.15 + persistence * 0.3
        ctx.strokeStyle = `rgba(6, 182, 212, ${edgeAlpha})`
        ctx.lineWidth = 0.7
        ctx.stroke()
      })

      // Draw edges (1-simplices)
      edges.forEach(([i, j, d]) => {
        const pa = project(nodes[i].x, nodes[i].y, nodes[i].z)
        const pb = project(nodes[j].x, nodes[j].y, nodes[j].z)
        const alpha = (1 - d / CONNECT_DIST) * 0.25

        ctx.beginPath()
        ctx.moveTo(pa.sx, pa.sy)
        ctx.lineTo(pb.sx, pb.sy)
        ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      })

      // Draw nodes (0-simplices)
      nodes.forEach(n => {
        const { sx, sy, scale } = project(n.x, n.y, n.z)
        const size = scale * 2.5

        ctx.beginPath()
        ctx.arc(sx, sy, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(168, 85, 247, ${0.3 * scale})`
        ctx.fill()
      })

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
