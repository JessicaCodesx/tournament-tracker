import type { Tournament } from '../types/tournament'

export function teamNames(tournament: Tournament, teamIds: string[]): string {
  return teamIds
    .map((id) => tournament.players.find((p) => p.id === id)?.name ?? id)
    .join(', ')
}

export function getCurrentMatchIndex(tournament: Tournament): number {
  const i = tournament.matches.findIndex(
    (m) => m.status === 'pending' || m.status === 'in-progress'
  )
  return i >= 0 ? i : tournament.matches.length - 1
}

/** Current win streak: consecutive wins from the most recent completed match backwards. */
export function getWinStreak(tournament: Tournament, playerId: string): number {
  const completed = tournament.matches
    .filter((m) => m.status === 'completed' && m.winner)
    .sort((a, b) => b.matchNumber - a.matchNumber)
  let streak = 0
  for (const m of completed) {
    const winnerIds = m.winner === 'team1' ? m.team1 : m.winner === 'team2' ? m.team2 : (m.team3 ?? [])
    if (winnerIds.includes(playerId)) streak++
    else break
  }
  return streak
}
