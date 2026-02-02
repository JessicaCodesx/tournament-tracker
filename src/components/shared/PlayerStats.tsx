/**
 * Per-player stats: totals, K/D, W/L, games entered, and match-by-match breakdown.
 */
import type { Tournament, LeaderboardEntry, Match } from '../../types/tournament'

interface PlayerStatsProps {
  tournament: Tournament
  className?: string
}

function getPlayerMatches(tournament: Tournament, playerId: string): { match: Match; result: 'W' | 'L'; kills: number; deaths: number; score?: number; plants?: number; defuses?: number }[] {
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
        plants: stat.plants,
        defuses: stat.defuses,
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
      <h2 className="text-title text-base text-[var(--text-primary)] mb-1">Player stats</h2>
      <p className="text-caption mb-4">
        Stats from {completedCount} game{completedCount !== 1 ? 's' : ''} entered.
      </p>
      <div className="space-y-3">
        {entries.map(({ player, entry }) => {
          const winPct = entry.gamesPlayed > 0 ? Math.round((entry.wins / entry.gamesPlayed) * 100) : 0
          const matchRows = getPlayerMatches(tournament, player.id)
          return (
            <div
              key={player.id}
              className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 transition-colors duration-[var(--transition-fast)] hover:border-[var(--border-default)]"
            >
              <h3 className="text-subtitle text-[var(--text-primary)] mb-3">{player.name}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm mb-3">
                <span className="text-caption">Kills</span>
                <span className="font-medium tabular-nums text-[var(--text-primary)]">{entry.totalKills}</span>
                <span className="text-caption">Deaths</span>
                <span className="font-medium tabular-nums text-[var(--text-primary)]">{entry.totalDeaths}</span>
                <span className="text-caption">K/D</span>
                <span className="font-medium tabular-nums text-[var(--text-primary)]">{entry.kdRatio.toFixed(2)}</span>
                <span className="text-caption">W – L</span>
                <span className="font-medium text-[var(--text-primary)]">{entry.wins} – {entry.losses}</span>
                <span className="text-caption">W%</span>
                <span className="font-medium text-[var(--text-primary)]">{winPct}%</span>
                <span className="text-caption">Games</span>
                <span className="font-medium text-[var(--text-primary)]">{entry.gamesPlayed}</span>
                <span className="text-caption">Avg score</span>
                <span className="font-medium text-[var(--text-primary)]">{entry.avgScore > 0 ? Math.round(entry.avgScore) : '—'}</span>
                {(entry.totalPlants != null && entry.totalPlants > 0) && (
                  <>
                    <span className="text-caption">Plants</span>
                    <span className="font-medium text-[var(--text-primary)]">{entry.totalPlants}</span>
                  </>
                )}
                {(entry.totalDefuses != null && entry.totalDefuses > 0) && (
                  <>
                    <span className="text-caption">Defuses</span>
                    <span className="font-medium text-[var(--text-primary)]">{entry.totalDefuses}</span>
                  </>
                )}
              </div>
              {matchRows.length > 0 && (
                <details className="group">
                  <summary className="text-caption cursor-pointer hover:text-[var(--accent)] transition-colors duration-[var(--transition-fast)] list-none [&::-webkit-details-marker]:hidden">
                    <span className="inline-flex items-center gap-1.5">Game-by-game</span>
                  </summary>
                  <ul className="mt-2 space-y-1 text-caption text-[var(--text-secondary)]">
                    {matchRows.map(({ match, result, kills, deaths, score, plants, defuses }) => (
                      <li key={match.id}>
                        Match {match.matchNumber}: {match.mode} – {match.map} — {result} — {kills}/{deaths}
                        {score != null && score > 0 ? ` · ${score}` : ''}
                        {(plants != null && plants > 0) || (defuses != null && defuses > 0)
                          ? ` · P:${plants ?? 0} D:${defuses ?? 0}`
                          : ''}
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
