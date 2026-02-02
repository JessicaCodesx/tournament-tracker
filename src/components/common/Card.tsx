import type { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-xl bg-[var(--bg-card)] border border-[var(--text-muted)]/20 p-4 sm:p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
