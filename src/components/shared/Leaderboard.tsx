/**
 * Live standings table: rank, player, wins, losses, W%, avg K/D. Based on games entered.
 * Shows 🔥 next to name when player is on a 3+ win streak.
 */
import type { Tournament, LeaderboardEntry } from '../../types/tournament'
import { getWinStreak } from '../../utils/tournamentHelpers'

interface LeaderboardProps {
  tournament: Tournament
  className?: string
}

export default function Leaderboard({ tournament, className = '' }: LeaderboardProps) {
  const { players, leaderboard } = tournament
  const gamesEntered = tournament.matches.filter((m) => m.status === 'completed').length
  const entries = players
    .map((p) => ({
      player: p,
      entry: leaderboard[p.id],
    }))
    .filter((e): e is { player: (typeof players)[0]; entry: LeaderboardEntry } => !!e.entry)
    .sort((a, b) => {
      const wA = a.entry.wins
      const wB = b.entry.wins
      if (wB !== wA) return wB - wA
      return b.entry.kdRatio - a.entry.kdRatio
    })

  const showPlants = entries.some((e) => (e.entry.totalPlants ?? 0) > 0)
  const showDefuses = entries.some((e) => (e.entry.totalDefuses ?? 0) > 0)

  return (
    <div className={`overflow-x-auto -mx-1 ${className}`}>
      <h2 className="text-title text-base sm:text-lg text-[var(--text-primary)] mb-1">
        Tournament Standings
      </h2>
      <p className="text-caption mb-4">
        Based on {gamesEntered} game{gamesEntered !== 1 ? 's' : ''} entered.
      </p>
      <table className="w-full text-left text-sm min-w-[260px]">
        <thead>
          <tr className="border-b border-[var(--border-default)]">
            <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">Rank</th>
            <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">Player</th>
            <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">W</th>
            <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">L</th>
            <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">Games</th>
            <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">W%</th>
            <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">K/D</th>
            {showPlants && <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">Plants</th>}
            {showDefuses && <th className="section-label py-3 font-medium text-[var(--text-muted)]">Defuses</th>}
          </tr>
        </thead>
        <tbody>
          {entries.map(({ player, entry }, i) => {
            const winPct = entry.gamesPlayed > 0 ? Math.round((entry.wins / entry.gamesPlayed) * 100) : 0
            const isTop = i < 3
            return (
              <tr
                key={player.id}
                className={`border-b border-[var(--border-subtle)] transition-colors duration-[var(--transition-fast)] ${
                  isTop ? 'bg-[var(--accent-muted)]/30' : 'hover:bg-[var(--bg-card-hover)]'
                }`}
              >
                <td className="py-3 pr-3 font-semibold text-[var(--text-secondary)]">{i + 1}</td>
                <td className="py-3 pr-3 font-medium text-[var(--text-primary)]">
                  {player.name}
                  {getWinStreak(tournament, player.id) >= 3 && (
                    <span className="ml-1" aria-label="3+ win streak">🔥</span>
                  )}
                </td>
                <td className="py-3 pr-3 text-[var(--text-secondary)]">{entry.wins}</td>
                <td className="py-3 pr-3 text-[var(--text-secondary)]">{entry.losses}</td>
                <td className="py-3 pr-3 text-[var(--text-secondary)]">{entry.gamesPlayed}</td>
                <td className="py-3 pr-3 text-[var(--text-secondary)]">{winPct}%</td>
                <td className="py-3 pr-3 font-medium tabular-nums text-[var(--text-primary)]">
                  {entry.kdRatio.toFixed(2)}
                </td>
                {showPlants && (
                  <td className="py-3 pr-3 tabular-nums text-[var(--text-secondary)]">
                    {entry.totalPlants ?? '—'}
                  </td>
                )}
                {showDefuses && (
                  <td className="py-3 tabular-nums text-[var(--text-secondary)]">
                    {entry.totalDefuses ?? '—'}
                  </td>
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
