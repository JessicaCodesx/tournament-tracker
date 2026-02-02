import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  elevated?: boolean
}

export default function Card({ children, className = '', elevated, ...props }: CardProps) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-4 sm:p-6 shadow-[var(--shadow-card)] transition-shadow duration-[var(--transition-normal)] min-w-0 overflow-hidden ${elevated ? 'shadow-[var(--shadow-card-hover)]' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
