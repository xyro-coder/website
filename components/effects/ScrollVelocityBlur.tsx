'use client'

// Scroll-velocity motion smear — fast scrolling streaks the overlay canvas
// vertically, simulating motion blur / high-speed recording.
// Implementation: fixed canvas reads its own previous frame, then fills a
// semi-transparent black rect at opacity proportional to scroll velocity.
// This creates ghost trails that decay exponentially — zero Three.js needed.

import { useEffect, useRef } from 'react'

const MAX_VEL = 55    // scroll px/frame above which blur is at maximum
const MAX_ALPHA = 0.38  // maximum smear opacity (keeps readability)

export default function ScrollVelocityBlur() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      // Preserve existing pixel data on resize by reading back
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let lastScrollY = window.scrollY
    let velocity = 0    // px / frame (EMA smoothed)
    let raf: number

    const onScroll = () => {
      const raw = Math.abs(window.scrollY - lastScrollY)
      lastScrollY = window.scrollY
      velocity = velocity * 0.55 + raw * 0.45   // EMA smoothing
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const animate = () => {
      velocity *= 0.82   // decay when not scrolling

      if (velocity > 1.5) {
        const W = canvas.width
        const H = canvas.height
        const t = Math.min(1, velocity / MAX_VEL)

        // Clear first so streaks don't accumulate across frames
        ctx.clearRect(0, 0, W, H)

        // Vertical streak lines — simulate long-exposure scan lines
        const nLines = Math.round(t * 28)
        for (let i = 0; i < nLines; i++) {
          const x = Math.random() * W
          const yStart = Math.random() * H
          const len = 80 + Math.random() * 220 * t
          const alpha = t * 0.055 * Math.random()
          const col = Math.random() > 0.5 ? '6,182,212' : '168,85,247'

          const grad = ctx.createLinearGradient(x, yStart, x, yStart + len)
          grad.addColorStop(0, `rgba(${col},0)`)
          grad.addColorStop(0.45, `rgba(${col},${alpha})`)
          grad.addColorStop(1, `rgba(${col},0)`)

          ctx.beginPath()
          ctx.moveTo(x, yStart)
          ctx.lineTo(x, yStart + len)
          ctx.strokeStyle = grad
          ctx.lineWidth = 0.7
          ctx.stroke()
        }

        // Subtle dark veil during fast scroll (multiply: darkens geometry briefly)
        ctx.globalAlpha = t * 0.22
        ctx.fillStyle = 'rgba(0,0,0,1)'
        ctx.fillRect(0, 0, W, H)
        ctx.globalAlpha = 1
      } else {
        // Clear completely — transparent canvas + multiply blend = zero effect on page.
        // Filling with black here would accumulate and darken the page permanently.
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }

      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9997,
        pointerEvents: 'none',
        mixBlendMode: 'multiply',
      }}
    />
  )
}
