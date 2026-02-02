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
    <Card>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Watch Tournament</h2>
      <p className="text-[var(--text-muted)] mb-4">
        Enter the tournament code to view the live leaderboard and match info.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Tournament code"
          placeholder="e.g. SQUAD7"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 6))}
          maxLength={6}
          className="font-mono uppercase"
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" fullWidth size="lg" disabled={loading || !code.trim()}>
          {loading ? 'Loading…' : 'Watch Tournament'}
        </Button>
      </form>
    </Card>
  )
}
