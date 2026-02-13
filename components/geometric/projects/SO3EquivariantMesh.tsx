'use client'

import { useEffect, useRef } from 'react'

// Icosphere generation — subdivide from octahedron
function createIcosphere(subdivisions: number): { verts: [number,number,number][]; edges: [number,number][] } {
  const phi = (1 + Math.sqrt(5)) / 2
  let verts: [number,number,number][] = [
    [0, 1, phi], [0, -1, phi], [0, 1, -phi], [0, -1, -phi],
    [1, phi, 0], [-1, phi, 0], [1, -phi, 0], [-1, -phi, 0],
    [phi, 0, 1], [-phi, 0, 1], [phi, 0, -1], [-phi, 0, -1],
  ]
  // Normalize to unit sphere
  verts = verts.map(v => {
    const l = Math.sqrt(v[0]**2 + v[1]**2 + v[2]**2)
    return [v[0]/l, v[1]/l, v[2]/l]
  })

  // Build edges from adjacent vertices (distance ~1.05 in unit icosahedron)
  const edges: [number,number][] = []
  for (let i = 0; i < verts.length; i++) {
    for (let j = i+1; j < verts.length; j++) {
      const [ax,ay,az] = verts[i]
      const [bx,by,bz] = verts[j]
      const d = Math.sqrt((ax-bx)**2+(ay-by)**2+(az-bz)**2)
      if (d < 1.2) edges.push([i,j])
    }
  }

  return { verts, edges }
}

// Rotate a 3D vector by Euler angles
function rotateVert(
  v: [number,number,number],
  rx: number, ry: number, rz: number
): [number,number,number] {
  let [x,y,z] = v
  // Rotate X
  let y1 = y*Math.cos(rx) - z*Math.sin(rx)
  let z1 = y*Math.sin(rx) + z*Math.cos(rx)
  // Rotate Y
  let x2 = x*Math.cos(ry) + z1*Math.sin(ry)
  let z2 = -x*Math.sin(ry) + z1*Math.cos(ry)
  // Rotate Z
  let x3 = x2*Math.cos(rz) - y1*Math.sin(rz)
  let y3 = x2*Math.sin(rz) + y1*Math.cos(rz)
  return [x3, y3, z2]
}

function project(
  v: [number,number,number],
  cx: number, cy: number, R: number
): [number, number, number] {
  const fov = 4
  const s = fov / (fov + v[2] * 0.5)
  return [cx + v[0]*R*s, cy + v[1]*R*s, v[2]]
}

export default function SO3EquivariantMesh({ hovered }: { hovered: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hoveredRef = useRef(hovered)
  useEffect(() => { hoveredRef.current = hovered }, [hovered])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width = canvas.offsetWidth
    const H = canvas.height = canvas.offsetHeight

    const { verts, edges } = createIcosphere(1)

    let rx = 0.3
    let ry = 0
    let rz = 0.1
    let t = 0
    let raf: number
    // Ghost lags behind main rotation
    let ghostRx = 0.3, ghostRy = 0, ghostRz = 0.1

    const animate = () => {
      t += 0.01
      ctx.clearRect(0, 0, W, H)

      const isHovered = hoveredRef.current
      const speed = isHovered ? 0.018 : 0.006

      ry += speed
      rx = 0.3 + Math.sin(t * 0.4) * 0.15

      // Ghost follows with lag
      ghostRy += (ry - ghostRy) * (isHovered ? 0.15 : 0.3)
      ghostRx += (rx - ghostRx) * 0.1
      ghostRz += (rz - ghostRz) * 0.1

      const cx = W / 2
      const cy = H / 2
      const R = Math.min(W, H) * 0.38

      // ── Draw ghost copy (lagged, translucent, slightly larger) ──
      const ghostAlpha = isHovered ? 0.4 : 0.15
      const ghostR = R * (isHovered ? 1.08 : 1.04)

      edges.forEach(([i, j]) => {
        const a = project(rotateVert(verts[i], ghostRx, ghostRy, ghostRz), cx, cy, ghostR)
        const b = project(rotateVert(verts[j], ghostRx, ghostRy, ghostRz), cx, cy, ghostR)
        const avgZ = (a[2] + b[2]) / 2
        const depthA = (0.5 + avgZ * 0.3) * ghostAlpha

        ctx.beginPath()
        ctx.moveTo(a[0], a[1])
        ctx.lineTo(b[0], b[1])
        ctx.strokeStyle = `rgba(168, 85, 247, ${depthA})`
        ctx.lineWidth = 0.7
        ctx.stroke()
      })

      verts.forEach(v => {
        const p = project(rotateVert(v, ghostRx, ghostRy, ghostRz), cx, cy, ghostR)
        const depthA = (0.4 + p[2] * 0.2) * ghostAlpha * 1.5
        ctx.beginPath()
        ctx.arc(p[0], p[1], 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(168, 85, 247, ${depthA})`
        ctx.fill()
      })

      // ── Draw main sphere ──
      // Pulse nodes synced to "7x" metric
      const pulse = 0.7 + Math.sin(t * 7) * 0.3  // 7 beats — mirrors the 7× improvement

      edges.forEach(([i, j]) => {
        const a = project(rotateVert(verts[i], rx, ry, rz), cx, cy, R)
        const b = project(rotateVert(verts[j], rx, ry, rz), cx, cy, R)
        const avgZ = (a[2] + b[2]) / 2
        const depthA = 0.3 + avgZ * 0.3
        const alpha = isHovered ? depthA * 0.9 : depthA * 0.5

        ctx.beginPath()
        ctx.moveTo(a[0], a[1])
        ctx.lineTo(b[0], b[1])
        ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`
        ctx.lineWidth = isHovered ? 1.2 : 0.8
        ctx.stroke()
      })

      verts.forEach((v, i) => {
        const p = project(rotateVert(v, rx, ry, rz), cx, cy, R)
        const depthScale = 0.6 + p[2] * 0.2
        const r = depthScale * (2.5 + pulse * 1.5)

        // Glow
        if (isHovered || pulse > 0.9) {
          const glow = ctx.createRadialGradient(p[0], p[1], 0, p[0], p[1], r * 4)
          glow.addColorStop(0, `rgba(6, 182, 212, ${0.3 * depthScale})`)
          glow.addColorStop(1, 'rgba(6, 182, 212, 0)')
          ctx.beginPath()
          ctx.arc(p[0], p[1], r * 4, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(p[0], p[1], r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(6, 182, 212, ${0.5 + pulse * 0.3})`
        ctx.fill()
      })

      // SO(3) equivariance label
      if (isHovered) {
        ctx.font = '9px monospace'
        ctx.fillStyle = 'rgba(6, 182, 212, 0.5)'
        ctx.textAlign = 'center'
        ctx.fillText('SO(3) EQUIVARIANT  ·  Ghost mirrors orientation', cx, H - 12)
      }

      raf = requestAnimationFrame(animate)
    }

    animate()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ mixBlendMode: 'screen', pointerEvents: 'none' }}
    />
  )
}
