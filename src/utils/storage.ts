/**
 * localStorage helpers for recent tournaments and offline backup.
 */
const KEY_CURRENT = 'currentTournamentCode'
const KEY_RECENT = 'recentTournaments'

export function getCurrentTournamentCode(): string | null {
  return localStorage.getItem(KEY_CURRENT)
}

export function setCurrentTournamentCode(code: string): void {
  localStorage.setItem(KEY_CURRENT, code)
}

export function clearCurrentTournamentCode(): void {
  localStorage.removeItem(KEY_CURRENT)
}

export interface RecentTournament {
  code: string
  date: string
  players: { id: string; name: string }[]
}

export function getRecentTournaments(): RecentTournament[] {
  try {
    const raw = localStorage.getItem(KEY_RECENT)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function addRecentTournament(entry: RecentTournament): void {
  const list = getRecentTournaments().filter((t) => t.code !== entry.code)
  list.unshift(entry)
  localStorage.setItem(KEY_RECENT, JSON.stringify(list.slice(0, 20)))
}
