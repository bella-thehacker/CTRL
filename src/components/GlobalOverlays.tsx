import { useEffect, useState } from 'react'

export default function GlobalOverlays() {
  const [isMobile, setIsMobile] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mq.addEventListener('change', handler)

    return () => {
      window.removeEventListener('resize', checkMobile)
      mq.removeEventListener('change', handler)
    }
  }, [])

  return (
    <>
      {/* Film Grain Overlay */}
      <div
        className="grain-overlay"
        style={{
          opacity: isMobile ? 0.06 : 0.12,
          animationPlayState: prefersReducedMotion ? 'paused' : 'running',
        }}
      />

      {/* Scanlines Overlay */}
      <div
        className="scanlines-overlay"
        style={{
          animationPlayState: prefersReducedMotion ? 'paused' : 'running',
        }}
      />

      {/* Vignette Overlay */}
      <div className="vignette-overlay" />
    </>
  )
}
