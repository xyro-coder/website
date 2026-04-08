'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

// Damped-spring page transitions — no linear easing anywhere
const variants = {
  initial: { opacity: 0, y: 18, scale: 0.994 },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 24,
      opacity: { duration: 0.3 },  // opacity still timed (springs can't do it well)
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 1.006,
    transition: { duration: 0.22, ease: [0.4, 0, 1, 1] },
  },
}

export default function PageTransitionWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        variants={variants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="flex-grow pt-16"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
