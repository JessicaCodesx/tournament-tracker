import type { Tournament, LeaderboardEntry } from '../types/tournament'

/** Format ISO date to short label (e.g. "Feb 1" or "Feb 1, 2025") */
export function formatTournamentDate(iso: string): string {
  const d = new Date(iso)
  const now = new Date()
  const sameYear = d.getFullYear() === now.getFullYear()
  return sameYear
    ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Get all unique player names from two tournaments (case-insensitive union) */
export function getPlayerNamesForComparison(t1: Tournament, t2: Tournament): string[] {
  const set = new Set<string>()
  for (const p of t1.players) set.add(p.name.trim().toLowerCase())
  for (const p of t2.players) set.add(p.name.trim().toLowerCase())
  const names = [...set]
  names.sort((a, b) => a.localeCompare(b))
  return names
}

/** Get all unique player names from N tournaments (case-insensitive union) */
export function getPlayerNamesForComparisonN(tournaments: Tournament[]): string[] {
  const set = new Set<string>()
  for (const t of tournaments) {
    for (const p of t.players) set.add(p.name.trim().toLowerCase())
  }
  const names = [...set]
  names.sort((a, b) => a.localeCompare(b))
  return names
}

/** Find leaderboard entry for a player by name in a tournament */
export function getEntryByName(
  tournament: Tournament,
  nameLower: string
): LeaderboardEntry | null {
  const player = tournament.players.find(
    (p) => p.name.trim().toLowerCase() === nameLower
  )
  if (!player) return null
  return tournament.leaderboard[player.id] ?? null
}

/** Display name: use the first occurrence from either tournament */
export function getDisplayName(
  nameLower: string,
  t1: Tournament,
  t2: Tournament
): string {
  const p1 = t1.players.find((p) => p.name.trim().toLowerCase() === nameLower)
  const p2 = t2.players.find((p) => p.name.trim().toLowerCase() === nameLower)
  return p1?.name ?? p2?.name ?? nameLower
}

/** Display name: first occurrence across N tournaments */
export function getDisplayNameN(nameLower: string, tournaments: Tournament[]): string {
  for (const t of tournaments) {
    const p = t.players.find((p) => p.name.trim().toLowerCase() === nameLower)
    if (p) return p.name
  }
  return nameLower
}

/** Aggregated leaderboard entry across tournaments (same shape as LeaderboardEntry) */
export interface CulminatingEntry extends LeaderboardEntry {
  rank: number
  displayName: string
}

/** Build one combined leaderboard from all tournaments: total stats per player, sorted by wins then K/D, top 3 ranked. */
export function buildCulminatingLeaderboard(tournaments: Tournament[]): CulminatingEntry[] {
  const nameToAggregate: Record<
    string,
    {
      displayName: string
      wins: number
      losses: number
      totalKills: number
      totalDeaths: number
      gamesPlayed: number
      totalPlants: number
      totalDefuses: number
      scoreSum: number
      scoreGames: number
    }
  > = {}

  for (const t of tournaments) {
    for (const p of t.players) {
      const nameLower = p.name.trim().toLowerCase()
      const entry = t.leaderboard[p.id]
      if (!entry) continue
      if (!nameToAggregate[nameLower]) {
        nameToAggregate[nameLower] = {
          displayName: p.name,
          wins: 0,
          losses: 0,
          totalKills: 0,
          totalDeaths: 0,
          gamesPlayed: 0,
          totalPlants: 0,
          totalDefuses: 0,
          scoreSum: 0,
          scoreGames: 0,
        }
      }
      const agg = nameToAggregate[nameLower]
      agg.wins += entry.wins
      agg.losses += entry.losses
      agg.totalKills += entry.totalKills
      agg.totalDeaths += entry.totalDeaths
      agg.gamesPlayed += entry.gamesPlayed
      agg.totalPlants += (entry.totalPlants ?? 0)
      agg.totalDefuses += (entry.totalDefuses ?? 0)
      agg.scoreSum += entry.avgScore * entry.gamesPlayed
      agg.scoreGames += entry.gamesPlayed
    }
  }

  const list = Object.entries(nameToAggregate).map(([nameLower, agg]) => ({
    nameLower,
    displayName: agg.displayName,
    wins: agg.wins,
    losses: agg.losses,
    totalKills: agg.totalKills,
    totalDeaths: agg.totalDeaths,
    kdRatio: agg.totalDeaths > 0 ? agg.totalKills / agg.totalDeaths : 0,
    avgScore: agg.scoreGames > 0 ? agg.scoreSum / agg.scoreGames : 0,
    gamesPlayed: agg.gamesPlayed,
    totalPlants: agg.totalPlants || undefined,
    totalDefuses: agg.totalDefuses || undefined,
  }))

  list.sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins
    return b.kdRatio - a.kdRatio
  })

  return list.map((e, i) => ({
    ...e,
    rank: i + 1,
  }))
}
