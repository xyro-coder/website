'use client'

import { useEffect, useRef } from 'react'

interface ImpactVisualizationProps {
  percentage: number
  label: string
  color?: string
}

export default function ImpactVisualization({
  percentage,
  label,
  color = '#06b6d4'
}: ImpactVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 200
    canvas.height = 200

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 60

    let animationFrame: number
    let currentPercentage = 0

    const animate = () => {
      // Ease to target percentage
      currentPercentage += (percentage - currentPercentage) * 0.05

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background circle
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(100, 116, 139, 0.2)'
      ctx.lineWidth = 8
      ctx.stroke()

      // Draw progress arc
      const startAngle = -Math.PI / 2
      const endAngle = startAngle + (currentPercentage / 100) * Math.PI * 2

      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, startAngle, endAngle)
      ctx.strokeStyle = color
      ctx.lineWidth = 8
      ctx.lineCap = 'round'
      ctx.stroke()

      // Draw geometric patterns
      const numPolygons = 8
      for (let i = 0; i < numPolygons; i++) {
        if (i / numPolygons > currentPercentage / 100) continue

        const angle = (i / numPolygons) * Math.PI * 2 - Math.PI / 2
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius

        const size = 6
        const rotation = Date.now() * 0.001 + i

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(rotation)

        // Draw hexagon
        ctx.beginPath()
        for (let j = 0; j < 6; j++) {
          const hexAngle = (j / 6) * Math.PI * 2
          const hx = Math.cos(hexAngle) * size
          const hy = Math.sin(hexAngle) * size
          if (j === 0) ctx.moveTo(hx, hy)
          else ctx.lineTo(hx, hy)
        }
        ctx.closePath()
        ctx.fillStyle = color
        ctx.fill()

        ctx.restore()
      }

      // Draw center text
      ctx.fillStyle = color
      ctx.font = 'bold 32px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`${Math.round(currentPercentage)}%`, centerX, centerY - 10)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '12px sans-serif'
      ctx.fillText(label, centerX, centerY + 15)

      if (Math.abs(percentage - currentPercentage) > 0.1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animate()

    return () => cancelAnimationFrame(animationFrame)
  }, [percentage, label, color])

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} />
    </div>
  )
}
