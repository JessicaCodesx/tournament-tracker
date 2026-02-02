/**
 * Quick stat entry: select winner, enter stats per player.
 * Scoreboard fields autopopulate by gamemode: S&D = K, D, Plants, Defuses; Hardpoint/Control = K, D, Score.
 */
import { useState, useCallback, useMemo } from 'react'
import Button from '../common/Button'
import Card from '../common/Card'
import { getColumnsForMode, isSearchAndDestroy } from '../../utils/scoreboardColumns'
import type { Tournament, Match, MatchStat } from '../../types/tournament'
import type { StatFieldKey } from '../../utils/scoreboardColumns'

interface StatEntryProps {
  tournament: Tournament
  match: Match
  matchIndex: number
  onBack: () => void
  onSubmit: (winner: 'team1' | 'team2' | 'team3', stats: Record<string, MatchStat>) => void
  submitting?: boolean
}

function allPlayerIds(match: Match): string[] {
  const set = new Set([...match.team1, ...match.team2, ...(match.team3 ?? [])])
  return [...set]
}

/** Player IDs in display order: Team 1, then Team 2, then Team 3 (for 2v2v2). */
function playerIdsByTeam(match: Match): string[] {
  return [...match.team1, ...match.team2, ...(match.team3 ?? [])]
}

/** Team label for the first player of each team (others get null). */
function getTeamLabelForPlayer(match: Match, indexInOrder: number): string | null {
  const t1Len = match.team1.length
  const t2Len = match.team2.length
  if (indexInOrder === 0) return 'Team 1'
  if (indexInOrder === t1Len) return 'Team 2'
  if (match.team3 && indexInOrder === t1Len + t2Len) return 'Team 3'
  return null
}

/** Default stat for a mode: only the fields we collect for that mode (avoids showing wrong columns). */
function getDefaultStatForMode(columns: { key: StatFieldKey }[]): MatchStat {
  const stat: MatchStat = { kills: 0, deaths: 0 }
  for (const col of columns) {
    if (col.key === 'score') stat.score = 0
    if (col.key === 'plants') stat.plants = 0
    if (col.key === 'defuses') stat.defuses = 0
  }
  return stat
}

const inputClass =
  'w-full min-w-12 min-h-[var(--touch-min)] px-3 py-2 text-base rounded-[var(--radius-sm)] bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] transition-colors duration-[var(--transition-fast)]'

export default function StatEntry({
  tournament,
  match,
  matchIndex: _matchIndex,
  onBack,
  onSubmit,
  submitting,
}: StatEntryProps) {
  const playerIds = allPlayerIds(match)
  const playerIdsOrdered = playerIdsByTeam(match)
  const columns = useMemo(() => getColumnsForMode(match.mode), [match.mode])
  const defaultStat = useMemo(() => getDefaultStatForMode(columns), [columns])
  const [winner, setWinner] = useState<'team1' | 'team2' | 'team3' | null>(null)
  const [stats, setStats] = useState<Record<string, MatchStat>>(
    () => Object.fromEntries(playerIds.map((id) => [id, { ...defaultStat }]))
  )

  const updateStat = useCallback((playerId: string, field: StatFieldKey, value: number) => {
    setStats((prev) => ({
      ...prev,
      [playerId]: { ...prev[playerId], [field]: value },
    }))
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!winner) return
    const isSnd = isSearchAndDestroy(match.mode)
    const out: Record<string, MatchStat> = {}
    for (const id of playerIds) {
      const s = stats[id] ?? { ...defaultStat }
      out[id] = {
        kills: s.kills ?? 0,
        deaths: s.deaths ?? 0,
        ...(columns.some((c) => c.key === 'score') && { score: s.score ?? 0 }),
        ...(isSnd && { plants: s.plants ?? 0, defuses: s.defuses ?? 0 }),
      }
    }
    onSubmit(winner, out)
  }

  const team1Label = 'Team 1'
  const team2Label = 'Team 2'
  const team3Label = match.team3 ? 'Team 3' : null

  return (
    <Card elevated>
      <p className="section-label text-[var(--accent)] mb-1">Match results</p>
      <h2 className="text-title text-xl text-[var(--text-primary)] mb-2">Enter stats</h2>
      <p className="text-caption mb-4">
        <span className="text-[var(--text-secondary)]">{match.mode}</span>
        {' — '}Select the winning team and enter:{' '}
        {columns.map((c) => c.label).join(', ')} for each player.
      </p>
      <div className="flex flex-wrap gap-2 mb-5">
        <Button
          variant={winner === 'team1' ? 'primary' : 'secondary'}
          onClick={() => setWinner('team1')}
        >
          {team1Label}
        </Button>
        <Button
          variant={winner === 'team2' ? 'primary' : 'secondary'}
          onClick={() => setWinner('team2')}
        >
          {team2Label}
        </Button>
        {team3Label && (
          <Button
            variant={winner === 'team3' ? 'primary' : 'secondary'}
            onClick={() => setWinner('team3')}
          >
            {team3Label}
          </Button>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto -mx-1 rounded-[var(--radius-md)] border border-[var(--border-subtle)] overflow-hidden min-w-0">
          <table className="w-full text-sm min-w-[280px]">
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
              {playerIdsOrdered.map((id, idx) => {
                const teamLabel = getTeamLabelForPlayer(match, idx)
                const player = tournament.players.find((p) => p.id === id)
                const s = stats[id] ?? { ...defaultStat }
                return (
                  <tr
                    key={id}
                    className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-card-hover)] transition-colors duration-[var(--transition-fast)]"
                  >
                    <td className="py-2.5 px-3 font-medium text-[var(--text-primary)]">
                      {teamLabel != null ? (
                        <span className="block">
                          <span className="text-[var(--text-muted)] text-xs font-medium uppercase tracking-wide">
                            {teamLabel}
                          </span>
                          <span className="text-[var(--text-primary)]">{player?.name ?? id}</span>
                        </span>
                      ) : (
                        player?.name ?? id
                      )}
                    </td>
                    {columns.map((col) => (
                      <td key={col.key} className="py-2.5 px-3">
                        <input
                          type="number"
                          inputMode="numeric"
                          min={0}
                          className={inputClass}
                          value={Number(s[col.key as keyof MatchStat]) || 0}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            updateStat(id, col.key, parseInt(e.target.value, 10) || 0)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap gap-3 mt-5">
          <Button type="button" variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={!winner || submitting}>
            {submitting ? 'Submitting…' : 'Submit Results'}
          </Button>
        </div>
      </form>
    </Card>
  )
}
