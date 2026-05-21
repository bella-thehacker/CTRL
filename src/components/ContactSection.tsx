import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function ContactSection() {
  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const inputLineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Input line animation
      if (inputLineRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 70%',
          onEnter: () => {
            inputLineRef.current?.classList.add('visible')
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      // In a real app, this would submit the form
      setInputValue('')
      // Visual feedback - flash orange
      const el = e.currentTarget
      el.style.color = '#ff4d00'
      setTimeout(() => { el.style.color = '#e8dcc4' }, 300)
    }
  }

  const socialLinks = [
    { label: 'GITHUB', href: '#' },
    { label: 'TWITTER', href: '#' },
    { label: 'EMAIL', href: '#' },
  ]

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="opacity-0"
      style={{
        padding: 'var(--space-3xl) var(--page-margin)',
        position: 'relative',
        zIndex: 10,
        background: 'radial-gradient(ellipse at center, #152415 0%, #0d1a0d 100%)',
        textAlign: 'center',
      }}
    >
      {/* Section Label */}
      <div
        className="font-mono-ui"
        style={{ fontSize: '11px', color: '#ff4d00', letterSpacing: '0.08em', textTransform: 'uppercase' }}
      >
        TRANSMISSION
      </div>

      {/* Heading */}
      <h2
        className="font-display"
        style={{
          fontSize: 'clamp(48px, 7vw, 100px)',
          fontWeight: 700,
          color: '#e8dcc4',
          textTransform: 'uppercase',
          lineHeight: 0.9,
          letterSpacing: '-0.02em',
          marginTop: 'var(--space-lg)',
          textWrap: 'balance',
        }}
      >
        SEND A SIGNAL
      </h2>

      {/* Form */}
      <div
        className="mx-auto mt-12"
        style={{ maxWidth: '600px' }}
      >
        <div
          className="font-mono-ui mb-3"
          style={{ fontSize: '10px', color: '#b8a88a', letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          PRESS ENTER TO TRANSMIT
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Type something honest..."
          className="w-full bg-transparent font-serif italic text-center outline-none"
          style={{
            fontSize: '20px',
            color: '#e8dcc4',
            padding: '12px 0',
            border: 'none',
            borderBottom: `1px solid ${isFocused ? '#ff4d00' : 'rgba(232, 220, 196, 0.25)'}`,
            transition: 'border-color 200ms ease-out, box-shadow 200ms ease-out',
            boxShadow: isFocused ? '0 2px 20px rgba(255, 77, 0, 0.1)' : 'none',
          }}
        />

        {/* Animated underline (additional visual) */}
        <div
          ref={inputLineRef}
          className="contact-input-line"
          style={{
            height: '1px',
            backgroundColor: '#ff4d00',
            marginTop: '-1px',
            position: 'relative',
            zIndex: 2,
          }}
        />
      </div>

      {/* Social Links */}
      <div
        className="flex justify-center items-center gap-12 mt-24"
      >
        {socialLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="font-mono-ui glitch-hover"
            style={{
              fontSize: '12px',
              color: '#b8a88a',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'color 200ms ease-out',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ff4d00'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#b8a88a'
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Outro Quote */}
      <div style={{ marginTop: 'var(--space-3xl)' }}>
        <p
          className="font-serif italic"
          style={{ fontSize: '18px', color: '#b8a88a' }}
        >
          "God bless these 20-somethings."
        </p>
        <p
          className="font-mono-ui mt-4"
          style={{ fontSize: '10px', color: 'rgba(232, 220, 196, 0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
        >
          CTRL CODE SOLUTIONS &copy; 2024
        </p>
      </div>
    </section>
  )
}
