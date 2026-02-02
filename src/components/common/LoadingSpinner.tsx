export default function LoadingSpinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-block h-8 w-8 rounded-full border-2 border-[var(--border-strong)] border-t-[var(--accent)] animate-spin ${className}`}
      role="status"
      aria-label="Loading"
    />
  )
}
