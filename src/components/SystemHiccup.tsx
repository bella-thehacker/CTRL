import { useEffect, useRef, useState } from 'react'

export default function SystemHiccup() {
  const [hiccupActive, setHiccupActive] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (prefersReducedMotion) return

    const isMobile = window.innerWidth < 768
    const minInterval = isMobile ? 20000 : 10000
    const maxInterval = isMobile ? 30000 : 15000

    const scheduleHiccup = () => {
      const delay = minInterval + Math.random() * (maxInterval - minInterval)
      timerRef.current = setTimeout(() => {
        setHiccupActive(true)
        setTimeout(() => {
          setHiccupActive(false)
          scheduleHiccup()
        }, 150)
      }, delay)
    }

    // Initial delay before first hiccup
    const initialDelay = 5000 + Math.random() * 5000
    timerRef.current = setTimeout(scheduleHiccup, initialDelay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [prefersReducedMotion])

  if (prefersReducedMotion) return null

  return (
    <div
      className={hiccupActive ? 'hiccup-active' : ''}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 996,
        pointerEvents: 'none',
      }}
    />
  )
}
