/**
 * Final tournament summary: champion, standings, player stats, share link.
 */
import PlayerStats from './PlayerStats'
import type { Tournament, LeaderboardEntry } from '../../types/tournament'

interface TournamentSummaryProps {
  tournament: Tournament
  className?: string
}

export default function TournamentSummary({ tournament, className = '' }: TournamentSummaryProps) {
  const { players, leaderboard, code } = tournament
  const entries = players
    .map((p) => ({ player: p, entry: leaderboard[p.id] }))
    .filter((e): e is { player: (typeof players)[0]; entry: LeaderboardEntry } => !!e.entry)
    .sort((a, b) => b.entry.wins - a.entry.wins)

  const champion = entries[0]
  const watchUrl = typeof window !== 'undefined' ? `${window.location.origin}/watch/${code}` : ''

  return (
    <div className={className}>
      <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Tournament Complete</h2>
      {champion && (
        <p className="text-lg text-[var(--accent)] font-semibold mb-4">
          Champion: {champion.player.name}
        </p>
      )}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-[var(--text-muted)] mb-2">Final Standings</h3>
        <ol className="list-decimal list-inside space-y-1">
          {entries.slice(0, 5).map(({ player, entry }) => (
            <li key={player.id}>
              {player.name} — {entry.wins} wins
            </li>
          ))}
        </ol>
      </div>
      <div className="mb-4 text-sm text-[var(--text-muted)]">
        <p>Tournament Code: <strong className="text-[var(--text-primary)]">{code}</strong></p>
        <p>View anytime: {watchUrl}</p>
      </div>
      <div className="mt-6 pt-4 border-t border-[var(--text-muted)]/20">
        <PlayerStats tournament={tournament} />
      </div>
    </div>
  )
}
