/**
 * Generates all unique team matchups for 6 players.
 * 3v3: C(6,3)/2 = 10 matches. 2v2v2: three teams of 2 per match.
 */
import type { TournamentFormat } from '../types/tournament'

function combinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]]
  if (k > arr.length) return []
  const [first, ...rest] = arr
  const withFirst = combinations(rest, k - 1).map((c) => [first, ...c])
  const withoutFirst = combinations(rest, k)
  return [...withFirst, ...withoutFirst]
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Returns all unique 3v3 matchups: team1 vs team2 (no duplicate pairings). */
export function generate3v3Matchups(playerIds: string[]): [string[], string[]][] {
  const combos = combinations(playerIds, 3)
  const matchups: [string[], string[]][] = []
  const seen = new Set<string>()
  for (const team1 of combos) {
    const team2 = playerIds.filter((id) => !team1.includes(id))
    const key = [team1.sort().join(','), team2.sort().join(',')].sort().join('|')
    if (!seen.has(key)) {
      seen.add(key)
      matchups.push([team1, team2])
    }
  }
  return shuffle(matchups)
}

/** Returns 2v2v2 matchups: each match has 3 teams of 2. More variety, many matches. */
export function generate2v2v2Matchups(playerIds: string[]): [string[], string[], string[]][] {
  const pairs = combinations(playerIds, 2)
  const matchups: [string[], string[], string[]][] = []
  const used = new Set<string>()
  for (const teamA of pairs) {
    const remaining1 = playerIds.filter((id) => !teamA.includes(id))
    for (let i = 0; i < remaining1.length; i++) {
      for (let j = i + 1; j < remaining1.length; j++) {
        const teamB = [remaining1[i], remaining1[j]]
        const teamC = remaining1.filter((id) => !teamB.includes(id))
        const key = [teamA, teamB, teamC].map((t) => t.slice().sort().join(',')).sort().join('|')
        if (!used.has(key)) {
          used.add(key)
          matchups.push([teamA, teamB, teamC])
        }
      }
    }
  }
  return shuffle(matchups)
}

export function generateMatchups(
  playerIds: string[],
  format: TournamentFormat
): [string[], string[], string[] | undefined][] {
  if (format === '3v3') {
    return generate3v3Matchups(playerIds).map(([t1, t2]) => [t1, t2, undefined])
  }
  return generate2v2v2Matchups(playerIds).map(([t1, t2, t3]) => [t1, t2, t3])
}
