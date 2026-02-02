import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({ label, error, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s/g, '-')
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="section-label block mb-2 text-[var(--text-secondary)]"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full min-h-[var(--touch-min)] px-4 py-3 text-base rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] placeholder-[var(--text-muted)] transition-colors duration-[var(--transition-fast)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-amber-400/90">{error}</p>
      )}
    </div>
  )
}
