'use client'

import { useEffect, useRef } from 'react'

interface Node {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  label: string
}

interface Edge {
  source: string
  target: string
}

export default function NetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 800
    canvas.height = 600

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Define network nodes (involvement & leadership)
    const nodeData = [
      { id: 'dean', label: "Dean's List", color: '#06b6d4', central: true },
      { id: 'colorstack', label: 'ColorStack', color: '#06b6d4', central: false },
      { id: 'nbse', label: 'NBSE', color: '#a855f7', central: false },
      { id: 'codepath', label: 'CodePath', color: '#06b6d4', central: false },
      { id: 'math', label: 'Math Club', color: '#a855f7', central: false },
      { id: 'physics', label: 'Physics Club', color: '#a855f7', central: false },
      { id: 'robotics', label: 'Robotics Club', color: '#f59e0b', central: false },
      { id: 'opensource', label: 'Open Source', color: '#f59e0b', central: false },
    ]

    const nodes: Node[] = nodeData.map((n, i) => {
      const angle = (i / nodeData.length) * Math.PI * 2
      const distance = n.central ? 0 : 150 + Math.random() * 50
      return {
        id: n.id,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        radius: n.central ? 40 : 30,
        color: n.color,
        label: n.label,
      }
    })

    // Define connections
    const edges: Edge[] = [
      { source: 'dean', target: 'colorstack' },
      { source: 'dean', target: 'nbse' },
      { source: 'dean', target: 'codepath' },
      { source: 'colorstack', target: 'nbse' },
      { source: 'colorstack', target: 'codepath' },
      { source: 'math', target: 'physics' },
      { source: 'math', target: 'robotics' },
      { source: 'physics', target: 'robotics' },
      { source: 'robotics', target: 'opensource' },
    ]

    let animationFrame: number

    const simulate = () => {
      // Apply forces
      nodes.forEach(node => {
        // Gravity toward center
        const dx = centerX - node.x
        const dy = centerY - node.y
        node.vx += dx * 0.0001
        node.vy += dy * 0.0001

        // Repulsion between nodes
        nodes.forEach(other => {
          if (other.id === node.id) return
          const dx = node.x - other.x
          const dy = node.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 200) {
            const force = (200 - distance) * 0.01
            node.vx += (dx / distance) * force
            node.vy += (dy / distance) * force
          }
        })

        // Attraction along edges
        edges.forEach(edge => {
          if (edge.source === node.id) {
            const target = nodes.find(n => n.id === edge.target)
            if (target) {
              const dx = target.x - node.x
              const dy = target.y - node.y
              node.vx += dx * 0.001
              node.vy += dy * 0.001
            }
          }
          if (edge.target === node.id) {
            const source = nodes.find(n => n.id === edge.source)
            if (source) {
              const dx = source.x - node.x
              const dy = source.y - node.y
              node.vx += dx * 0.001
              node.vy += dy * 0.001
            }
          }
        })

        // Friction
        node.vx *= 0.95
        node.vy *= 0.95

        // Update position
        node.x += node.vx
        node.y += node.vy
      })
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw edges
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.3)'
      ctx.lineWidth = 2
      edges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.source)
        const target = nodes.find(n => n.id === edge.target)
        if (source && target) {
          ctx.beginPath()
          ctx.moveTo(source.x, source.y)
          ctx.lineTo(target.x, target.y)
          ctx.stroke()
        }
      })

      // Draw nodes
      nodes.forEach(node => {
        // Outer glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.radius)
        gradient.addColorStop(0, node.color)
        gradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Inner circle
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()

        // Label
        ctx.fillStyle = 'white'
        ctx.font = '12px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(node.label, node.x, node.y + node.radius + 15)
      })
    }

    const animate = () => {
      simulate()
      draw()
      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationFrame)
  }, [])

  return (
    <div className="relative w-full flex justify-center">
      <canvas
        ref={canvasRef}
        className="max-w-full"
        style={{ maxHeight: '600px' }}
      />
    </div>
  )
}
