import { useEffect, useState, useRef } from 'react'

interface NavigationProps {
  lenisRef: React.MutableRefObject<any>
}

export default function Navigation({ lenisRef }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const navRef = useRef<HTMLElement>(null)

  const navItems = [
    { id: 'hero', label: 'HOME' },
    { id: 'about', label: 'WHOAMI' },
    { id: 'timeline', label: 'TIMELINE' },
    { id: 'projects', label: 'PROJECTS' },
    { id: 'contact', label: 'CONTACT' },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Track active section
  useEffect(() => {
    const sections = navItems.map(item => document.getElementById(item.id))
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight * 0.3
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(navItems[i].id)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id: string) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(`#${id}`, { duration: 2 })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-void-black/60 backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <div className="section-padding flex items-center justify-between h-14">
        <div className="font-display font-bold text-xs tracking-[0.3em] text-highlight-silver">
          PIXEL FIELD
        </div>
        <div className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className={`font-mono text-[10px] tracking-[0.2em] uppercase transition-all duration-300 ${
                activeSection === item.id
                  ? 'text-cyan-boot'
                  : 'text-lcd-ash/50 hover:text-lcd-ash'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
