/**
 * Per-player stats: totals, K/D, W/L, games entered, and match-by-match breakdown.
 */
import type { Tournament, LeaderboardEntry, Match } from '../../types/tournament'

interface PlayerStatsProps {
  tournament: Tournament
  className?: string
}

function getPlayerMatches(tournament: Tournament, playerId: string): { match: Match; result: 'W' | 'L'; kills: number; deaths: number; score?: number }[] {
  return tournament.matches
    .filter((m) => m.status === 'completed' && m.stats[playerId])
    .map((m) => {
      const stat = m.stats[playerId]
      const winnerSet = new Set(
        m.winner === 'team1' ? m.team1 : m.winner === 'team2' ? m.team2 : m.team3 ?? []
      )
      return {
        match: m,
        result: winnerSet.has(playerId) ? ('W' as const) : ('L' as const),
        kills: stat.kills,
        deaths: stat.deaths,
        score: stat.score,
      }
    })
}

export default function PlayerStats({ tournament, className = '' }: PlayerStatsProps) {
  const { players, leaderboard } = tournament
  const completedCount = tournament.matches.filter((m) => m.status === 'completed').length

  const entries = players
    .map((p) => ({ player: p, entry: leaderboard[p.id] }))
    .filter((e): e is { player: (typeof players)[0]; entry: LeaderboardEntry } => !!e.entry)
    .sort((a, b) => b.entry.wins - a.entry.wins)

  return (
    <div className={className}>
      <h2 className="text-lg font-bold text-[var(--text-primary)] mb-2">Player stats</h2>
      <p className="text-sm text-[var(--text-muted)] mb-3">
        Stats from {completedCount} game{completedCount !== 1 ? 's' : ''} entered.
      </p>
      <div className="space-y-4">
        {entries.map(({ player, entry }) => {
          const winPct = entry.gamesPlayed > 0 ? Math.round((entry.wins / entry.gamesPlayed) * 100) : 0
          const matchRows = getPlayerMatches(tournament, player.id)
          return (
            <div
              key={player.id}
              className="rounded-lg bg-[var(--bg-card)] border border-[var(--text-muted)]/20 p-4"
            >
              <h3 className="font-semibold text-[var(--text-primary)] mb-2">{player.name}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-3">
                <span className="text-[var(--text-muted)]">Kills</span>
                <span className="text-[var(--text-primary)]">{entry.totalKills}</span>
                <span className="text-[var(--text-muted)]">Deaths</span>
                <span className="text-[var(--text-primary)]">{entry.totalDeaths}</span>
                <span className="text-[var(--text-muted)]">K/D</span>
                <span className="text-[var(--text-primary)]">{entry.kdRatio.toFixed(2)}</span>
                <span className="text-[var(--text-muted)]">W – L</span>
                <span className="text-[var(--text-primary)]">{entry.wins} – {entry.losses}</span>
                <span className="text-[var(--text-muted)]">W%</span>
                <span className="text-[var(--text-primary)]">{winPct}%</span>
                <span className="text-[var(--text-muted)]">Games</span>
                <span className="text-[var(--text-primary)]">{entry.gamesPlayed}</span>
                <span className="text-[var(--text-muted)]">Avg score</span>
                <span className="text-[var(--text-primary)]">{entry.avgScore > 0 ? Math.round(entry.avgScore) : '—'}</span>
              </div>
              {matchRows.length > 0 && (
                <details className="text-sm">
                  <summary className="cursor-pointer text-[var(--text-muted)] hover:text-[var(--accent)]">
                    Game-by-game
                  </summary>
                  <ul className="mt-2 space-y-1 text-[var(--text-muted)]">
                    {matchRows.map(({ match, result, kills, deaths, score }) => (
                      <li key={match.id}>
                        Match {match.matchNumber}: {match.mode} – {match.map} — {result} — {kills}/{deaths}
                        {score != null && score > 0 ? ` (${score})` : ''}
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
