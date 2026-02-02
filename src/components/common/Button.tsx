import type { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className = '',
  children,
  ...props
}: ButtonProps) {
  const base =
    'font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed min-h-[var(--touch-min)] active:scale-[0.98]'
  const variants = {
    primary:
      'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] focus:ring-[var(--accent)]',
    secondary:
      'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--text-muted)] hover:border-[var(--accent)] focus:ring-[var(--text-muted)]',
    ghost:
      'bg-transparent text-[var(--text-primary)] hover:bg-[var(--bg-card)] focus:ring-[var(--text-muted)]',
  }
  const sizes = {
    sm: 'px-4 py-2.5 text-sm min-h-[var(--touch-min)]',
    md: 'px-5 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  }
  return (
    <button
      type="button"
      className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
