'use client'

// Force-directed skill graph with draggable nodes.
// Dragging one node applies stronger spring tension to all its semantic
// neighbors — the "equivariant cluster" reacts as a unit.
import { useEffect, useRef } from 'react'

interface SkillNode {
  id: string
  label: string
  cluster: number // 0=ML, 1=Backend, 2=Math, 3=Languages
  x: number; y: number
  vx: number; vy: number
  radius: number
  activation: number
  hovered: boolean
  dragged: boolean
  connections: number[]
}

const SKILLS: { label: string; cluster: number; radius: number }[] = [
  { label: 'PyTorch',          cluster: 0, radius: 18 },
  { label: 'PyTorch Lightning',cluster: 0, radius: 14 },
  { label: 'scikit-learn',     cluster: 0, radius: 13 },
  { label: 'NumPy',            cluster: 0, radius: 13 },
  { label: 'Pandas',           cluster: 0, radius: 12 },
  { label: 'LlamaIndex',       cluster: 0, radius: 11 },
  { label: 'Linear Algebra',   cluster: 2, radius: 17 },
  { label: 'Real Analysis',    cluster: 2, radius: 14 },
  { label: 'Statistics',       cluster: 2, radius: 14 },
  { label: 'Discrete Math',    cluster: 2, radius: 12 },
  { label: 'FastAPI',          cluster: 1, radius: 13 },
  { label: 'Flask',            cluster: 1, radius: 12 },
  { label: 'Docker',           cluster: 1, radius: 14 },
  { label: 'PostgreSQL',       cluster: 1, radius: 13 },
  { label: 'AWS',              cluster: 1, radius: 12 },
  { label: 'PyTest',           cluster: 1, radius: 11 },
  { label: 'GitHub Actions',   cluster: 1, radius: 11 },
  { label: 'Python',           cluster: 3, radius: 20 },
  { label: 'C++',              cluster: 3, radius: 16 },
  { label: 'TypeScript',       cluster: 3, radius: 15 },
  { label: 'JavaScript',       cluster: 3, radius: 13 },
  { label: 'Java',             cluster: 3, radius: 13 },
  { label: 'SQL',              cluster: 3, radius: 12 },
]

const EDGE_PAIRS: [string, string][] = [
  ['PyTorch', 'Python'], ['PyTorch', 'Linear Algebra'], ['PyTorch', 'NumPy'],
  ['Linear Algebra', 'NumPy'], ['Real Analysis', 'Linear Algebra'],
  ['Statistics', 'Linear Algebra'], ['Statistics', 'Pandas'],
  ['Discrete Math', 'Linear Algebra'], ['NumPy', 'Pandas'],
  ['FastAPI', 'Python'], ['Flask', 'Python'], ['PostgreSQL', 'SQL'],
  ['Docker', 'AWS'], ['GitHub Actions', 'Docker'], ['PyTest', 'Python'],
  ['FastAPI', 'Docker'], ['scikit-learn', 'NumPy'], ['scikit-learn', 'Python'],
  ['LlamaIndex', 'Python'], ['LlamaIndex', 'FastAPI'],
  ['PyTorch Lightning', 'PyTorch'], ['C++', 'Linear Algebra'],
  ['TypeScript', 'Python'],
]

const CLUSTER_COLORS = [
  { fill: '6, 182, 212',   label: 'ML & AI' },
  { fill: '99, 102, 241',  label: 'Backend' },
  { fill: '168, 85, 247',  label: 'Mathematics' },
  { fill: '34, 197, 94',   label: 'Languages' },
]

const CLUSTER_CENTERS = [
  { x: 0.28, y: 0.35 },
  { x: 0.72, y: 0.65 },
  { x: 0.28, y: 0.65 },
  { x: 0.72, y: 0.35 },
]

export default function LatentSynthesis() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      // Re-init cluster positions on resize
      nodes.forEach(n => {
        const cc = CLUSTER_CENTERS[n.cluster]
        n.x = cc.x * canvas.width + (Math.random() - 0.5) * 100
        n.y = cc.y * canvas.height + (Math.random() - 0.5) * 100
      })
    }

    // Build nodes
    const nodes: SkillNode[] = SKILLS.map((s) => {
      const cc = CLUSTER_CENTERS[s.cluster]
      return {
        id: s.label, label: s.label, cluster: s.cluster,
        x: cc.x * 800 + (Math.random() - 0.5) * 120,
        y: cc.y * 500 + (Math.random() - 0.5) * 120,
        vx: 0, vy: 0,
        radius: s.radius,
        activation: Math.random(),
        hovered: false, dragged: false,
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

    resize()
    window.addEventListener('resize', resize)

    // ── Drag state ──────────────────────────────────────────────────────────
    let draggedIdx: number | null = null
    let mouseX = 0
    let mouseY = 0
    let hoveredIdx = -1

    const getNodeAt = (mx: number, my: number): number => {
      let best = -1
      let bestD = Infinity
      nodes.forEach((n, i) => {
        const dx = n.x - mx; const dy = n.y - my
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d < n.radius + 10 && d < bestD) { bestD = d; best = i }
      })
      return best
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
      if (draggedIdx !== null) {
        nodes[draggedIdx].x = mouseX
        nodes[draggedIdx].y = mouseY
        nodes[draggedIdx].vx = 0
        nodes[draggedIdx].vy = 0
        canvas.style.cursor = 'grabbing'
      } else {
        hoveredIdx = getNodeAt(mouseX, mouseY)
        canvas.style.cursor = hoveredIdx >= 0 ? 'grab' : 'crosshair'
      }
    }

    const onMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
      const hit = getNodeAt(mouseX, mouseY)
      if (hit >= 0) {
        draggedIdx = hit
        nodes[hit].dragged = true
        canvas.style.cursor = 'grabbing'
        e.preventDefault()
      }
    }

    const releaseDrag = () => {
      if (draggedIdx !== null) {
        nodes[draggedIdx].dragged = false
        draggedIdx = null
      }
      canvas.style.cursor = 'crosshair'
    }

    const onMouseLeave = () => {
      releaseDrag()
      hoveredIdx = -1
    }

    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('mouseup', releaseDrag)
    canvas.addEventListener('mouseleave', onMouseLeave)

    // ── Animation ────────────────────────────────────────────────────────────
    let t = 0
    let raf: number

    const animate = () => {
      t += 0.016
      const W = canvas.width
      const H = canvas.height

      ctx.fillStyle = 'rgba(8, 12, 30, 0.28)'
      ctx.fillRect(0, 0, W, H)

      // Determine hover / drag states
      nodes.forEach((n, i) => {
        n.hovered = i === hoveredIdx && draggedIdx === null
        n.dragged = i === draggedIdx
      })

      // ── Force-directed physics ──
      nodes.forEach((a, i) => {
        if (a.dragged) return   // skip physics for dragged node

        // Cluster attraction
        const cc = CLUSTER_CENTERS[a.cluster]
        const tcx = cc.x * W; const tcy = cc.y * H
        a.vx += (tcx - a.x) * 0.003
        a.vy += (tcy - a.y) * 0.003

        // Node–node repulsion
        nodes.forEach((b, j) => {
          if (i === j) return
          const dx = a.x - b.x; const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < 1) return
          const d = Math.sqrt(d2)
          const minD = (a.radius + b.radius) * 3.2
          if (d < minD) {
            const f = (minD - d) / minD * 0.16
            a.vx += (dx / d) * f; a.vy += (dy / d) * f
          }
        })

        // Semantic edge springs
        a.connections.forEach(j => {
          const b = nodes[j]
          const dx = b.x - a.x; const dy = b.y - a.y
          const d = Math.sqrt(dx * dx + dy * dy)
          const rest = 90
          // If the connected node is being dragged, triple the spring strength
          const springK = b.dragged ? 0.14 : 0.04
          if (d > 0) {
            const f = (d - rest) / rest * springK
            a.vx += (dx / d) * f; a.vy += (dy / d) * f
          }
        })

        a.vx *= 0.87; a.vy *= 0.87
        a.x += a.vx; a.y += a.vy
        a.x = Math.max(a.radius + 5, Math.min(W - a.radius - 5, a.x))
        a.y = Math.max(a.radius + 5, Math.min(H - a.radius - 5, a.y))

        a.activation = (Math.sin(t * 1.5 + SKILLS.findIndex(s => s.label === a.id) * 0.7) + 1) / 2
      })

      // ── Draw edges ──
      edges.forEach(([ai, bi]) => {
        const a = nodes[ai]; const b = nodes[bi]
        const highlight = a.hovered || b.hovered || a.dragged || b.dragged
        const dx = b.x - a.x; const dy = b.y - a.y
        const d = Math.sqrt(dx * dx + dy * dy)
        const maxD = 220
        if (d > maxD) return

        const alpha = highlight ? 0.65 : (1 - d / maxD) * 0.22
        const cA = CLUSTER_COLORS[a.cluster].fill
        const cB = CLUSTER_COLORS[b.cluster].fill

        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y)
        grad.addColorStop(0, `rgba(${cA}, ${alpha})`)
        grad.addColorStop(1, `rgba(${cB}, ${alpha})`)
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = grad
        ctx.lineWidth = highlight ? 1.8 : 0.7
        ctx.stroke()

        // Animated flow particle on highlighted edge
        if (highlight) {
          const prog = ((t * 0.6 + ai * 0.3) % 1)
          const px = a.x + dx * prog; const py = a.y + dy * prog
          ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${cA}, 0.95)`
          ctx.fill()
        }
      })

      // ── Draw nodes ──
      nodes.forEach((n) => {
        const col = CLUSTER_COLORS[n.cluster].fill
        const isActive = n.hovered || n.dragged
        const glowAlpha = isActive ? 0.55 : n.activation * 0.18
        const r = n.radius

        // Glow halo
        if (glowAlpha > 0.05) {
          const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * (isActive ? 4 : 3))
          glow.addColorStop(0, `rgba(${col}, ${glowAlpha})`)
          glow.addColorStop(1, `rgba(${col}, 0)`)
          ctx.beginPath(); ctx.arc(n.x, n.y, r * (isActive ? 4 : 3), 0, Math.PI * 2)
          ctx.fillStyle = glow; ctx.fill()
        }

        // Drag ring (extra outer ring while dragging)
        if (n.dragged) {
          ctx.beginPath(); ctx.arc(n.x, n.y, r * 1.8, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(${col}, 0.45)`
          ctx.lineWidth = 1.5; ctx.stroke()
        }

        // Core fill
        ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2)
        ctx.fillStyle = isActive
          ? `rgba(${col}, 0.55)`
          : `rgba(${col}, ${0.1 + n.activation * 0.15})`
        ctx.fill()
        ctx.strokeStyle = `rgba(${col}, ${isActive ? 0.95 : 0.4 + n.activation * 0.3})`
        ctx.lineWidth = isActive ? 2.5 : 1
        ctx.stroke()

        // Label
        ctx.font = `${isActive ? 11 : 9}px monospace`
        ctx.fillStyle = isActive
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
        ctx.textBaseline = 'alphabetic'
        ctx.fillText(CLUSTER_COLORS[i].label.toUpperCase(), cc.x * W, cc.y * H - 65)
      })

      // Caption
      ctx.font = '8px monospace'
      ctx.fillStyle = 'rgba(100,120,150,0.45)'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'alphabetic'
      ctx.fillText(
        draggedIdx !== null
          ? `DRAGGING: ${nodes[draggedIdx].label}  ·  cluster reacting via equivariant spring force`
          : 'FORCE-DIRECTED GRAPH  ·  drag any node — its cluster follows via semantic edge springs',
        16, H - 14
      )

      raf = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mousedown', onMouseDown)
      canvas.removeEventListener('mouseup', releaseDrag)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="w-full canvas-void"
      style={{ height: 480, display: 'block', cursor: 'crosshair' }}
    />
  )
}
