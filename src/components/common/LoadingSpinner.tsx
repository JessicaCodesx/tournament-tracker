export default function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--text-muted)] border-t-[var(--accent)] ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}
