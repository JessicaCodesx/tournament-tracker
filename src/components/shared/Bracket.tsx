/**
 * Visual tournament bracket: match cards, current match highlighted, click completed for details.
 */
import type { Tournament, Match } from '../../types/tournament'
import { teamNames } from '../../utils/tournamentHelpers'

interface BracketProps {
  tournament: Tournament
  currentMatchIndex: number
  onMatchClick?: (match: Match, index: number) => void
  className?: string
}

function MatchCard({
  tournament,
  match,
  isCurrent,
  onClick,
}: {
  tournament: Tournament
  match: Match
  isCurrent: boolean
  onClick?: () => void
}) {
  const t1 = teamNames(tournament, match.team1)
  const t2 = teamNames(tournament, match.team2)
  const t3 = match.team3 ? teamNames(tournament, match.team3) : null
  const isCompleted = match.status === 'completed'
  const isClickable = isCompleted && onClick

  return (
    <div
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onClick={isClickable ? () => onClick() : undefined}
      onKeyDown={
        isClickable
          ? (e) => e.key === 'Enter' && onClick()
          : undefined
      }
      className={`
        relative rounded-[var(--radius-md)] border bg-[var(--bg-elevated)] p-4 text-left transition-all duration-[var(--transition-normal)]
        ${isCurrent ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]/50 shadow-[var(--shadow-glow)]' : 'border-[var(--border-subtle)]'}
        ${isClickable ? 'cursor-pointer hover:border-[var(--accent)]/50 hover:bg-[var(--bg-card-hover)]' : ''}
      `}
    >
      {isCurrent && (
        <span className="absolute -top-2 left-3 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-[var(--accent)] text-white animate-live-pulse">
          Live
        </span>
      )}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-caption font-semibold text-[var(--text-secondary)]">
          Match {match.matchNumber}
        </span>
        {isCompleted && match.winner && (
          <span className="text-[10px] font-semibold uppercase text-[var(--accent)]">
            Winner: Team {match.winner.replace('team', '')}
          </span>
        )}
      </div>
      <p className="text-xs font-medium text-[var(--accent)] mb-2">
        {match.mode} · {match.map}
      </p>
      <div className="space-y-1 text-sm text-[var(--text-primary)]">
        <div className="flex flex-wrap items-center gap-1">
          <span className="font-medium text-[var(--text-secondary)]">1</span>
          <span>{t1}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[var(--text-muted)] font-bold">vs</span>
        </div>
        <div className="flex flex-wrap items-center gap-1">
          <span className="font-medium text-[var(--text-secondary)]">2</span>
          <span>{t2}</span>
        </div>
        {t3 != null && (
          <>
            <div className="flex items-center gap-1.5">
              <span className="text-[var(--text-muted)] font-bold">vs</span>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              <span className="font-medium text-[var(--text-secondary)]">3</span>
              <span>{t3}</span>
            </div>
          </>
        )}
      </div>
      {isClickable && (
        <p className="mt-2 text-xs text-[var(--text-muted)]">Click to view scoreboard</p>
      )}
    </div>
  )
}

export default function Bracket({
  tournament,
  currentMatchIndex,
  onMatchClick,
  className = '',
}: BracketProps) {
  const { matches } = tournament

  return (
    <div className={className}>
      <h2 className="text-title text-lg text-[var(--text-primary)] mb-1">Bracket</h2>
      <p className="text-caption mb-4">
        {matches.length} matches · Current match highlighted
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {matches.map((match, i) => (
          <MatchCard
            key={match.id}
            tournament={tournament}
            match={match}
            isCurrent={i === currentMatchIndex}
            onClick={
              match.status === 'completed' && onMatchClick
                ? () => onMatchClick(match, i)
                : undefined
            }
          />
        ))}
      </div>
    </div>
  )
}
