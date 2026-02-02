/**
 * Recomputes leaderboard from match results (wins, losses, K/D, avg score, plants/defuses for S&D).
 */
import type { Match, LeaderboardEntry } from '../types/tournament'

export function calculateLeaderboard(
  playerIds: string[],
  matches: Match[]
): Record<string, LeaderboardEntry> {
  const entries: Record<string, LeaderboardEntry> = {}
  for (const id of playerIds) {
    entries[id] = {
      wins: 0,
      losses: 0,
      totalKills: 0,
      totalDeaths: 0,
      kdRatio: 0,
      avgScore: 0,
      gamesPlayed: 0,
    }
  }
  for (const m of matches) {
    if (m.status !== 'completed' || !m.winner) continue
    const winnerSet = new Set(
      m.winner === 'team1' ? m.team1 : m.winner === 'team2' ? m.team2 : m.team3 ?? []
    )
    for (const [pid, stat] of Object.entries(m.stats)) {
      if (!entries[pid]) continue
      entries[pid].gamesPlayed += 1
      entries[pid].totalKills += stat.kills
      entries[pid].totalDeaths += stat.deaths
      if (stat.plants != null) {
        entries[pid].totalPlants = (entries[pid].totalPlants ?? 0) + stat.plants
      }
      if (stat.defuses != null) {
        entries[pid].totalDefuses = (entries[pid].totalDefuses ?? 0) + stat.defuses
      }
      if (winnerSet.has(pid)) entries[pid].wins += 1
      else entries[pid].losses += 1
    }
  }
  for (const id of playerIds) {
    const e = entries[id]
    e.kdRatio = e.totalDeaths > 0 ? e.totalKills / e.totalDeaths : 0
    const scoreSum = matches
      .filter((m) => m.status === 'completed' && m.stats[id]?.score != null)
      .reduce((acc, m) => acc + (m.stats[id]?.score ?? 0), 0)
    const scoreGames = matches.filter((m) => m.status === 'completed' && m.stats[id]?.score != null).length
    e.avgScore = scoreGames > 0 ? scoreSum / scoreGames : 0
  }
  return entries
}
