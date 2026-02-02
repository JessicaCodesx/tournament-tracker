/**
 * Single-match scoreboard for the match detail modal. Columns per mode (S&D: plants/defuses; HP/Control: score).
 */
import type { Tournament, Match, MatchStat } from '../../types/tournament'
import { teamNames } from '../../utils/tournamentHelpers'
import { getColumnsForMode } from '../../utils/scoreboardColumns'

interface MatchDetailModalContentProps {
  tournament: Tournament
  match: Match
}

function getStatValue(stat: MatchStat | undefined, key: string): number | undefined {
  if (!stat) return undefined
  const v = stat[key as keyof MatchStat]
  return typeof v === 'number' ? v : undefined
}

export default function MatchDetailModalContent({ tournament, match }: MatchDetailModalContentProps) {
  const allPlayerIds = [...match.team1, ...match.team2, ...(match.team3 ?? [])]
  const columns = getColumnsForMode(match.mode)
  const t1 = teamNames(tournament, match.team1)
  const t2 = teamNames(tournament, match.team2)
  const t3 = match.team3 ? teamNames(tournament, match.team3) : null

  return (
    <div className="space-y-4">
      <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
        <p className="text-caption text-[var(--accent)] mb-1">Match {match.matchNumber}</p>
        <p className="font-semibold text-[var(--text-primary)] mb-2">
          {match.mode} · {match.map}
        </p>
        <p className="text-sm text-[var(--text-secondary)]">
          {t1} vs {t2}
          {t3 != null ? ` vs ${t3}` : ''}
        </p>
        {match.winner && (
          <p className="mt-2 text-sm font-medium text-[var(--accent)]">
            Winner: Team {match.winner.replace('team', '')}
          </p>
        )}
      </div>
      <div>
        <h4 className="section-label text-[var(--text-secondary)] mb-2">Scoreboard</h4>
        <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border-default)] bg-[var(--bg-elevated)]">
                <th className="section-label py-3 px-3 text-left text-[var(--text-muted)]">Player</th>
                {columns.map((col) => (
                  <th key={col.key} className="section-label py-3 px-3 text-left text-[var(--text-muted)]">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allPlayerIds.map((id) => {
                const player = tournament.players.find((p) => p.id === id)
                const stat = match.stats[id]
                return (
                  <tr key={id} className="border-b border-[var(--border-subtle)] last:border-0">
                    <td className="py-2.5 px-3 font-medium text-[var(--text-primary)]">
                      {player?.name ?? id}
                    </td>
                    {columns.map((col) => {
                      const val = getStatValue(stat, col.key)
                      return (
                        <td key={col.key} className="py-2.5 px-3 tabular-nums text-[var(--text-secondary)]">
                          {val != null ? val : '—'}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
