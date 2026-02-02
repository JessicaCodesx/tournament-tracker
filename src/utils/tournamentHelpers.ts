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
