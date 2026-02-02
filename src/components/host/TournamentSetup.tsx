/**
 * Tournament setup: 6 player names, format (3v3 / 2v2v2), Generate button.
 */
import { useState } from 'react'
import Button from '../common/Button'
import Input from '../common/Input'
import Card from '../common/Card'
import type { TournamentFormat } from '../../types/tournament'

const PLAYER_IDS = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'] as const

interface TournamentSetupProps {
  onGenerate: (players: { id: string; name: string }[], format: TournamentFormat) => void
  generating?: boolean
}

export default function TournamentSetup({ onGenerate, generating }: TournamentSetupProps) {
  const [names, setNames] = useState<Record<string, string>>(
    Object.fromEntries(PLAYER_IDS.map((id) => [id, '']))
  )
  const [format, setFormat] = useState<TournamentFormat>('3v3')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const players = PLAYER_IDS.map((id) => ({ id, name: names[id]?.trim() ?? '' }))
    const filled = players.filter((p) => p.name.length > 0)
    const unique = new Set(filled.map((p) => p.name.toLowerCase()))
    if (filled.length !== 6) {
      setError('Enter all 6 player names.')
      return
    }
    if (unique.size !== 6) {
      setError('Player names must be unique.')
      return
    }
    setError(null)
    onGenerate(players, format)
  }

  return (
    <Card elevated>
      <p className="section-label text-[var(--accent)] mb-1">New tournament</p>
      <h2 className="text-title text-xl text-[var(--text-primary)] mb-4">Setup</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PLAYER_IDS.map((id) => (
            <Input
              key={id}
              label={`Player ${id.slice(1)}`}
              placeholder="Name"
              value={names[id]}
              onChange={(e) => setNames((prev) => ({ ...prev, [id]: e.target.value }))}
              maxLength={20}
            />
          ))}
        </div>
        <div>
          <label className="section-label block mb-2 text-[var(--text-secondary)]">Format</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as TournamentFormat)}
            className="w-full min-h-[var(--touch-min)] px-4 py-3 text-base rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] transition-colors duration-[var(--transition-fast)]"
          >
            <option value="3v3">3v3 (2 teams of 3)</option>
            <option value="2v2v2">2v2v2 (3 teams of 2)</option>
          </select>
        </div>
        {error && <p className="text-sm text-amber-400/90">{error}</p>}
        <Button type="submit" fullWidth size="lg" disabled={generating}>
          {generating ? 'Generating…' : 'Generate Tournament'}
        </Button>
      </form>
    </Card>
  )
}
