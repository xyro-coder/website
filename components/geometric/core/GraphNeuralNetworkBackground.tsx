'use client'

import { useEffect, useRef } from 'react'

export default function GraphNeuralNetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateSize()

    // Graph nodes - representing GNN message passing
    const nodes: {
      x: number
      y: number
      vx: number
      vy: number
      activation: number
      layer: number
    }[] = []

    // Create multi-layer GNN structure
    const layers = 4
    const nodesPerLayer = 12

    for (let layer = 0; layer < layers; layer++) {
      for (let i = 0; i < nodesPerLayer; i++) {
        nodes.push({
          x: (canvas.width / (layers + 1)) * (layer + 1),
          y: (canvas.height / (nodesPerLayer + 1)) * (i + 1),
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          activation: Math.random(),
          layer,
        })
      }
    }

    let animationFrame: number

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update nodes
      nodes.forEach((node, i) => {
        // Gentle drift
        node.x += node.vx
        node.y += node.vy

        // Boundary bounce
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Update activation (simulating message passing)
        const time = Date.now() * 0.001
        node.activation = (Math.sin(time + i * 0.5) + 1) / 2
      })

      // Draw edges (message passing)
      nodes.forEach((node, i) => {
        nodes.forEach((other, j) => {
          if (i >= j) return

          // Connect nodes in adjacent layers
          if (Math.abs(node.layer - other.layer) === 1) {
            const distance = Math.sqrt(
              Math.pow(node.x - other.x, 2) + Math.pow(node.y - other.y, 2)
            )

            if (distance < 300) {
              const opacity = (1 - distance / 300) * 0.3 * node.activation
              ctx.beginPath()
              ctx.moveTo(node.x, node.y)
              ctx.lineTo(other.x, other.y)
              ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`
              ctx.lineWidth = 1
              ctx.stroke()

              // Animated message particles
              if (Math.random() < 0.01) {
                const t = Math.random()
                const px = node.x + (other.x - node.x) * t
                const py = node.y + (other.y - node.y) * t

                ctx.beginPath()
                ctx.arc(px, py, 3, 0, Math.PI * 2)
                ctx.fillStyle = '#06b6d4'
                ctx.fill()
              }
            }
          }
        })
      })

      // Draw nodes
      nodes.forEach(node => {
        const size = 4 + node.activation * 8
        const color = node.activation > 0.5 ? '#06b6d4' : '#a855f7'

        // Outer glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, size * 2)
        gradient.addColorStop(0, color)
        gradient.addColorStop(1, 'transparent')

        ctx.beginPath()
        ctx.arc(node.x, node.y, size * 2, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        // Inner node
        ctx.beginPath()
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    window.addEventListener('resize', updateSize)

    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-30 z-0"
    />
  )
}
