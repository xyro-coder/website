'use client'

import { useEffect, useRef, useState } from 'react'

interface InterestNode {
  id: string
  label: string
  x: number; y: number
  vx: number; vy: number
  color: string
  hovered: boolean
  group: number
}

// Adjacency: mathematically adjacent research areas share a simplex
const INTERESTS: { id: string; label: string; color: string; group: number }[] = [
  { id: 'gdl', label: 'Geometric\nDeep Learning', color: '6, 182, 212', group: 0 },
  { id: 'eq', label: 'Equivariant\nNetworks', color: '6, 182, 212', group: 0 },
  { id: 'sae', label: 'Sparse\nAutoencoders', color: '168, 85, 247', group: 1 },
  { id: 'mi', label: 'Mechanistic\nInterpretability', color: '168, 85, 247', group: 1 },
  { id: 'ml', label: 'Manifold\nLearning', color: '99, 102, 241', group: 2 },
  { id: 'ph', label: 'Persistent\nHomology', color: '99, 102, 241', group: 2 },
  { id: 'inf', label: 'ML Training\nInfrastructure', color: '34, 197, 94', group: 3 },
]

// Edges between adjacent interests
const EDGES: [string, string][] = [
  ['gdl', 'eq'],
  ['gdl', 'ml'],
  ['gdl', 'sae'],
  ['eq', 'ml'],
  ['sae', 'mi'],
  ['sae', 'inf'],
  ['mi', 'gdl'],
  ['ph', 'ml'],
  ['ph', 'gdl'],
  ['inf', 'mi'],
]

// Triangular simplex faces (groups that form planes)
const FACES: [string, string, string][] = [
  ['gdl', 'eq', 'ml'],
  ['gdl', 'sae', 'mi'],
  ['ph', 'ml', 'gdl'],
  ['sae', 'mi', 'inf'],
]

export default function TopologicalInterestMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const hoveredRef = useRef<string | null>(null)
  useEffect(() => { hoveredRef.current = hoveredId }, [hoveredId])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      initNodes()
    }

    let nodes: InterestNode[] = []
    let edgeIdx: [number, number][] = []
    let faceIdx: [number, number, number][] = []

    const initNodes = () => {
      const W = canvas.width
      const H = canvas.height
      // Initial positions in a rough circle with some cluster offset
      const positions: [number, number][] = [
        [0.35, 0.35], // gdl — center-left
        [0.22, 0.55], // eq
        [0.60, 0.30], // sae
        [0.75, 0.55], // mi
        [0.45, 0.70], // ml
        [0.25, 0.78], // ph
        [0.72, 0.75], // inf
      ]

      nodes = INTERESTS.map((n, i) => ({
        ...n,
        x: positions[i][0] * W,
        y: positions[i][1] * H,
        vx: 0, vy: 0,
        hovered: false,
      }))

      edgeIdx = EDGES.map(([a, b]) => [
        nodes.findIndex(n => n.id === a),
        nodes.findIndex(n => n.id === b),
      ]).filter(([a, b]) => a >= 0 && b >= 0) as [number, number][]

      faceIdx = FACES.map(([a, b, c]) => [
        nodes.findIndex(n => n.id === a),
        nodes.findIndex(n => n.id === b),
        nodes.findIndex(n => n.id === c),
      ]).filter(([a, b, c]) => a >= 0 && b >= 0 && c >= 0) as [number, number, number][]
    }

    initNodes()
    window.addEventListener('resize', resize)

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      mouseRef.current = { x: mx, y: my }

      let found: string | null = null
      nodes.forEach(n => {
        const d = Math.sqrt((n.x - mx) ** 2 + (n.y - my) ** 2)
        if (d < 32) found = n.id
      })
      setHoveredId(found)
    }
    const onMouseLeave = () => {
      mouseRef.current = null
      setHoveredId(null)
    }
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    let t = 0
    let raf: number

    // Find neighbors of a node
    const getNeighbors = (id: string): Set<string> => {
      const s = new Set<string>()
      EDGES.forEach(([a, b]) => {
        if (a === id) s.add(b)
        if (b === id) s.add(a)
      })
      return s
    }

    const animate = () => {
      t += 0.008
      const W = canvas.width
      const H = canvas.height

      ctx.fillStyle = 'rgba(8, 12, 30, 0.2)'
      ctx.fillRect(0, 0, W, H)

      // Drift: gentle float
      nodes.forEach((n, i) => {
        const ix = INTERESTS.indexOf(INTERESTS.find(x => x.id === n.id)!)
        const offX = Math.sin(t * 0.7 + ix * 1.1) * 0.4
        const offY = Math.cos(t * 0.5 + ix * 0.9) * 0.4
        n.vx += offX * 0.1
        n.vy += offY * 0.1

        // Repulsion
        nodes.forEach((other, j) => {
          if (i === j) return
          const dx = n.x - other.x
          const dy = n.y - other.y
          const d = Math.sqrt(dx**2 + dy**2) || 1
          const minD = 110
          if (d < minD) {
            n.vx += (dx/d) * (minD - d) * 0.04
            n.vy += (dy/d) * (minD - d) * 0.04
          }
        })

        // Edge spring
        edgeIdx.forEach(([ai, bi]) => {
          if (ai !== i && bi !== i) return
          const other = nodes[ai === i ? bi : ai]
          const dx = other.x - n.x
          const dy = other.y - n.y
          const d = Math.sqrt(dx**2 + dy**2) || 1
          const rest = 160
          n.vx += (dx/d) * (d - rest) * 0.005
          n.vy += (dy/d) * (d - rest) * 0.005
        })

        // Center gravity
        n.vx += (W * 0.5 - n.x) * 0.002
        n.vy += (H * 0.5 - n.y) * 0.002

        n.vx *= 0.88
        n.vy *= 0.88
        n.x += n.vx
        n.y += n.vy
        n.x = Math.max(50, Math.min(W - 50, n.x))
        n.y = Math.max(40, Math.min(H - 40, n.y))
      })

      const hovered = hoveredRef.current
      const neighbors = hovered ? getNeighbors(hovered) : new Set<string>()

      // Draw simplex faces
      faceIdx.forEach(([ai, bi, ci]) => {
        const a = nodes[ai]; const b = nodes[bi]; const c = nodes[ci]
        const isHighlighted = hovered && (
          a.id === hovered || b.id === hovered || c.id === hovered ||
          neighbors.has(a.id) || neighbors.has(b.id) || neighbors.has(c.id)
        )

        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.lineTo(c.x, c.y)
        ctx.closePath()

        if (isHighlighted) {
          const grad = ctx.createLinearGradient(a.x, a.y, c.x, c.y)
          grad.addColorStop(0, `rgba(${a.color}, 0.18)`)
          grad.addColorStop(1, `rgba(${c.color}, 0.18)`)
          ctx.fillStyle = grad
        } else {
          ctx.fillStyle = 'rgba(99, 102, 241, 0.06)'
        }
        ctx.fill()
        ctx.strokeStyle = isHighlighted ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.12)'
        ctx.lineWidth = 0.5
        ctx.stroke()
      })

      // Draw edges
      edgeIdx.forEach(([ai, bi]) => {
        const a = nodes[ai]; const b = nodes[bi]
        const isHighlighted = hovered && (
          a.id === hovered || b.id === hovered ||
          neighbors.has(a.id) || neighbors.has(b.id)
        )

        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
        const alpha = isHighlighted ? 0.7 : 0.2
        grad.addColorStop(0, `rgba(${a.color}, ${alpha})`)
        grad.addColorStop(1, `rgba(${b.color}, ${alpha})`)

        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = isHighlighted ? 1.5 : 0.8
        ctx.stroke()

        // Animated particle on highlighted edges
        if (isHighlighted) {
          const prog = (t * 0.5 + ai * 0.2) % 1
          const px = a.x + (b.x - a.x) * prog
          const py = a.y + (b.y - a.y) * prog
          ctx.beginPath()
          ctx.arc(px, py, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${a.color}, 0.9)`
          ctx.fill()
        }
      })

      // Draw nodes
      nodes.forEach(n => {
        const isHov = n.id === hovered
        const isNeighbor = neighbors.has(n.id)
        const pulse = 0.7 + Math.sin(t * 2 + nodes.indexOf(n) * 0.8) * 0.3
        const r = isHov ? 28 : isNeighbor ? 24 : 20

        // Glow
        const glowAlpha = isHov ? 0.35 : isNeighbor ? 0.2 : 0.08
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 2)
        glow.addColorStop(0, `rgba(${n.color}, ${glowAlpha})`)
        glow.addColorStop(1, `rgba(${n.color}, 0)`)
        ctx.beginPath()
        ctx.arc(n.x, n.y, r * 2, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // Node circle
        ctx.beginPath()
        ctx.arc(n.x, n.y, r * 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${n.color}, ${isHov ? 0.4 : 0.12 + pulse * 0.08})`
        ctx.fill()
        ctx.strokeStyle = `rgba(${n.color}, ${isHov ? 0.9 : isNeighbor ? 0.7 : 0.4})`
        ctx.lineWidth = isHov ? 2 : 1.2
        ctx.stroke()

        // Label — multiline
        const lines = n.label.split('\n')
        const fontSize = isHov ? 11 : 9
        ctx.font = `${isHov ? 'bold ' : ''}${fontSize}px monospace`
        ctx.fillStyle = `rgba(${n.color}, ${isHov ? 1 : isNeighbor ? 0.85 : 0.6})`
        ctx.textAlign = 'center'
        lines.forEach((line, li) => {
          ctx.fillText(line, n.x, n.y + (li - (lines.length - 1) / 2) * (fontSize + 2))
        })
      })

      raf = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height: 420, display: 'block', cursor: 'crosshair' }}
    />
  )
}
