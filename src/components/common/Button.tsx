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
    'inline-flex items-center justify-center font-semibold rounded-[var(--radius-md)] transition-all duration-[var(--transition-normal)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-primary)] disabled:opacity-50 disabled:cursor-not-allowed min-h-[var(--touch-min)] active:scale-[0.98]'
  const variants = {
    primary:
      'bg-[var(--accent)] text-white shadow-[0_2px_12px_var(--accent-glow)] hover:bg-[var(--accent-hover)] hover:shadow-[0_4px_20px_var(--accent-glow)]',
    secondary:
      'bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border-default)] hover:bg-[var(--bg-card-hover)] hover:border-[var(--accent)]/40',
    ghost:
      'bg-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]',
  }
  const sizes = {
    sm: 'px-4 py-2.5 text-sm min-h-[var(--touch-min)]',
    md: 'px-5 py-3 text-[0.9375rem]',
    lg: 'px-6 py-4 text-base',
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
