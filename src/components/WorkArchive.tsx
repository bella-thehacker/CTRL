import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  index: string
  name: string
  description: string
  tags: string
}

const projects: Project[] = [
  {
    index: '(01)',
    name: 'RETRO CHESS',
    description: 'this one took three weeks and a lot of crying. it works, mostly.',
    tags: 'REACT / TYPESCRIPT / 2024',
  },
  {
    index: '(02)',
    name: 'WEATHER GHOST',
    description: "an app that predicts rain by how sad the sky looks. surprisingly accurate.",
    tags: 'REACT / API / 2024',
  },
  {
    index: '(03)',
    name: 'CTRL FM',
    description: 'a lo-fi radio player that only plays songs about being twenty-something.',
    tags: 'NEXT.JS / AUDIO / 2023',
  },
  {
    index: '(04)',
    name: 'GARDEN NOTES',
    description: 'a journaling app that grows virtual plants from your daily entries. grew too fast.',
    tags: 'REACT / NODE / 2023',
  },
  {
    index: '(05)',
    name: 'BROKEN CLOCKS',
    description: 'a time tracker for people who are always late but somehow still busy.',
    tags: 'TYPESCRIPT / 2023',
  },
  {
    index: '(06)',
    name: '20 SOMETHING',
    description: "a habit tracker that doesn't judge you for missing days.",
    tags: 'REACT / FIREBASE / 2022',
  },
]

export default function WorkArchive() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Title parallax
      if (titleRef.current) {
        gsap.to(titleRef.current, {
          y: -60,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.5,
          },
        })
      }

      // Row animations
      rowRefs.current.forEach((row) => {
        if (!row) return
        gsap.fromTo(
          row,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: row,
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
    <section
      ref={sectionRef}
      id="work"
      style={{
        paddingTop: 'var(--space-3xl)',
        paddingBottom: 'var(--space-2xl)',
        position: 'relative',
        zIndex: 10,
        backgroundColor: 'var(--forest-deep)',
      }}
    >
      <div style={{ padding: `0 var(--page-margin)` }}>
        {/* Section Title */}
        <h2
          ref={titleRef}
          className="font-display"
          style={{
            fontSize: 'clamp(48px, 8vw, 120px)',
            fontWeight: 700,
            color: '#e8dcc4',
            textTransform: 'uppercase',
            lineHeight: 0.9,
            letterSpacing: '-0.02em',
            textWrap: 'balance',
          }}
        >
          DIGITAL
          <br />
          ARTIFACTS
        </h2>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="font-serif italic mt-4"
          style={{
            fontSize: '18px',
            color: '#b8a88a',
            maxWidth: '500px',
          }}
        >
          things i built while figuring it all out. mostly at 2am.
        </p>
      </div>

      {/* Project List */}
      <div
        className="mt-16"
        style={{ padding: `0 var(--page-margin)` }}
      >
        <div style={{ maxWidth: 'var(--max-wide-width)', margin: '0 auto' }}>
          {projects.map((project, i) => (
            <div
              key={project.index}
              ref={(el) => { rowRefs.current[i] = el }}
              className="project-row opacity-0"
              style={{
                padding: 'var(--space-xl) 0',
                borderBottom: '1px solid rgba(232, 220, 196, 0.25)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Hover image placeholder */}
              <div
                className="project-hover-img absolute right-0 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-200 pointer-events-none hidden lg:block"
                style={{
                  width: '400px',
                  height: '300px',
                  backgroundColor: 'var(--forest-mid)',
                  filter: 'blur(2px) contrast(1.2)',
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start relative z-10">
                {/* Index */}
                <div className="md:col-span-1">
                  <span
                    className="font-mono-ui"
                    style={{ fontSize: '11px', color: 'rgba(232, 220, 196, 0.25)', letterSpacing: '0.08em' }}
                  >
                    {project.index}
                  </span>
                </div>

                {/* Project Name */}
                <div className="md:col-span-4">
                  <h3
                    className="project-name font-display transition-transform duration-200 ease-out"
                    style={{
                      fontSize: 'clamp(32px, 5vw, 72px)',
                      fontWeight: 700,
                      color: '#e8dcc4',
                      textTransform: 'uppercase',
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                      textWrap: 'balance',
                    }}
                  >
                    {project.name}
                  </h3>
                </div>

                {/* Description */}
                <div className="md:col-span-4">
                  <p
                    className="project-desc font-serif transition-colors duration-200"
                    style={{ fontSize: '16px', color: '#b8a88a', lineHeight: 1.5 }}
                  >
                    {project.description}
                  </p>
                  <span
                    className="project-click-hint font-mono-ui mt-2 block opacity-0 transition-opacity duration-200"
                    style={{ fontSize: '10px', color: '#ff4d00', letterSpacing: '0.08em' }}
                  >
                    click to explore &rarr;
                  </span>
                </div>

                {/* Tags */}
                <div className="md:col-span-3 md:text-right">
                  <span
                    className="font-mono-ui"
                    style={{ fontSize: '10px', color: 'rgba(232, 220, 196, 0.25)', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                  >
                    {project.tags}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
