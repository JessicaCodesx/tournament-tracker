/**
 * Firebase Realtime Database CRUD for tournaments.
 */
import { ref, set, get, update } from 'firebase/database'
import { db } from '../config/firebase'
import type { Tournament } from '../types/tournament'

const TOURNAMENTS_PATH = 'tournaments'

function tournamentDbRef(code: string) {
  return ref(db, `${TOURNAMENTS_PATH}/${code}`)
}

export async function createTournament(tournament: Tournament): Promise<void> {
  await set(tournamentDbRef(tournament.code), tournament)
}

export async function getTournament(code: string): Promise<Tournament | null> {
  const snapshot = await get(tournamentDbRef(code))
  return snapshot.val() ?? null
}

export async function updateTournament(
  code: string,
  updates: Partial<Pick<Tournament, 'matches' | 'leaderboard' | 'status' | 'completed'>>
): Promise<void> {
  await update(tournamentDbRef(code), updates)
}

export async function updateMatch(
  code: string,
  matchIndex: number,
  matchUpdates: Partial<Tournament['matches'][0]>
): Promise<void> {
  const path = ref(db, `${TOURNAMENTS_PATH}/${code}/matches/${matchIndex}`)
  await update(path, matchUpdates)
}

export async function updateMatchesAndLeaderboard(
  code: string,
  matches: Tournament['matches'],
  leaderboard: Tournament['leaderboard'],
  status: Tournament['status'],
  completed?: string | null
): Promise<void> {
  const updates: Record<string, unknown> = {
    matches,
    leaderboard,
    status,
  }
  if (completed !== undefined) updates.completed = completed
  await update(tournamentDbRef(code), updates)
}
