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
    <Card elevated className={className}>
      <h2 className="text-title text-base text-[var(--text-primary)] mb-1">Match history</h2>
      <p className="text-caption mb-4">
        {completed.length} game{completed.length !== 1 ? 's' : ''} completed.
      </p>
      <ul className="space-y-2.5">
        {completed.map((m) => (
          <li
            key={m.id}
            className="flex flex-wrap items-center gap-2 py-2.5 border-b border-[var(--border-subtle)] last:border-0 text-sm"
          >
            <span className="font-semibold text-[var(--text-secondary)]">Match {m.matchNumber}</span>
            <span className="text-[var(--text-muted)]">—</span>
            <span className="text-[var(--text-primary)]">{m.mode} · {m.map}</span>
            <span className="text-[var(--text-muted)] hidden sm:inline">·</span>
            <span className="text-[var(--text-secondary)]">
              {teamNames(tournament, m.team1)} vs {teamNames(tournament, m.team2)}
              {m.team3 ? ` vs ${teamNames(tournament, m.team3)}` : ''}
            </span>
            {m.winner && (
              <span className="font-medium text-[var(--accent)]">
                Winner: Team {m.winner.replace('team', '')}
              </span>
            )}
          </li>
        ))}
      </ul>
    </Card>
  )
}
