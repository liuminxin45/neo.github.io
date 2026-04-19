import { useRef, useEffect, useState } from 'react'
import PixelButton from '../components/PixelButton'

interface HeroSectionProps {
  lenisRef: React.MutableRefObject<any>
}

export default function HeroSection({ lenisRef }: HeroSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const consoleRef = useRef<HTMLDivElement>(null)
  const [typedText, setTypedText] = useState('')
  const fullText = 'CREATIVE DEVELOPER'

  // 3D tilt effect for the console panel
  useEffect(() => {
    const console = consoleRef.current
    if (!console) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = console.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const mouseX = (e.clientX - centerX) / (window.innerWidth / 2)
      const mouseY = (e.clientY - centerY) / (window.innerHeight / 2)

      const rotX = mouseY * -8
      const rotY = mouseX * 8

      console.style.transform = `perspective(1200px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1, 1, 1)`
    }

    const handleMouseLeave = () => {
      console.style.transform = `perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    }

    window.addEventListener('mousemove', handleMouseMove)
    console.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      console.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  // Typewriter effect
  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setTypedText(fullText.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 80)
    return () => clearInterval(interval)
  }, [])

  const handleInitialize = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo('#about', { duration: 2 })
    }
  }

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{ zIndex: 2 }}
    >
      {/* Developer name - vertical left */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 hidden lg:block">
        <div
          className="font-display font-bold text-[10px] tracking-[0.5em] text-lcd-ash/20 uppercase"
          style={{
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
          }}
        >
          PIXEL GRAVITY FIELD
        </div>
      </div>

      {/* Floating geometric fragments */}
      <div className="absolute top-[15%] right-[12%] w-3 h-3 border border-cyan-boot/30 rotate-45 animate-float" />
      <div className="absolute bottom-[20%] right-[20%] w-2 h-2 bg-cyan-boot/20 rotate-12 animate-float" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[30%] right-[25%] w-4 h-4 border border-highlight-silver/10 rounded-sm animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-[35%] left-[10%] w-1.5 h-8 bg-gradient-to-b from-cyan-boot/20 to-transparent animate-float" style={{ animationDelay: '0.5s' }} />

      {/* Central console panel */}
      <div
        ref={consoleRef}
        className="relative z-10 flex flex-col items-center justify-center transition-transform duration-300 ease-out"
        style={{ willChange: 'transform' }}
      >
        {/* CRT scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)',
          }}
        />

        <div className="glass-surface rounded-3xl px-12 py-16 md:px-20 md:py-20 text-center relative">
          {/* Status indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-2 h-2 rounded-full bg-cyan-boot animate-pulse-glow" />
            <span className="font-mono text-[9px] tracking-[0.3em] text-cyan-boot/60 uppercase">
              System Online
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-display font-light text-4xl md:text-6xl lg:text-7xl text-highlight-silver tracking-tight mb-4">
            <span className="text-cyan-boot">{'<'}</span>
            Developer
            <span className="text-cyan-boot">{'/>'}</span>
          </h1>

          {/* Typewriter subtitle */}
          <p className="font-mono text-xs md:text-sm tracking-[0.4em] text-lcd-ash/60 mb-12 typing-cursor">
            {typedText}
          </p>

          {/* Initialize button */}
          <PixelButton onClick={handleInitialize} size="lg" glowOnHover>
            {'>_ INITIALIZE'}
          </PixelButton>
        </div>
      </div>

      {/* Bottom scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-mono text-[8px] tracking-[0.4em] text-lcd-ash/30 uppercase">
          Scroll to explore
        </span>
        <div className="w-px h-8 bg-gradient-to-b from-cyan-boot/40 to-transparent" />
      </div>
    </section>
  )
}
