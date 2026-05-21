import SystemCheck from '../components/SystemCheck'
import ConfessionHero from '../components/ConfessionHero'
import WorkArchive from '../components/WorkArchive'
import ConfessionsSection from '../components/ConfessionsSection'
import ContactSection from '../components/ContactSection'
import GlobalOverlays from '../components/GlobalOverlays'
import SystemHiccup from '../components/SystemHiccup'
import { useLenis } from '../hooks/useLenis'

export default function Home() {
  useLenis()

  return (
    <div style={{ backgroundColor: 'var(--forest-deep)', minHeight: '100vh' }}>
      {/* Global atmospheric overlays */}
      <GlobalOverlays />
      <SystemHiccup />

      {/* Fixed header */}
      <SystemCheck />

      {/* Main content */}
      <main>
        <ConfessionHero />
        <WorkArchive />
        <ConfessionsSection />
        <ContactSection />
      </main>
    </div>
  )
}
