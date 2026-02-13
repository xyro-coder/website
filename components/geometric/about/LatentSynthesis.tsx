'use client'

import { useEffect, useRef } from 'react'

interface SkillNode {
  id: string
  label: string
  cluster: number  // 0=ML, 1=Backend, 2=Math, 3=Languages
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  activation: number // 0-1, pulsing
  hovered: boolean
  connections: number[] // indices
}

const SKILLS: { label: string; cluster: number; radius: number }[] = [
  // ML cluster
  { label: 'PyTorch', cluster: 0, radius: 18 },
  { label: 'TensorFlow', cluster: 0, radius: 14 },
  { label: 'PyTorch Lightning', cluster: 0, radius: 12 },
  { label: 'scikit-learn', cluster: 0, radius: 13 },
  { label: 'LlamaIndex', cluster: 0, radius: 11 },
  // Math cluster
  { label: 'Linear Algebra', cluster: 2, radius: 17 },
  { label: 'Calculus I-III', cluster: 2, radius: 15 },
  { label: 'Statistics', cluster: 2, radius: 14 },
  { label: 'NumPy', cluster: 2, radius: 13 },
  { label: 'Pandas', cluster: 2, radius: 12 },
  // Backend cluster
  { label: 'FastAPI', cluster: 1, radius: 13 },
  { label: 'Flask', cluster: 1, radius: 12 },
  { label: 'Docker', cluster: 1, radius: 14 },
  { label: 'PostgreSQL', cluster: 1, radius: 13 },
  { label: 'AWS', cluster: 1, radius: 12 },
  { label: 'CI/CD', cluster: 1, radius: 11 },
  // Languages cluster
  { label: 'Python', cluster: 3, radius: 20 },
  { label: 'C++', cluster: 3, radius: 16 },
  { label: 'TypeScript', cluster: 3, radius: 15 },
  { label: 'Java', cluster: 3, radius: 13 },
  { label: 'SQL', cluster: 3, radius: 12 },
]

// Connections that make semantic sense
const EDGE_PAIRS: [string, string][] = [
  ['PyTorch', 'Python'],
  ['TensorFlow', 'Python'],
  ['PyTorch', 'Linear Algebra'],
  ['PyTorch', 'NumPy'],
  ['Linear Algebra', 'NumPy'],
  ['Calculus I-III', 'Linear Algebra'],
  ['Statistics', 'Linear Algebra'],
  ['Statistics', 'Pandas'],
  ['NumPy', 'Pandas'],
  ['FastAPI', 'Python'],
  ['Flask', 'Python'],
  ['PostgreSQL', 'SQL'],
  ['Docker', 'AWS'],
  ['Docker', 'CI/CD'],
  ['FastAPI', 'Docker'],
  ['scikit-learn', 'NumPy'],
  ['scikit-learn', 'Python'],
  ['LlamaIndex', 'Python'],
  ['LlamaIndex', 'FastAPI'],
  ['PyTorch Lightning', 'PyTorch'],
  ['C++', 'Linear Algebra'],
  ['TypeScript', 'Python'],
]

const CLUSTER_COLORS = [
  { fill: '6, 182, 212', label: 'ML & AI' },       // cyan
  { fill: '99, 102, 241', label: 'Backend' },        // indigo
  { fill: '168, 85, 247', label: 'Mathematics' },    // purple
  { fill: '34, 197, 94', label: 'Languages' },       // green
]

const CLUSTER_CENTERS = [
  { x: 0.28, y: 0.35 },
  { x: 0.72, y: 0.65 },
  { x: 0.28, y: 0.65 },
  { x: 0.72, y: 0.35 },
]

export default function LatentSynthesis() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)

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

    // Build nodes
    const nodes: SkillNode[] = SKILLS.map((s, i) => {
      const cc = CLUSTER_CENTERS[s.cluster]
      return {
        id: s.label,
        label: s.label,
        cluster: s.cluster,
        x: cc.x * canvas.width + (Math.random() - 0.5) * 120,
        y: cc.y * canvas.height + (Math.random() - 0.5) * 120,
        vx: 0,
        vy: 0,
        radius: s.radius,
        activation: Math.random(),
        hovered: false,
        connections: [],
      }
    })

    // Build edge list
    const edges: [number, number][] = []
    EDGE_PAIRS.forEach(([a, b]) => {
      const ai = nodes.findIndex(n => n.id === a)
      const bi = nodes.findIndex(n => n.id === b)
      if (ai >= 0 && bi >= 0) {
        edges.push([ai, bi])
        nodes[ai].connections.push(bi)
        nodes[bi].connections.push(ai)
      }
    })

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onMouseLeave = () => { mouseRef.current = null }
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    let t = 0
    let raf: number

    const animate = () => {
      t += 0.016
      const W = canvas.width
      const H = canvas.height
      const mouse = mouseRef.current

      ctx.fillStyle = 'rgba(8, 12, 30, 0.25)'
      ctx.fillRect(0, 0, W, H)

      // Update hover state
      nodes.forEach(n => {
        n.hovered = false
        if (mouse) {
          const dx = n.x - mouse.x
          const dy = n.y - mouse.y
          if (Math.sqrt(dx * dx + dy * dy) < n.radius + 8) n.hovered = true
        }
      })

      // Force-directed physics
      nodes.forEach((a, i) => {
        // Cluster attraction
        const cc = CLUSTER_CENTERS[a.cluster]
        const tcx = cc.x * W
        const tcy = cc.y * H
        a.vx += (tcx - a.x) * 0.003
        a.vy += (tcy - a.y) * 0.003

        // Node repulsion
        nodes.forEach((b, j) => {
          if (i === j) return
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < 1) return
          const d = Math.sqrt(d2)
          const minD = (a.radius + b.radius) * 3
          if (d < minD) {
            const force = (minD - d) / minD * 0.15
            a.vx += (dx / d) * force
            a.vy += (dy / d) * force
          }
        })

        // Edge spring
        a.connections.forEach(j => {
          const b = nodes[j]
          const dx = b.x - a.x
          const dy = b.y - a.y
          const d = Math.sqrt(dx * dx + dy * dy)
          const rest = 90
          if (d > 0) {
            const force = (d - rest) / rest * 0.04
            a.vx += dx / d * force
            a.vy += dy / d * force
          }
        })

        a.vx *= 0.88
        a.vy *= 0.88
        a.x += a.vx
        a.y += a.vy
        a.x = Math.max(a.radius + 5, Math.min(W - a.radius - 5, a.x))
        a.y = Math.max(a.radius + 5, Math.min(H - a.radius - 5, a.y))

        // Activation pulse
        a.activation = (Math.sin(t * 1.5 + i * 0.7) + 1) / 2
      })

      // Draw edges
      edges.forEach(([ai, bi]) => {
        const a = nodes[ai]
        const b = nodes[bi]
        const highlight = a.hovered || b.hovered
        const dx = b.x - a.x
        const dy = b.y - a.y
        const d = Math.sqrt(dx * dx + dy * dy)
        const maxD = 200

        if (d > maxD) return

        const alpha = highlight ? 0.6 : (1 - d / maxD) * 0.2
        const colorA = CLUSTER_COLORS[a.cluster].fill
        const colorB = CLUSTER_COLORS[b.cluster].fill

        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
        grad.addColorStop(0, `rgba(${colorA}, ${alpha})`)
        grad.addColorStop(1, `rgba(${colorB}, ${alpha})`)

        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = highlight ? 1.5 : 0.7
        ctx.stroke()

        // Animated particle along edge
        if (highlight) {
          const progress = (t * 0.5 + ai * 0.3) % 1
          const px = a.x + dx * progress
          const py = a.y + dy * progress
          ctx.beginPath()
          ctx.arc(px, py, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${colorA}, 0.9)`
          ctx.fill()
        }
      })

      // Draw nodes
      nodes.forEach((n, i) => {
        const col = CLUSTER_COLORS[n.cluster].fill
        const glowAlpha = n.hovered ? 0.5 : n.activation * 0.2
        const r = n.radius

        // Glow
        if (glowAlpha > 0.05) {
          const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 3)
          glow.addColorStop(0, `rgba(${col}, ${glowAlpha})`)
          glow.addColorStop(1, `rgba(${col}, 0)`)
          ctx.beginPath()
          ctx.arc(n.x, n.y, r * 3, 0, Math.PI * 2)
          ctx.fillStyle = glow
          ctx.fill()
        }

        // Core circle
        ctx.beginPath()
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = n.hovered
          ? `rgba(${col}, 0.5)`
          : `rgba(${col}, ${0.1 + n.activation * 0.15})`
        ctx.fill()
        ctx.strokeStyle = `rgba(${col}, ${n.hovered ? 0.9 : 0.4 + n.activation * 0.3})`
        ctx.lineWidth = n.hovered ? 2 : 1
        ctx.stroke()

        // Label
        const fontSize = n.hovered ? 11 : 9
        ctx.font = `${fontSize}px monospace`
        ctx.fillStyle = n.hovered
          ? `rgba(${col}, 1)`
          : `rgba(${col}, ${0.5 + n.activation * 0.4})`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(n.label, n.x, n.y)
      })

      // Cluster labels
      CLUSTER_CENTERS.forEach((cc, i) => {
        const col = CLUSTER_COLORS[i].fill
        ctx.font = '9px monospace'
        ctx.fillStyle = `rgba(${col}, 0.3)`
        ctx.textAlign = 'center'
        ctx.fillText(CLUSTER_COLORS[i].label.toUpperCase(), cc.x * W, cc.y * H - 60)
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
      style={{ height: 480, display: 'block', cursor: 'crosshair' }}
    />
  )
}
