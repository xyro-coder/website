'use client'

// Kinetic typography — characters scatter outward on scroll (de-rez),
// reform when scrolling back. Each character has a unique drift direction
// seeded from its index via the golden angle.
import { useScroll, useTransform, motion } from 'framer-motion'

// Interpolate between #06b6d4 (cyan) and #a855f7 (purple) for gradient chars
function gradColor(t: number): string {
  const r = Math.round(6   + (168 - 6)   * t)
  const g = Math.round(182 + (85  - 182) * t)
  const b = Math.round(212 + (247 - 212) * t)
  return `rgb(${r},${g},${b})`
}

// Each character is its own component so useTransform hooks are valid
function DeRezChar({
  char,
  idx,
  color,
  scrollY,
}: {
  char: string
  idx: number
  color: string
  scrollY: ReturnType<typeof useScroll>['scrollY']
}) {
  // Golden-angle-based drift so chars scatter in visually distinct directions
  const angle  = idx * 2.39996          // golden angle radians
  const dist   = 55 + (idx % 5) * 22   // variable distance
  const dx = Math.cos(angle) * dist
  const dy = Math.sin(angle) * dist - 20  // slight upward bias
  const rot = ((idx * 47) % 80) - 40

  const x       = useTransform(scrollY, [0, 550], [0, dx])
  const y       = useTransform(scrollY, [0, 550], [0, dy])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])
  const rotate  = useTransform(scrollY, [0, 550], [0, rot])
  const scale   = useTransform(scrollY, [0, 500], [1, 0.25])

  if (char === ' ') return <span style={{ display: 'inline-block', width: '0.28em' }} />

  return (
    <motion.span
      style={{ x, y, opacity, rotate, scale, display: 'inline-block', color }}
    >
      {char}
    </motion.span>
  )
}

export default function DeRezTitle() {
  const { scrollY } = useScroll()

  const sulaymanChars = 'Sulayman'.split('')
  const yusufChars    = 'Yusuf'.split('')

  return (
    <div
      className="font-bold leading-none mb-6"
      style={{ fontSize: 'clamp(4rem, 10vw, 7.5rem)', letterSpacing: '-0.035em' }}
    >
      {/* "Sulayman" — white */}
      <div>
        {sulaymanChars.map((char, i) => (
          <DeRezChar
            key={i}
            char={char}
            idx={i}
            color="white"
            scrollY={scrollY}
          />
        ))}
      </div>

      {/* "Yusuf" — cyan→purple gradient per character */}
      <div>
        {yusufChars.map((char, i) => (
          <DeRezChar
            key={i + 10}
            char={char}
            idx={i + 10}
            color={gradColor(i / (yusufChars.length - 1))}
            scrollY={scrollY}
          />
        ))}
      </div>
    </div>
  )
}
