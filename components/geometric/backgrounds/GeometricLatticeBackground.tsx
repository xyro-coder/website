'use client'

import { useEffect, useRef } from 'react'

export default function GeometricLatticeBackground() {
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

    // Create triangular lattice grid
    const spacing = 80
    const points: { x: number; y: number; vx: number; vy: number }[] = []

    // Initialize lattice points
    for (let y = -spacing; y < canvas.height + spacing; y += spacing) {
      for (let x = -spacing; x < canvas.width + spacing; x += spacing * Math.sqrt(3)) {
        const offset = (Math.floor(y / spacing) % 2) * (spacing * Math.sqrt(3) / 2)
        points.push({
          x: x + offset,
          y: y,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
        })
      }
    }

    let animationFrame: number

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update points with gentle drift
      points.forEach(point => {
        point.x += point.vx
        point.y += point.vy

        // Keep points roughly in place
        if (Math.abs(point.vx) > 2) point.vx *= -0.8
        if (Math.abs(point.vy) > 2) point.vy *= -0.8
      })

      // Draw lattice edges
      points.forEach((point, i) => {
        points.forEach((other, j) => {
          if (i >= j) return

          const dx = point.x - other.x
          const dy = point.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < spacing * 1.5) {
            const opacity = (1 - distance / (spacing * 1.5)) * 0.2
            ctx.beginPath()
            ctx.moveTo(point.x, point.y)
            ctx.lineTo(other.x, other.y)

            // Alternate colors based on position
            const hue = ((point.x + point.y) * 0.1) % 60
            const color = hue < 30 ? '6, 182, 212' : '168, 85, 247'
            ctx.strokeStyle = `rgba(${color}, ${opacity})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      // Draw nodes
      points.forEach(point => {
        const pulse = Math.sin(Date.now() * 0.001 + point.x * 0.01 + point.y * 0.01) * 0.5 + 0.5
        const size = 2 + pulse * 2

        ctx.beginPath()
        ctx.arc(point.x, point.y, size, 0, Math.PI * 2)

        const hue = ((point.x + point.y) * 0.1) % 60
        const color = hue < 30 ? '#06b6d4' : '#a855f7'
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
      className="fixed inset-0 pointer-events-none opacity-20 z-0"
    />
  )
}
