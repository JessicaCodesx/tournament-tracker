/**
 * Displays current match: map, mode, team names, player names.
 */
import type { Tournament, Match } from '../../types/tournament'

interface CurrentMatchDisplayProps {
  tournament: Tournament
  match: Match
  className?: string
}

function teamNames(tournament: Tournament, teamIds: string[]) {
  return teamIds
    .map((id) => tournament.players.find((p) => p.id === id)?.name ?? id)
    .join(', ')
}

export default function CurrentMatchDisplay({ tournament, match, className = '' }: CurrentMatchDisplayProps) {
  const team1Names = teamNames(tournament, match.team1)
  const team2Names = teamNames(tournament, match.team2)
  const team3 = match.team3 ? teamNames(tournament, match.team3) : null

  return (
    <div className={className}>
      <p className="text-caption text-[var(--accent)] mb-2">
        {match.mode} — {match.map}
      </p>
      <div className="flex flex-wrap items-center gap-2 text-[var(--text-primary)] text-sm sm:text-base">
        <span className="font-medium text-[var(--text-secondary)]">Team 1:</span>
        <span>{team1Names}</span>
        <span className="text-[var(--text-muted)] px-1">vs</span>
        <span className="font-medium text-[var(--text-secondary)]">Team 2:</span>
        <span>{team2Names}</span>
        {team3 != null && (
          <>
            <span className="text-[var(--text-muted)] px-1">vs</span>
            <span className="font-medium text-[var(--text-secondary)]">Team 3:</span>
            <span>{team3}</span>
          </>
        )}
      </div>
    </div>
  )
}
