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
    <Card>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Tournament Created</h2>
      <p className="text-[var(--text-muted)] mb-4">Share this code with friends so they can watch live.</p>
      <div className="bg-[var(--bg-primary)] rounded-lg border border-[var(--text-muted)]/30 p-6 mb-4 text-center">
        <p className="text-3xl font-mono font-bold tracking-widest text-[var(--accent)]">{code}</p>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        <Button variant="secondary" onClick={copyCode}>
          {copied === 'code' ? 'Copied!' : 'Copy Code'}
        </Button>
        <Button variant="secondary" onClick={copyLink}>
          {copied === 'link' ? 'Copied!' : 'Copy Full Link'}
        </Button>
      </div>
      <p className="text-sm text-[var(--text-muted)] mb-4">
        Friends can watch at: {watchUrl}
      </p>
      {onShuffleMapsModes && (
        <Button
          variant="secondary"
          className="mb-4"
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
