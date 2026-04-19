import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const paragraphsRef = useRef<HTMLDivElement>(null)
  const codeLinesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const title = titleRef.current
    const paragraphs = paragraphsRef.current
    const codeLines = codeLinesRef.current
    if (!section || !title || !paragraphs || !codeLines) return

    const ctx = gsap.context(() => {
      // Title clip-path reveal
      gsap.fromTo(
        title,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.5,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Paragraphs staggered fade in
      const pElements = paragraphs.querySelectorAll('p')
      gsap.fromTo(
        pElements,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: paragraphs,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Code lines typewriter
      const codeEls = codeLines.querySelectorAll('.code-line')
      gsap.fromTo(
        codeEls,
        { width: 0, opacity: 0 },
        {
          width: 'auto',
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'steps(40)',
          scrollTrigger: {
            trigger: codeLines,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, section)

    return () => ctx.revert()
  }, [])

  const skills = [
    { name: 'TypeScript', level: 95 },
    { name: 'React / Next.js', level: 92 },
    { name: 'Node.js', level: 88 },
    { name: 'Three.js / WebGL', level: 85 },
    { name: 'Python', level: 80 },
    { name: 'Rust', level: 65 },
  ]

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full min-h-screen py-32 md:py-40"
      style={{ zIndex: 3, background: 'linear-gradient(180deg, transparent 0%, #050505 10%, #050505 100%)' }}
    >
      <div className="section-padding">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          {/* Left column - giant title */}
          <div className="lg:w-1/3 flex-shrink-0">
            <h2
              ref={titleRef}
              className="font-mono font-bold text-6xl md:text-8xl lg:text-[9rem] text-lcd-ash/10 leading-none tracking-tighter"
            >
              WHO
              <br />
              AM
              <br />
              I
            </h2>
          </div>

          {/* Right column - content */}
          <div className="lg:w-2/3 flex flex-col gap-12">
            <div ref={paragraphsRef} className="space-y-6">
              <p className="font-mono text-sm md:text-base leading-relaxed text-lcd-ash/80">
                我是一名热衷于将创意与技术融合的独立开发者。我相信代码不仅是实现功能的工具，
                更是创造数字艺术的媒介。从 WebGL 的 3D 渲染到低层级的系统编程，
                我乐于探索技术的每一个边界。
              </p>
              <p className="font-mono text-sm md:text-base leading-relaxed text-lcd-ash/80">
                过去五年里，我在不同规模的团队中担任过前端架构师、全栈工程师和技术负责人。
                我主导的多个项目在性能和用户体验上获得了行业认可。
                工作之余，我持续贡献开源项目，并沉迷于研究计算机图形学和生成式艺术。
              </p>
              <p className="font-mono text-sm md:text-base leading-relaxed text-lcd-ash/60">
                我的设计理念是：用最少的元素传达最强的信息。每一个像素、每一行代码都应该有其存在的理由。
              </p>
            </div>

            {/* Code terminal decoration */}
            <div
              ref={codeLinesRef}
              className="font-mono text-[10px] md:text-xs text-cyan-boot/30 leading-loose border-l border-cyan-boot/10 pl-4"
            >
              <div className="code-line overflow-hidden whitespace-nowrap">
                <span className="text-cyan-boot/50">const</span>{' '}
                <span className="text-highlight-silver/60">developer</span> = {'{'}
              </div>
              <div className="code-line overflow-hidden whitespace-nowrap pl-4">
                passion: <span className="text-cyan-boot/50">&quot;crafting digital experiences&quot;</span>,
              </div>
              <div className="code-line overflow-hidden whitespace-nowrap pl-4">
                stack: [<span className="text-cyan-boot/50">&quot;TS&quot;</span>,{' '}
                <span className="text-cyan-boot/50">&quot;React&quot;</span>,{' '}
                <span className="text-cyan-boot/50">&quot;WebGL&quot;</span>,{' '}
                <span className="text-cyan-boot/50">&quot;Node&quot;</span>],
              </div>
              <div className="code-line overflow-hidden whitespace-nowrap pl-4">
                status: <span className="text-cyan-boot/50">&quot;available for collab&quot;</span>
              </div>
              <div className="code-line overflow-hidden whitespace-nowrap">{'}'}</div>
            </div>

            {/* Skill bars */}
            <div className="space-y-4 pt-4">
              <h3 className="font-display text-xs tracking-[0.3em] text-lcd-ash/40 uppercase mb-6">
                Core Stack
              </h3>
              {skills.map(skill => (
                <div key={skill.name} className="flex items-center gap-4">
                  <span className="font-mono text-[10px] text-lcd-ash/50 w-28 flex-shrink-0">
                    {skill.name}
                  </span>
                  <div className="flex-1 h-1 bg-tactile-charcoal/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-boot/60 to-cyan-boot rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                  <span className="font-mono text-[9px] text-lcd-ash/30 w-8 text-right">
                    {skill.level}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
