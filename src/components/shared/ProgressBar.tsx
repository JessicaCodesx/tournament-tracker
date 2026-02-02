/**
 * Tournament completion progress (e.g. Match 3 of 10).
 */
interface ProgressBarProps {
  current: number
  total: number
  className?: string
}

export default function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0
  return (
    <div className={className}>
      <div className="flex justify-between text-caption mb-2">
        <span>Match {current} of {total}</span>
        <span className="font-medium text-[var(--text-secondary)]">{Math.round(pct)}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
        <div
          className="h-full rounded-full bg-[var(--accent)] transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
