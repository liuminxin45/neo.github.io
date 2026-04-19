import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const joystickHeroSrc = `${import.meta.env.BASE_URL}images/joystick-hero.jpg`

interface Project {
  title: string
  description: string
  tags: string[]
  span: string
  image?: string
}

const projects: Project[] = [
  {
    title: 'NEBULA RENDER',
    description: '基于 WebGL 的实时星云粒子渲染引擎，支持百万级粒子交互',
    tags: ['WebGL', 'GLSL', 'TypeScript'],
    span: 'col-span-2 row-span-2',
  },
  {
    title: 'VOXEL EDITOR',
    description: '浏览器端 3D 体素建模工具',
    tags: ['Three.js', 'React'],
    span: 'col-span-1 row-span-1',
  },
  {
    title: 'SIGNAL FLOW',
    description: '可视化音频信号处理管线',
    tags: ['Web Audio', 'Canvas'],
    span: 'col-span-1 row-span-1',
  },
  {
    title: 'DATA SCULPTURE',
    description: '将数据集转化为 3D 雕塑艺术的生成式工具',
    tags: ['D3.js', 'Three.js', 'Python'],
    span: 'col-span-1 row-span-2',
  },
  {
    title: 'TERMINAL UX',
    description: '为开发者工具打造的现代化终端界面系统',
    tags: ['Rust', 'Tauri', 'React'],
    span: 'col-span-1 row-span-1',
  },
]

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, card)

    return () => ctx.revert()
  }, [])

  // SVG geometric animation pattern (slow-moving)
  const svgPatterns = [
    <svg key="p1" className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="60" fill="none" stroke="#48DBFB" strokeWidth="0.5">
        <animate attributeName="r" values="60;70;60" dur="8s" repeatCount="indefinite" />
      </circle>
      <circle cx="100" cy="100" r="40" fill="none" stroke="#48DBFB" strokeWidth="0.5">
        <animate attributeName="r" values="40;50;40" dur="6s" repeatCount="indefinite" />
      </circle>
      <rect x="70" y="70" width="60" height="60" fill="none" stroke="#BDC3C7" strokeWidth="0.3" transform="rotate(45 100 100)">
        <animateTransform attributeName="transform" type="rotate" values="45 100 100; 90 100 100; 45 100 100" dur="12s" repeatCount="indefinite" />
      </rect>
    </svg>,
    <svg key="p2" className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 200 200">
      <polygon points="100,20 180,180 20,180" fill="none" stroke="#48DBFB" strokeWidth="0.5">
        <animateTransform attributeName="transform" type="rotate" values="0 100 100; 120 100 100; 0 100 100" dur="15s" repeatCount="indefinite" />
      </polygon>
      <polygon points="100,50 150,150 50,150" fill="none" stroke="#BDC3C7" strokeWidth="0.3">
        <animateTransform attributeName="transform" type="rotate" values="0 100 100; -90 100 100; 0 100 100" dur="10s" repeatCount="indefinite" />
      </polygon>
    </svg>,
    <svg key="p3" className="absolute inset-0 w-full h-full opacity-[0.06]" viewBox="0 0 200 200">
      {[0, 1, 2, 3].map(i => (
        <line key={i} x1="20" y1={50 + i * 40} x2="180" y2={50 + i * 40} stroke="#48DBFB" strokeWidth="0.3">
          <animate attributeName="x2" values="180;160;180" dur={`${5 + i}s`} repeatCount="indefinite" />
        </line>
      ))}
    </svg>,
  ]

  return (
    <div
      ref={cardRef}
      className={`relative ${project.span} min-h-[200px] md:min-h-[240px]`}
    >
      <div className="group relative w-full h-full glass-surface rounded-2xl p-6 md:p-8 overflow-hidden hover:border-cyan-boot/20 transition-all duration-500 cursor-pointer">
        {/* Background SVG animation */}
        {svgPatterns[index % svgPatterns.length]}

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-radial from-cyan-boot/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <h3 className="font-display font-bold text-lg md:text-xl text-highlight-silver mb-2 group-hover:text-cyan-boot transition-colors duration-300">
              {project.title}
            </h3>
            <p className="font-mono text-[10px] md:text-xs leading-relaxed text-lcd-ash/50 max-w-[280px]">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {project.tags.map(tag => (
              <span
                key={tag}
                className="font-mono text-[8px] px-2 py-0.5 rounded border border-cyan-boot/10 text-cyan-boot/40 group-hover:border-cyan-boot/30 group-hover:text-cyan-boot/60 transition-all duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-cyan-boot/10 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  )
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const joystickRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const joystick = joystickRef.current
    if (!joystick) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        joystick,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: joystick,
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
      id="projects"
      ref={sectionRef}
      className="relative w-full py-32 md:py-40"
      style={{ zIndex: 3, background: '#050505' }}
    >
      {/* Section header */}
      <div className="section-padding mb-16">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-px bg-cyan-boot/40" />
          <span className="font-mono text-[9px] tracking-[0.4em] text-cyan-boot/60 uppercase">
            Portfolio
          </span>
        </div>
        <h2 className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-highlight-silver">
          实验<span className="text-cyan-boot">项目</span>
        </h2>
      </div>

      {/* Bento Grid */}
      <div className="section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 auto-rows-[200px]">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} index={index} />
          ))}
        </div>
      </div>

      {/* Joystick hero visual */}
      <div
        ref={joystickRef}
        className="section-padding mt-24"
      >
        <div className="relative w-full aspect-[21/9] rounded-3xl overflow-hidden">
          <img
            src={joystickHeroSrc}
            alt="Joystick"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-void-black via-void-black/40 to-transparent" />
          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
            <p className="font-display text-2xl md:text-4xl font-light text-highlight-silver">
              控制<span className="text-cyan-boot">未来</span>
            </p>
            <p className="font-mono text-[9px] tracking-[0.3em] text-lcd-ash/40 mt-2">
              EVERY PIXEL COUNTS
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
