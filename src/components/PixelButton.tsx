import { type ReactNode, useRef, useCallback } from 'react'

interface PixelButtonProps {
  children: ReactNode
  onClick?: () => void
  href?: string
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  glowOnHover?: boolean
}

export default function PixelButton({
  children,
  onClick,
  href,
  variant = 'primary',
  size = 'md',
  className = '',
  glowOnHover = false,
}: PixelButtonProps) {
  const btnRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const btn = btnRef.current
    if (!btn) return
    const rect = btn.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    btn.style.setProperty('--mx', `${x}px`)
    btn.style.setProperty('--my', `${y}px`)
  }, [])

  const baseClasses =
    'relative inline-flex items-center justify-center font-display font-bold uppercase tracking-widest transition-all duration-150 ease-out select-none cursor-pointer overflow-hidden'

  const sizeClasses = {
    sm: 'px-5 py-2 text-[10px] rounded-lg',
    md: 'px-8 py-3.5 text-xs rounded-xl',
    lg: 'px-12 py-5 text-sm rounded-2xl',
  }

  const variantClasses = {
    primary: `
      bg-tactile-charcoal text-highlight-silver
      shadow-pixel-btn
      border-t border-highlight-silver/20
      hover:translate-y-[3px] hover:shadow-pixel-btn-hover
      active:translate-y-[6px] active:shadow-pixel-btn-active
      ${glowOnHover ? 'hover:shadow-neon-glow hover:border-cyan-boot/40' : ''}
    `,
    secondary: `
      bg-grid-charcoal text-lcd-ash
      shadow-pixel-btn
      border-t border-white/10
      hover:translate-y-[3px] hover:shadow-pixel-btn-hover
      active:translate-y-[6px] active:shadow-pixel-btn-active
    `,
    outline: `
      bg-transparent text-lcd-ash
      border border-lcd-ash/20
      hover:border-cyan-boot/50 hover:text-cyan-boot
      hover:shadow-neon-glow
    `,
  }

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`

  const shineStyle: React.CSSProperties = {
    background: 'radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(72, 219, 251, 0.15) 0%, transparent 60%)',
  }

  if (href) {
    return (
      <a
        ref={btnRef as React.RefObject<HTMLAnchorElement>}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={combinedClasses}
        onMouseMove={handleMouseMove}
      >
        <span className="absolute inset-0 pointer-events-none" style={shineStyle} />
        <span className="relative z-10">{children}</span>
      </a>
    )
  }

  return (
    <button
      ref={btnRef as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      className={combinedClasses}
      onMouseMove={handleMouseMove}
    >
      <span className="absolute inset-0 pointer-events-none" style={shineStyle} />
      <span className="relative z-10">{children}</span>
    </button>
  )
}
