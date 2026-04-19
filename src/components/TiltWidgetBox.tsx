import { useRef, useEffect, type ReactNode } from 'react'

interface TiltWidgetBoxProps {
  children: ReactNode
  width?: string
  height?: string
  className?: string
}

export default function TiltWidgetBox({
  children,
  width = '240px',
  height = 'auto',
  className = '',
}: TiltWidgetBoxProps) {
  const boxRef = useRef<HTMLDivElement>(null)
  const tiltRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const box = boxRef.current
    if (!box) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = box.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = x / rect.width - 0.5
      const centerY = y / rect.height - 0.5
      const rotationX = centerY * 20
      const rotationY = centerX * -20

      tiltRef.current = { x: rotationX, y: rotationY }

      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        box.style.transform = `perspective(1000px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale3d(1.02, 1.02, 1.02)`
      })
    }

    const handleMouseLeave = () => {
      tiltRef.current = { x: 0, y: 0 }
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(() => {
        box.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
      })
    }

    box.addEventListener('mousemove', handleMouseMove)
    box.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      box.removeEventListener('mousemove', handleMouseMove)
      box.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div
      ref={boxRef}
      className={`glass-surface rounded-2xl p-6 transition-transform duration-200 ease-out cursor-grab active:cursor-grabbing ${className}`}
      style={{ width, height, willChange: 'transform' }}
    >
      {children}
    </div>
  )
}
