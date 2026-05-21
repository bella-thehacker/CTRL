import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ConfessionBlock {
  heading: string
  body: string
  attribution?: string
  aside?: string
  align: 'left' | 'right'
  offset: string
  bodyItalic?: boolean
}

const blocks: ConfessionBlock[] = [
  {
    heading: 'ON CONTROL',
    body: "i've lacked control my whole life and i think i've craved it my whole life. but there's no such thing as control anyway. it's just a concept, a word, a fantasy.",
    attribution: '\u2014 SZA',
    align: 'left',
    offset: '0%',
    bodyItalic: true,
  },
  {
    heading: 'ON BUILDING',
    body: "i write code the way some people write in diaries \u2014 messy, honest, at 2am when the world is quiet enough to hear yourself think. every project is a confession. every bug is a lesson in letting go.",
    align: 'right',
    offset: '15%',
    bodyItalic: false,
  },
  {
    heading: 'ON PERFECTION',
    body: "this site has bugs. it glitches sometimes. the scanlines aren't decorative \u2014 they're honest. i'm not trying to sell you a polished product. i'm showing you a living thing that breathes and stutters and tries its best.",
    align: 'left',
    offset: '10%',
    bodyItalic: false,
    aside: 'perfection is a lie they tell you to keep you small',
  },
]

export default function ConfessionsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const dividerRef = useRef<HTMLDivElement>(null)
  const blockRefs = useRef<(HTMLDivElement | null)[]>([])
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Scanline divider trigger
      if (dividerRef.current) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top 80%',
          onEnter: () => {
            if (hasAnimated.current) return
            hasAnimated.current = true
            const div = dividerRef.current
            if (!div) return
            div.style.display = 'block'
            gsap.fromTo(
              div,
              { top: '0%' },
              {
                top: '100%',
                duration: 0.8,
                ease: 'power2.inOut',
                onComplete: () => {
                  div.style.display = 'none'
                },
              }
            )
          },
        })
      }

      // Block animations
      blockRefs.current.forEach((block) => {
        if (!block) return
        gsap.fromTo(
          block,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Scanline Divider */}
      <div
        ref={dividerRef}
        className="scanline-divider"
        style={{ display: 'none' }}
      />

      <section
        ref={sectionRef}
        id="about"
        style={{
          paddingTop: 'var(--space-3xl)',
          paddingBottom: 'var(--space-3xl)',
          position: 'relative',
          zIndex: 10,
          backgroundColor: 'var(--forest-deep)',
        }}
      >
        <div style={{ padding: `0 var(--page-margin)`, maxWidth: 'var(--max-wide-width)', margin: '0 auto' }}>
          {/* Section Label */}
          <div
            className="font-mono-ui mb-16"
            style={{ fontSize: '11px', color: '#ff4d00', letterSpacing: '0.08em', textTransform: 'uppercase' }}
          >
            SECTION: CONFESSIONS
          </div>

          {/* Confession Blocks */}
          <div className="space-y-24 md:space-y-32">
            {blocks.map((block, i) => (
              <div
                key={i}
                ref={(el) => { blockRefs.current[i] = el }}
                className="opacity-0"
                style={{
                  maxWidth: '560px',
                  marginLeft: block.align === 'left' ? block.offset : 'auto',
                  marginRight: block.align === 'right' ? block.offset : 'auto',
                }}
              >
                <h3
                  className="font-display"
                  style={{
                    fontSize: 'clamp(36px, 6vw, 48px)',
                    fontWeight: 700,
                    color: '#e8dcc4',
                    textTransform: 'uppercase',
                    lineHeight: 0.9,
                    letterSpacing: '-0.02em',
                    marginBottom: 'var(--space-lg)',
                  }}
                >
                  {block.heading}
                </h3>

                <p
                  className={block.bodyItalic ? 'font-serif italic' : 'font-serif'}
                  style={{ fontSize: '18px', color: '#e8dcc4', lineHeight: 1.6 }}
                >
                  {block.body}
                </p>

                {block.attribution && (
                  <p
                    className="font-mono-ui mt-4"
                    style={{ fontSize: '11px', color: '#b8a88a', letterSpacing: '0.08em' }}
                  >
                    {block.attribution}
                  </p>
                )}

                {block.aside && (
                  <div
                    className="font-script mt-6 inline-block"
                    style={{
                      fontSize: '22px',
                      color: '#ff4d00',
                      transform: 'rotate(2deg)',
                      lineHeight: 1.3,
                    }}
                  >
                    {block.aside}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
