/**
 * Single-player stats for the player stats modal.
 */
import type { Tournament, LeaderboardEntry, Match } from '../../types/tournament'

interface PlayerStatsModalContentProps {
  tournament: Tournament
  playerId: string
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

export default function PlayerStatsModalContent({ tournament, playerId }: PlayerStatsModalContentProps) {
  const player = tournament.players.find((p) => p.id === playerId)
  const entry = tournament.leaderboard[playerId] as LeaderboardEntry | undefined
  if (!player || !entry) return null

  const winPct = entry.gamesPlayed > 0 ? Math.round((entry.wins / entry.gamesPlayed) * 100) : 0
  const matchRows = getPlayerMatches(tournament, playerId)

  return (
    <div className="space-y-4">
      <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
        <h3 className="text-subtitle text-[var(--text-primary)] mb-3">{player.name}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-sm">
          <span className="text-caption">Kills</span>
          <span className="font-semibold tabular-nums">{entry.totalKills}</span>
          <span className="text-caption">Deaths</span>
          <span className="font-semibold tabular-nums">{entry.totalDeaths}</span>
          <span className="text-caption">K/D</span>
          <span className="font-semibold tabular-nums">{entry.kdRatio.toFixed(2)}</span>
          <span className="text-caption">W – L</span>
          <span className="font-semibold">{entry.wins} – {entry.losses}</span>
          <span className="text-caption">W%</span>
          <span className="font-semibold">{winPct}%</span>
          <span className="text-caption">Games</span>
          <span className="font-semibold">{entry.gamesPlayed}</span>
          <span className="text-caption">Avg score</span>
          <span className="font-semibold">{entry.avgScore > 0 ? Math.round(entry.avgScore) : '—'}</span>
          {(entry.totalPlants != null && entry.totalPlants > 0) && (
            <>
              <span className="text-caption">Plants</span>
              <span className="font-semibold">{entry.totalPlants}</span>
            </>
          )}
          {(entry.totalDefuses != null && entry.totalDefuses > 0) && (
            <>
              <span className="text-caption">Defuses</span>
              <span className="font-semibold">{entry.totalDefuses}</span>
            </>
          )}
        </div>
      </div>
      {matchRows.length > 0 && (
        <div>
          <h4 className="section-label text-[var(--text-secondary)] mb-2">Game-by-game</h4>
          <ul className="space-y-1.5 text-sm">
            {matchRows.map(({ match, result, kills, deaths, score, plants, defuses }) => (
              <li
                key={match.id}
                className="flex flex-wrap items-center gap-2 py-2 border-b border-[var(--border-subtle)] last:border-0 text-[var(--text-secondary)]"
              >
                <span className="font-medium text-[var(--text-primary)]">Match {match.matchNumber}</span>
                <span className="text-[var(--text-muted)]">{match.mode} · {match.map}</span>
                <span className={result === 'W' ? 'text-emerald-400' : 'text-amber-400/90'}>{result}</span>
                <span>{kills}/{deaths}</span>
                {score != null && score > 0 && <span>({score})</span>}
                {((plants != null && plants > 0) || (defuses != null && defuses > 0)) && (
                  <span className="text-[var(--text-muted)]">P:{plants ?? 0} D:{defuses ?? 0}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
