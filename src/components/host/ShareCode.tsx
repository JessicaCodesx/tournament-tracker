/**
 * Post-creation screen: shareable code, copy/link, shuffle maps & modes, Start Tournament.
 */
import { useCallback, useState } from 'react'
import Button from '../common/Button'
import Card from '../common/Card'

interface ShareCodeProps {
  code: string
  matchCount: number
  onStart: () => void
  onShuffleMapsModes?: () => void
  shuffling?: boolean
}

export default function ShareCode({ code, matchCount, onStart, onShuffleMapsModes, shuffling }: ShareCodeProps) {
  const [copied, setCopied] = useState<'code' | 'link' | null>(null)

  const watchUrl = typeof window !== 'undefined' ? `${window.location.origin}/watch/${code}` : ''

  const copyCode = useCallback(() => {
    navigator.clipboard.writeText(code)
    setCopied('code')
    setTimeout(() => setCopied(null), 2000)
  }, [code])

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(watchUrl)
    setCopied('link')
    setTimeout(() => setCopied(null), 2000)
  }, [watchUrl])

  return (
    <Card elevated>
      <p className="section-label text-[var(--accent)] mb-1">Tournament created</p>
      <h2 className="text-title text-xl text-[var(--text-primary)] mb-2">Share this code</h2>
      <p className="text-caption mb-6">
        Friends can watch the leaderboard and match info live.
      </p>
      <div className="rounded-[var(--radius-md)] border border-[var(--border-default)] bg-[var(--bg-elevated)] p-6 mb-6 text-center ring-1 ring-[var(--accent)]/20 shadow-[var(--shadow-glow)]">
        <p className="text-3xl sm:text-4xl font-bold font-mono tracking-[0.35em] text-[var(--accent)] tabular-nums">
          {code}
        </p>
      </div>
      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="secondary" onClick={copyCode}>
          {copied === 'code' ? 'Copied!' : 'Copy Code'}
        </Button>
        <Button variant="secondary" onClick={copyLink}>
          {copied === 'link' ? 'Copied!' : 'Copy Link'}
        </Button>
      </div>
      <p className="text-caption mb-6 break-all">
        Watch URL: <span className="text-[var(--text-secondary)]">{watchUrl}</span>
      </p>
      {onShuffleMapsModes && (
        <Button
          variant="secondary"
          className="mb-4 w-full sm:w-auto"
          onClick={onShuffleMapsModes}
          disabled={shuffling}
        >
          {shuffling ? 'Shuffling…' : `Shuffle maps & modes (${matchCount} matches)`}
        </Button>
      )}
      <Button size="lg" fullWidth onClick={onStart}>
        Start Tournament
      </Button>
    </Card>
  )
}
