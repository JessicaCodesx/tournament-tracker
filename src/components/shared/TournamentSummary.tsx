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
      <p className="section-label text-[var(--accent)] mb-1">Tournament complete</p>
      <h2 className="text-title text-xl text-[var(--text-primary)] mb-4">Final results</h2>
      {champion && (
        <div className="rounded-[var(--radius-md)] border border-[var(--accent)]/30 bg-[var(--accent-muted)]/20 p-4 mb-6">
          <p className="text-caption text-[var(--accent)] mb-0.5">Champion</p>
          <p className="text-subtitle text-lg text-[var(--text-primary)]">
            {champion.player.name}
          </p>
        </div>
      )}
      <div className="mb-6">
        <h3 className="section-label mb-2 text-[var(--text-secondary)]">Final standings</h3>
        <ol className="space-y-1.5">
          {entries.slice(0, 5).map(({ player, entry }, i) => (
            <li
              key={player.id}
              className="flex items-center justify-between py-1.5 border-b border-[var(--border-subtle)] last:border-0"
            >
              <span className="font-medium text-[var(--text-primary)]">
                {i + 1}. {player.name}
              </span>
              <span className="text-[var(--text-secondary)]">{entry.wins} wins</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mb-6 rounded-[var(--radius-md)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-4">
        <p className="text-caption mb-1">Tournament code</p>
        <p className="font-mono font-semibold text-[var(--text-primary)] mb-2">{code}</p>
        <p className="text-caption break-all">View anytime: {watchUrl}</p>
      </div>
      <div className="pt-6 border-t border-[var(--border-default)]">
        <PlayerStats tournament={tournament} />
      </div>
    </div>
  )
}
