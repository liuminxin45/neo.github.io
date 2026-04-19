import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const timelineBackgroundSrc = `${import.meta.env.BASE_URL}images/timeline-bg.jpg`

interface TimelineNode {
  year: string
  title: string
  company: string
  description: string
  tags: string[]
  side: 'left' | 'right'
}

const timelineData: TimelineNode[] = [
  {
    year: '2024 — PRESENT',
    title: 'SENIOR CREATIVE DEVELOPER',
    company: '独立工作室 · Pixel Forge',
    description:
      '创立个人创意开发工作室，专注于高保真交互体验与 WebGL 项目。为多个国际品牌打造沉浸式数字产品，同时持续开源创意编程工具链。',
    tags: ['WebGL', 'Three.js', 'Creative Coding'],
    side: 'left',
  },
  {
    year: '2022 — 2024',
    title: 'TECH LEAD · FRONTEND',
    company: '前沿科技 · Nexus Labs',
    description:
      '带领 8 人前端团队负责核心产品架构。主导微前端架构迁移，将首屏加载时间减少 60%。构建内部设计系统，统一跨产品线视觉语言。',
    tags: ['React', 'System Design', 'Team Lead'],
    side: 'right',
  },
  {
    year: '2020 — 2022',
    title: 'FULL STACK ENGINEER',
    company: '数字创意 · Arcane Digital',
    description:
      '全栈开发角色，负责从数据库设计到前端交互的完整链路。开发多个高流量营销页面，实现复杂的动画与数据可视化需求。',
    tags: ['Next.js', 'PostgreSQL', 'Animation'],
    side: 'left',
  },
  {
    year: '2019 — 2020',
    title: 'JUNIOR DEVELOPER',
    company: '初创企业 · ByteCraft',
    description:
      '作为早期成员参与产品从 0 到 1 的构建。负责前端界面开发与移动端适配，积累了丰富的快速迭代经验。',
    tags: ['JavaScript', 'Vue.js', 'Mobile'],
    side: 'right',
  },
]

function TimelineCard({ node }: { node: TimelineNode }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        {
          y: 50,
          opacity: 0,
          rotateX: node.side === 'left' ? 15 : -15,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, card)

    return () => ctx.revert()
  }, [node.side])

  return (
    <div
      ref={cardRef}
      className={`relative w-full md:w-[calc(50%-2rem)] ${
        node.side === 'right' ? 'md:ml-auto' : ''
      }`}
      style={{ perspective: '1000px' }}
    >
      <div className="glass-surface rounded-2xl p-6 md:p-8 group hover:border-cyan-boot/20 transition-all duration-500">
        {/* Year badge */}
        <div className="font-mono text-[9px] tracking-[0.3em] text-cyan-boot/60 mb-3">
          {node.year}
        </div>

        {/* Title */}
        <h3 className="font-display font-bold text-lg md:text-xl text-highlight-silver mb-1 group-hover:text-cyan-boot transition-colors duration-300">
          {node.title}
        </h3>

        {/* Company */}
        <div className="font-mono text-[10px] tracking-[0.2em] text-lcd-ash/40 mb-4">
          {node.company}
        </div>

        {/* Description */}
        <p className="font-mono text-xs leading-relaxed text-lcd-ash/60 mb-5">
          {node.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {node.tags.map(tag => (
            <span
              key={tag}
              className="font-mono text-[9px] px-2.5 py-1 rounded-full border border-cyan-boot/15 text-cyan-boot/50"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Node dot on spine */}
      <div
        className={`hidden md:block absolute top-8 w-3 h-3 rounded-full bg-cyan-boot/40 border border-cyan-boot/60 ${
          node.side === 'left' ? '-right-[calc(2rem+6px)]' : '-left-[calc(2rem+6px)]'
        }`}
        style={{
          boxShadow: '0 0 10px rgba(72, 219, 251, 0.3)',
        }}
      />
    </div>
  )
}

export default function TimelineSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const spineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const spine = spineRef.current
    if (!spine) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        spine,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef.current!)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="relative w-full py-32 md:py-40"
      style={{ zIndex: 3, background: '#050505' }}
    >
      {/* Section header */}
      <div className="section-padding mb-20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-px bg-cyan-boot/40" />
          <span className="font-mono text-[9px] tracking-[0.4em] text-cyan-boot/60 uppercase">
            Experience
          </span>
        </div>
        <h2 className="font-display font-light text-4xl md:text-5xl lg:text-6xl text-highlight-silver">
          时空<span className="text-cyan-boot">履历</span>
        </h2>
      </div>

      {/* Timeline */}
      <div className="section-padding relative">
        {/* Spine */}
        <div
          ref={spineRef}
          className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-boot/40 via-cyan-boot/20 to-transparent origin-top"
          style={{ transform: 'translateX(-50%)' }}
        />

        {/* Nodes */}
        <div className="relative space-y-16 md:space-y-24">
          {timelineData.map((node, index) => (
            <TimelineCard key={index} node={node} />
          ))}
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <img
          src={timelineBackgroundSrc}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  )
}
