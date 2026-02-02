/**
 * Live standings table: rank, player, wins, losses, W%, avg K/D. Based on games entered.
 */
import type { Tournament, LeaderboardEntry } from '../../types/tournament'

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

  return (
    <div className={`overflow-x-auto -mx-1 ${className}`}>
      <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mb-1">Tournament Standings</h2>
      <p className="text-xs sm:text-sm text-[var(--text-muted)] mb-3">
        Based on {gamesEntered} game{gamesEntered !== 1 ? 's' : ''} entered.
      </p>
      <table className="w-full text-left text-sm min-w-[260px]">
        <thead>
          <tr className="border-b border-[var(--text-muted)]/30 text-[var(--text-muted)]">
            <th className="py-2 pr-2">Rank</th>
            <th className="py-2 pr-2">Player</th>
            <th className="py-2 pr-2">W</th>
            <th className="py-2 pr-2">L</th>
            <th className="py-2 pr-2">Games</th>
            <th className="py-2 pr-2">W%</th>
            <th className="py-2">Avg K/D</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(({ player, entry }, i) => {
            const winPct = entry.gamesPlayed > 0 ? Math.round((entry.wins / entry.gamesPlayed) * 100) : 0
            return (
              <tr key={player.id} className="border-b border-[var(--text-muted)]/10">
                <td className="py-2 pr-2 font-medium">{i + 1}</td>
                <td className="py-2 pr-2">{player.name}</td>
                <td className="py-2 pr-2">{entry.wins}</td>
                <td className="py-2 pr-2">{entry.losses}</td>
                <td className="py-2 pr-2">{entry.gamesPlayed}</td>
                <td className="py-2 pr-2">{winPct}%</td>
                <td className="py-2">{entry.kdRatio.toFixed(2)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
