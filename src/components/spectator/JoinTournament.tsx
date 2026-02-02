/**
 * Spectator entry: enter tournament code or redirect from /watch/:code.
 */
import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import Card from '../common/Card'

interface JoinTournamentProps {
  onJoin: (code: string) => void
  loading?: boolean
  error?: string | null
}

export default function JoinTournament({ onJoin, loading, error }: JoinTournamentProps) {
  const [code, setCode] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) return
    onJoin(trimmed)
  }

  return (
    <Card elevated>
      <p className="section-label text-[var(--accent)] mb-1">Spectator</p>
      <h2 className="text-title text-xl text-[var(--text-primary)] mb-2">Watch tournament</h2>
      <p className="text-caption mb-5">
        Enter a code to watch a live tournament or view past results. Codes work anytime.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tournament code"
          placeholder="e.g. SQUAD7"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
          maxLength={6}
          className="font-mono uppercase tracking-wider"
        />
        {error && <p className="text-sm text-amber-400/90">{error}</p>}
        <Button type="submit" fullWidth size="lg" disabled={loading || !code.trim()}>
          {loading ? 'Loading…' : 'Watch Tournament'}
        </Button>
      </form>
    </Card>
  )
}
