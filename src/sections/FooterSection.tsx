import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PixelButton from '../components/PixelButton'
import TiltWidgetBox from '../components/TiltWidgetBox'

gsap.registerPlugin(ScrollTrigger)

export default function FooterSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const buttons = buttonsRef.current
    const widget = widgetRef.current
    if (!buttons || !widget) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        buttons.children,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: buttons,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )

      gsap.fromTo(
        widget,
        { y: 60, opacity: 0, rotateZ: -5 },
        {
          y: 0,
          opacity: 1,
          rotateZ: 0,
          duration: 1,
          ease: 'back.out(1.5)',
          scrollTrigger: {
            trigger: widget,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef.current!)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full"
      style={{ zIndex: 3, background: '#050505' }}
    >
      {/* Pixel chessboard floor */}
      <div
        className="w-full h-[40vh] pixel-grid-bg relative overflow-hidden"
        style={{
          backgroundImage: `
            linear-gradient(45deg, #121212 25%, transparent 25%),
            linear-gradient(-45deg, #121212 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #121212 75%),
            linear-gradient(-45deg, transparent 75%, #121212 75%)
          `,
          backgroundSize: '32px 32px',
          backgroundPosition: '0 0, 0 16px, 16px -16px, -16px 0px',
        }}
      >
        {/* Fade from top */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-void-black to-transparent" />

        {/* Center buttons */}
        <div
          ref={buttonsRef}
          className="absolute inset-0 flex items-center justify-center gap-6 md:gap-10"
        >
          <PixelButton href="https://github.com" variant="primary" size="lg" glowOnHover>
            GITHUB
          </PixelButton>
          <PixelButton href="mailto:hello@example.com" variant="secondary" size="lg" glowOnHover>
            EMAIL
          </PixelButton>
          <PixelButton href="#" variant="outline" size="lg" glowOnHover>
            RESUME
          </PixelButton>
        </div>
      </div>

      {/* Bottom footer area */}
      <div className="section-padding py-12 relative">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Left - copyright and info */}
          <div className="space-y-2">
            <p className="font-mono text-[9px] tracking-[0.3em] text-lcd-ash/30">
              &copy; {new Date().getFullYear()} PIXEL GRAVITY FIELD
            </p>
            <p className="font-mono text-[9px] tracking-[0.2em] text-lcd-ash/20">
              BUILT WITH REACT + THREE.JS + TAILWIND
            </p>
          </div>

          {/* Center - back to top */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="font-mono text-[9px] tracking-[0.3em] text-lcd-ash/30 hover:text-cyan-boot/60 transition-colors duration-300"
          >
            {'[ ↑ BACK TO TOP ]'}
          </button>

          {/* Right - tilt widget box */}
          <div ref={widgetRef} className="hidden md:block">
            <TiltWidgetBox width="200px" className="py-4 px-5">
              <div className="font-mono text-center">
                <div className="text-[8px] tracking-[0.4em] text-cyan-boot/40 mb-1">
                  {'// STATUS'}
                </div>
                <div className="text-xs text-highlight-silver tracking-wider">
                  HELLO WORLD
                </div>
                <div className="text-[7px] text-lcd-ash/30 mt-1">
                  {'<System.Operational />'}
                </div>
              </div>
            </TiltWidgetBox>
          </div>
        </div>
      </div>
    </section>
  )
}
