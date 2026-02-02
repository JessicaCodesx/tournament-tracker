/**
 * List of completed matches for spectator/host review.
 */
import Card from '../common/Card'
import type { Tournament } from '../../types/tournament'

interface MatchHistoryProps {
  tournament: Tournament
  className?: string
}

function teamNames(tournament: Tournament, teamIds: string[]) {
  return teamIds
    .map((id) => tournament.players.find((p) => p.id === id)?.name ?? id)
    .join(', ')
}

export default function MatchHistory({ tournament, className = '' }: MatchHistoryProps) {
  const completed = tournament.matches.filter((m) => m.status === 'completed')

  if (completed.length === 0) return null

  return (
    <Card className={className}>
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">Match History</h2>
      <ul className="space-y-2 text-sm">
        {completed.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center gap-2 text-[var(--text-muted)]">
            <span className="font-medium text-[var(--text-primary)]">Match {m.matchNumber}:</span>
            <span>{m.mode} — {m.map}</span>
            <span>
              {teamNames(tournament, m.team1)} vs {teamNames(tournament, m.team2)}
              {m.team3 ? ` vs ${teamNames(tournament, m.team3)}` : ''}
            </span>
            {m.winner && (
              <span className="text-[var(--accent)]">
                Winner: Team {m.winner.replace('team', '')}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Card>
  )
}
