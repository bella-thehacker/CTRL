import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import LetterWaveGrid from './LetterWaveGrid'

export default function ConfessionHero() {
  const [typedText, setTypedText] = useState('')
  const [typingStarted, setTypingStarted] = useState(false)
  const [scrollIndicatorVisible, setScrollIndicatorVisible] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const ctrlRef = useRef<HTMLDivElement>(null)
  const codeRef = useRef<HTMLDivElement>(null)
  const noteRef = useRef<HTMLDivElement>(null)
  const fullText = "i am a master of the machine, but i haven't lost my humanity."

  // Boot sequence animations
  useEffect(() => {
    // CTRL flickers in at 2.0s
    if (ctrlRef.current) {
      gsap.fromTo(
        ctrlRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.2,
          delay: 2.0,
          ease: 'steps(3)',
          onComplete: () => {
            gsap.to(ctrlRef.current, { opacity: 0.5, duration: 0.05 })
            gsap.to(ctrlRef.current, { opacity: 1, duration: 0.05, delay: 0.05 })
          },
        }
      )
    }

    // CODE fades in at 2.2s
    if (codeRef.current) {
      gsap.fromTo(
        codeRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.4, delay: 2.2, ease: 'power2.out' }
      )
    }

    // Typewriter starts at 2.6s
    const typeTimer = setTimeout(() => {
      setTypingStarted(true)
    }, 2600)

    // Sidebar note at 3.0s
    if (noteRef.current) {
      gsap.fromTo(
        noteRef.current,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, delay: 3.0, ease: 'power2.out' }
      )
    }

    // Scroll indicator at 3.5s
    const scrollTimer = setTimeout(() => {
      setScrollIndicatorVisible(true)
    }, 3500)

    return () => {
      clearTimeout(typeTimer)
      clearTimeout(scrollTimer)
    }
  }, [])

  // Typewriter effect
  useEffect(() => {
    if (!typingStarted) return
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 60)

    // Speed up typing if user scrolls
    const handleScroll = () => {
      if (index < fullText.length) {
        index = fullText.length
        setTypedText(fullText)
        clearInterval(interval)
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true, once: true })

    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [typingStarted])

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative w-full"
      style={{ height: '100vh', backgroundColor: 'var(--forest-deep)' }}
    >
      {/* Letter Wave Grid Background */}
      <LetterWaveGrid />

      {/* Content Overlay */}
      <div
        className="relative z-10 flex flex-col justify-end h-full pointer-events-none"
        style={{ padding: `0 var(--page-margin)`, paddingBottom: '15vh' }}
      >
        {/* CTRL title */}
        <div
          ref={ctrlRef}
          className="font-display opacity-0"
          style={{
            fontSize: 'clamp(80px, 15vw, 200px)',
            fontWeight: 700,
            color: '#e8dcc4',
            textTransform: 'uppercase',
            lineHeight: 0.85,
            letterSpacing: '-0.04em',
            textWrap: 'balance',
          }}
        >
          CTRL
        </div>

        {/* CODE title - serif italic */}
        <div
          ref={codeRef}
          className="font-serif italic opacity-0"
          style={{
            fontSize: 'clamp(80px, 15vw, 200px)',
            fontWeight: 400,
            color: '#e8dcc4',
            lineHeight: 0.85,
            letterSpacing: '-0.02em',
            marginLeft: '1em',
            textWrap: 'balance',
          }}
        >
          CODE
        </div>

        {/* Typewriter subtitle */}
        <div
          className="font-mono-ui mt-6"
          style={{
            fontSize: '12px',
            color: '#b8a88a',
            letterSpacing: '0.08em',
            minHeight: '20px',
          }}
        >
          {typedText}
          {typingStarted && typedText.length < fullText.length && (
            <span className="animate-cursor-blink">_</span>
          )}
          {typedText.length === fullText.length && (
            <span className="animate-cursor-blink">_</span>
          )}
        </div>
      </div>

      {/* Sidebar Note */}
      <div
        ref={noteRef}
        className="absolute z-10 font-script opacity-0 pointer-events-auto"
        style={{
          right: 'var(--page-margin)',
          top: '25vh',
          fontSize: 'clamp(18px, 2vw, 28px)',
          color: '#e8dcc4',
          transform: 'rotate(-3deg)',
          transition: 'transform 300ms ease-out',
          maxWidth: '220px',
          lineHeight: 1.3,
          cursor: 'default',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'rotate(0deg)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'rotate(-3deg)'
        }}
      >
        i hope they don't notice the bugs
      </div>

      {/* Scroll Indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 transition-opacity duration-500"
        style={{
          opacity: scrollIndicatorVisible ? 1 : 0,
        }}
      >
        <div
          className="animate-pulse-opacity"
          style={{
            width: '1px',
            height: '24px',
            backgroundColor: '#e8dcc4',
          }}
        />
        <span
          className="font-mono-ui"
          style={{ fontSize: '11px', color: '#b8a88a', letterSpacing: '0.08em' }}
        >
          scroll to enter
        </span>
      </div>
    </section>
  )
}
