'use client'

import { useEffect, useRef } from 'react'

export default function ParticleInitials() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 600
    canvas.height = 400

    // Define initials as particle positions
    const particles: { x: number; y: number; targetX: number; targetY: number; vx: number; vy: number }[] = []

    // Create "S" and "Y" with particles
    const createLetter = (letter: string, offsetX: number) => {
      ctx.font = 'bold 200px Arial'
      ctx.fillStyle = 'white'
      ctx.fillText(letter, offsetX, 250)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (let y = 0; y < canvas.height; y += 4) {
        for (let x = 0; x < canvas.width; x += 4) {
          const index = (y * canvas.width + x) * 4
          const alpha = data[index + 3]

          if (alpha > 128) {
            particles.push({
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              targetX: x,
              targetY: y,
              vx: 0,
              vy: 0,
            })
          }
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    createLetter('S', 50)
    createLetter('Y', 350)

    let animationFrame: number

    const animate = () => {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, i) => {
        // Spring physics
        const dx = particle.targetX - particle.x
        const dy = particle.targetY - particle.y
        const spring = 0.05
        const friction = 0.9

        particle.vx += dx * spring
        particle.vy += dy * spring
        particle.vx *= friction
        particle.vy *= friction

        particle.x += particle.vx
        particle.y += particle.vy

        // Interaction with mouse (if we track it)
        const dist = Math.sqrt(dx * dx + dy * dy)
        const hue = (dist * 2 + Date.now() * 0.05) % 360
        const saturation = 70
        const lightness = 50 + dist * 0.1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`
        ctx.fill()

        // Connect nearby particles
        if (i % 10 === 0) {
          for (let j = i + 1; j < Math.min(i + 5, particles.length); j++) {
            const other = particles[j]
            const distance = Math.sqrt(
              Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2)
            )

            if (distance < 50) {
              ctx.beginPath()
              ctx.moveTo(particle.x, particle.y)
              ctx.lineTo(other.x, other.y)
              ctx.strokeStyle = `rgba(6, 182, 212, ${(50 - distance) / 100})`
              ctx.lineWidth = 1
              ctx.stroke()
            }
          }
        }
      })

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
        style={{ maxHeight: '400px' }}
      />
    </div>
  )
}
