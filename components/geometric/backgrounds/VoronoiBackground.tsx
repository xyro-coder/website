'use client'

import { useEffect, useRef } from 'react'

export default function VoronoiBackground() {
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

    // Voronoi seed points
    const seeds: { x: number; y: number; vx: number; vy: number; color: string }[] = []
    const seedCount = 25

    for (let i = 0; i < seedCount; i++) {
      seeds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        color: i % 2 === 0 ? '#06b6d4' : '#a855f7',
      })
    }

    let animationFrame: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update seed positions
      seeds.forEach(seed => {
        seed.x += seed.vx
        seed.y += seed.vy

        if (seed.x < 0 || seed.x > canvas.width) seed.vx *= -1
        if (seed.y < 0 || seed.y > canvas.height) seed.vy *= -1
      })

      // Draw Voronoi cells (simplified)
      const cellSize = 20
      for (let x = 0; x < canvas.width; x += cellSize) {
        for (let y = 0; y < canvas.height; y += cellSize) {
          let minDist = Infinity
          let closestSeed = seeds[0]

          seeds.forEach(seed => {
            const dist = Math.sqrt((x - seed.x) ** 2 + (y - seed.y) ** 2)
            if (dist < minDist) {
              minDist = dist
              closestSeed = seed
            }
          })

          const opacity = Math.max(0.05, 0.3 - minDist / 500)
          ctx.fillStyle = closestSeed.color + Math.floor(opacity * 255).toString(16).padStart(2, '0')
          ctx.fillRect(x, y, cellSize, cellSize)
        }
      }

      // Draw seed points
      seeds.forEach(seed => {
        ctx.beginPath()
        ctx.arc(seed.x, seed.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = seed.color
        ctx.fill()
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 opacity-20"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
