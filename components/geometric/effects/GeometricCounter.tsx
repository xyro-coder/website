'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

interface GeometricCounterProps {
  value: number
  label: string
  suffix?: string
  duration?: number
  color?: 'cyan' | 'purple'
}

export default function GeometricCounter({
  value,
  label,
  suffix = '',
  duration = 2000,
  color = 'cyan'
}: GeometricCounterProps) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 })
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!inView) return

    const start = Date.now()
    const end = start + duration

    const animate = () => {
      const now = Date.now()
      const progress = Math.min((now - start) / duration, 1)

      // Easing function
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * value))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    animate()
  }, [inView, value, duration])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 200
    canvas.height = 200

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const progress = count / value

    let animationFrame: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw geometric particles forming from bottom
      const particleCount = 50
      for (let i = 0; i < particleCount; i++) {
        if (i / particleCount > progress) continue

        const angle = (i / particleCount) * Math.PI * 2
        const distance = 60 + (i % 10) * 5
        const x = centerX + Math.cos(angle) * distance
        const y = centerY + Math.sin(angle) * distance

        const size = 3 + Math.sin(Date.now() * 0.003 + i) * 2

        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fillStyle = color === 'cyan' ? '#06b6d4' : '#a855f7'
        ctx.fill()
      }

      // Draw connecting lines
      ctx.strokeStyle = color === 'cyan' ? 'rgba(6, 182, 212, 0.3)' : 'rgba(168, 85, 247, 0.3)'
      ctx.lineWidth = 1

      for (let i = 0; i < particleCount * progress; i++) {
        const angle1 = (i / particleCount) * Math.PI * 2
        const angle2 = ((i + 1) / particleCount) * Math.PI * 2
        const dist = 60

        const x1 = centerX + Math.cos(angle1) * dist
        const y1 = centerY + Math.sin(angle1) * dist
        const x2 = centerX + Math.cos(angle2) * dist
        const y2 = centerY + Math.sin(angle2) * dist

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationFrame)
  }, [count, value, color])

  return (
    <div ref={ref} className="flex flex-col items-center">
      <div className="relative">
        <canvas ref={canvasRef} className="opacity-50" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-5xl font-bold ${color === 'cyan' ? 'text-cyan-accent' : 'text-purple-accent'}`}>
            {count}{suffix}
          </div>
          <div className="text-sm text-text-muted mt-2">{label}</div>
        </div>
      </div>
    </div>
  )
}
