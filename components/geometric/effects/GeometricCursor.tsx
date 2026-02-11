'use client'

import { useEffect, useRef } from 'react'

export default function GeometricCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const trail = useRef<{ x: number; y: number; life: number }[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }

      // Add to trail
      trail.current.push({
        x: e.clientX,
        y: e.clientY,
        life: 1,
      })

      // Limit trail length
      if (trail.current.length > 20) {
        trail.current.shift()
      }
    }

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    let animationFrame: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw trail
      trail.current.forEach((point, i) => {
        point.life -= 0.02

        if (point.life > 0) {
          const size = point.life * 10
          const rotation = Date.now() * 0.001 + i * 0.5

          ctx.save()
          ctx.translate(point.x, point.y)
          ctx.rotate(rotation)

          // Draw hexagon
          ctx.beginPath()
          for (let j = 0; j < 6; j++) {
            const angle = (j / 6) * Math.PI * 2
            const x = Math.cos(angle) * size
            const y = Math.sin(angle) * size
            if (j === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          ctx.closePath()

          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size)
          gradient.addColorStop(0, `rgba(6, 182, 212, ${point.life * 0.6})`)
          gradient.addColorStop(1, `rgba(168, 85, 247, 0)`)

          ctx.strokeStyle = `rgba(6, 182, 212, ${point.life})`
          ctx.lineWidth = 2
          ctx.stroke()

          ctx.restore()
        }
      })

      // Remove dead particles
      trail.current = trail.current.filter(p => p.life > 0)

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
