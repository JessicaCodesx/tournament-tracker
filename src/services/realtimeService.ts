/**
 * Firebase Realtime Database listeners for live spectator and host sync.
 */
import { ref, onValue } from 'firebase/database'
import type { Unsubscribe } from 'firebase/database'
import { db } from '../config/firebase'
import type { Tournament } from '../types/tournament'

const TOURNAMENTS_PATH = 'tournaments'

export function subscribeToTournament(
  code: string,
  onUpdate: (tournament: Tournament | null) => void
): Unsubscribe {
  const tournamentRef = ref(db, `${TOURNAMENTS_PATH}/${code}`)
  return onValue(tournamentRef, (snapshot) => {
    onUpdate(snapshot.val() ?? null)
  })
}
