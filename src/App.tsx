import { useEffect, useRef, lazy, Suspense } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navigation from './sections/Navigation'
import HeroSection from './sections/HeroSection'
import AboutSection from './sections/AboutSection'
import TimelineSection from './sections/TimelineSection'
import ProjectsSection from './sections/ProjectsSection'
import FooterSection from './sections/FooterSection'

gsap.registerPlugin(ScrollTrigger)

// Lazy load the heavy 3D terrain
const PixelTerrain = lazy(() => import('./components/PixelTerrain'))

function App() {
  const lenisRef = useRef<Lenis | null>(null)

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 1.5,
    })

    lenisRef.current = lenis

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      gsap.ticker.remove(lenis.raf as any)
    }
  }, [])

  return (
    <div className="relative min-h-screen bg-void-black">
      {/* 3D Terrain Canvas - fixed background layer */}
      <Suspense
        fallback={
          <div className="fixed inset-0 bg-void-black flex items-center justify-center z-0">
            <div className="font-mono text-[9px] tracking-[0.4em] text-cyan-boot/30 animate-pulse">
              LOADING ENGINE...
            </div>
          </div>
        }
      >
        <PixelTerrain />
      </Suspense>

      {/* Navigation */}
      <Navigation lenisRef={lenisRef as React.MutableRefObject<any>} />

      {/* Content overlay layer */}
      <div className="relative" style={{ zIndex: 2 }}>
        {/* Hero */}
        <HeroSection lenisRef={lenisRef as React.MutableRefObject<any>} />

        {/* About */}
        <AboutSection />

        {/* Timeline */}
        <TimelineSection />

        {/* Projects */}
        <ProjectsSection />

        {/* Footer */}
        <FooterSection />
      </div>

      {/* Grain texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />
    </div>
  )
}

export default App
