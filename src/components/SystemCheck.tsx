import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function SystemCheck() {
  const [sysHealth, setSysHealth] = useState('STABLE')
  const [scrolled, setScrolled] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const navItems = ['WORK', 'ABOUT', 'CONTACT']

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > window.innerHeight)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Boot entry animation
  useEffect(() => {
    if (!headerRef.current) return
    gsap.fromTo(
      headerRef.current,
      { y: '-100%', opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', delay: 3.2 }
    )
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-[100] opacity-0"
      style={{
        height: '48px',
        backgroundColor: scrolled ? 'rgba(13, 26, 13, 0.95)' : 'rgba(13, 26, 13, 0.85)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(232, 220, 196, 0.25)',
        transition: 'background-color 300ms ease-out',
      }}
    >
      <div
        className="flex items-center justify-between h-full"
        style={{ padding: '0 var(--page-margin)' }}
      >
        {/* Left: Status indicators */}
        <div className="hidden md:flex items-center gap-4">
          <span
            className="font-mono-ui cursor-default"
            style={{ fontSize: '11px', letterSpacing: '0.08em', color: sysHealth === 'SCARED' ? '#ff4d00' : '#e8dcc4' }}
            onMouseEnter={() => setSysHealth('SCARED')}
            onMouseLeave={() => setSysHealth('STABLE')}
          >
            SYS.HEALTH: {sysHealth}
          </span>
          <span
            className="font-mono-ui"
            style={{ fontSize: '11px', letterSpacing: '0.08em', color: '#e8dcc4' }}
          >
            CTRL_LEVEL: 0.3
          </span>
          <span
            className="font-mono-ui"
            style={{ fontSize: '11px', letterSpacing: '0.08em', color: '#ff4d00' }}
          >
            VULNERABILITY: HIGH
          </span>
          <span
            className="font-mono-ui hidden lg:inline"
            style={{ fontSize: '11px', letterSpacing: '0.08em', color: '#b8a88a' }}
          >
            BOOT_TIME: 3.2s
          </span>
        </div>

        {/* Mobile: just the site name */}
        <div className="md:hidden font-mono-ui" style={{ fontSize: '11px', letterSpacing: '0.08em', color: '#e8dcc4' }}>
          CTRL_CODE
        </div>

        {/* Right: Navigation */}
        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className="font-mono-ui glitch-hover"
              style={{
                fontSize: '12px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#e8dcc4',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
