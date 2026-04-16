'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

const SCRAMBLE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*'

export function MotionReveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: 'spring', stiffness: 100, damping: 12, mass: 0.8, delay }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}

export function FloatingCard({
  children,
  className,
  style,
}: {
  children: ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const reduceMotion = useReducedMotion()
  if (reduceMotion) return <div className={className} style={style}>{children}</div>

  return (
    <motion.div
      className={className}
      whileHover={{ scale: 1.02, y: -8 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      style={{ willChange: 'transform', ...style }}
    >
      {children}
    </motion.div>
  )
}

export function MagneticButton({
  children,
  className,
  radius = 20,
  ...props
}: React.ComponentProps<typeof motion.button> & { radius?: number }) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLButtonElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const x = useSpring(mx, { stiffness: 280, damping: 20, mass: 0.8 })
  const y = useSpring(my, { stiffness: 280, damping: 20, mass: 0.8 })

  const onMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (reduceMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = event.clientX - (rect.left + rect.width / 2)
    const dy = event.clientY - (rect.top + rect.height / 2)
    if (Math.hypot(dx, dy) <= radius) {
      mx.set(dx * 0.35)
      my.set(dy * 0.35)
    } else {
      mx.set(0)
      my.set(0)
    }
  }

  const reset = () => {
    mx.set(0)
    my.set(0)
  }

  return (
    <motion.button
      ref={ref}
      className={className}
      style={reduceMotion ? undefined : { x, y, willChange: 'transform' }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export function TextScramble({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  const [value, setValue] = useState(text)
  const reduceMotion = useReducedMotion()

  const run = () => {
    if (reduceMotion) return
    let frame = 0
    const max = 10
    const timer = window.setInterval(() => {
      frame += 1
      setValue(
        text
          .split('')
          .map((char, index) => (index < frame / 2 ? char : SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)]))
          .join('')
      )
      if (frame >= max) {
        window.clearInterval(timer)
        setValue(text)
      }
    }, 24)
  }

  return (
    <span className={className} onMouseEnter={run}>
      {value}
    </span>
  )
}

export function CountUp({
  target,
  className,
}: {
  target: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!inView || !ref.current) return
    if (reduceMotion) {
      ref.current.textContent = String(target)
      return
    }

    let frame = 0
    const totalFrames = 120
    const start = 0
    const loop = () => {
      frame += 1
      const progress = frame / totalFrames
      const eased = 1 - (1 - progress) ** 3
      if (ref.current) {
        ref.current.textContent = String(Math.round(start + (target - start) * eased))
      }
      if (frame < totalFrames) requestAnimationFrame(loop)
    }
    requestAnimationFrame(loop)
  }, [inView, target, reduceMotion])

  return <span ref={ref} className={className}>0</span>
}
