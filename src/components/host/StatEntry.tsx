/**
 * Quick stat entry: select winner, enter K/D/Score per player, submit.
 */
import { useState, useCallback } from 'react'
import Button from '../common/Button'
import Card from '../common/Card'
import type { Tournament, Match } from '../../types/tournament'

interface StatEntryProps {
  tournament: Tournament
  match: Match
  matchIndex: number
  onBack: () => void
  onSubmit: (
    winner: 'team1' | 'team2' | 'team3',
    stats: Record<string, { kills: number; deaths: number; score?: number }>
  ) => void
  submitting?: boolean
}

function allPlayerIds(match: Match): string[] {
  const set = new Set([...match.team1, ...match.team2, ...(match.team3 ?? [])])
  return [...set]
}

export default function StatEntry({
  tournament,
  match,
  matchIndex: _matchIndex,
  onBack,
  onSubmit,
  submitting,
}: StatEntryProps) {
  const playerIds = allPlayerIds(match)
  const [winner, setWinner] = useState<'team1' | 'team2' | 'team3' | null>(null)
  const [stats, setStats] = useState<Record<string, { kills: number; deaths: number; score: number }>>(
    () => Object.fromEntries(playerIds.map((id) => [id, { kills: 0, deaths: 0, score: 0 }]))
  )

  const updateStat = useCallback(
    (playerId: string, field: 'kills' | 'deaths' | 'score', value: number) => {
      setStats((prev: Record<string, { kills: number; deaths: number; score: number }>) => ({
        ...prev,
        [playerId]: { ...prev[playerId], [field]: value },
      }))
    },
    []
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!winner) return
    const out: Record<string, { kills: number; deaths: number; score?: number }> = {}
    for (const id of playerIds) {
      const s = stats[id] ?? { kills: 0, deaths: 0, score: 0 }
      out[id] = { kills: s.kills, deaths: s.deaths, score: s.score || undefined }
    }
    onSubmit(winner, out)
  }

  const team1Label = 'Team 1'
  const team2Label = 'Team 2'
  const team3Label = match.team3 ? 'Team 3' : null

  return (
    <Card>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Match Results</h2>
      <p className="text-[var(--text-muted)] mb-4">Select winning team and enter stats.</p>
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={winner === 'team1' ? 'primary' : 'secondary'}
          onClick={() => setWinner('team1')}
        >
          {team1Label}
        </Button>
        <Button
          variant={winner === 'team2' ? 'primary' : 'secondary'}
          onClick={() => setWinner('team2')}
        >
          {team2Label}
        </Button>
        {team3Label && (
          <Button
            variant={winner === 'team3' ? 'primary' : 'secondary'}
            onClick={() => setWinner('team3')}
          >
            {team3Label}
          </Button>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--text-muted)]/30 text-[var(--text-muted)]">
                <th className="py-2 pr-2 text-left">Player</th>
                <th className="py-2 pr-2 text-left">Kills</th>
                <th className="py-2 pr-2 text-left">Deaths</th>
                <th className="py-2 text-left">Score</th>
              </tr>
            </thead>
            <tbody>
              {playerIds.map((id) => {
                const player = tournament.players.find((p) => p.id === id)
                const s = stats[id] ?? { kills: 0, deaths: 0, score: 0 }
                return (
                  <tr key={id} className="border-b border-[var(--text-muted)]/10">
                    <td className="py-2 pr-2">{player?.name ?? id}</td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        min={0}
                        className="w-16 px-2 py-1 rounded bg-[var(--bg-primary)] border border-[var(--text-muted)]/30 text-[var(--text-primary)]"
                        value={s.kills}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateStat(id, 'kills', parseInt(e.target.value, 10) || 0)}
                      />
                    </td>
                    <td className="py-2 pr-2">
                      <input
                        type="number"
                        min={0}
                        className="w-16 px-2 py-1 rounded bg-[var(--bg-primary)] border border-[var(--text-muted)]/30 text-[var(--text-primary)]"
                        value={s.deaths}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateStat(id, 'deaths', parseInt(e.target.value, 10) || 0)}
                      />
                    </td>
                    <td className="py-2">
                      <input
                        type="number"
                        min={0}
                        className="w-20 px-2 py-1 rounded bg-[var(--bg-primary)] border border-[var(--text-muted)]/30 text-[var(--text-primary)]"
                        value={s.score}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateStat(id, 'score', parseInt(e.target.value, 10) || 0)}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <Button type="button" variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={!winner || submitting}>
            {submitting ? 'Submitting…' : 'Submit Results'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
