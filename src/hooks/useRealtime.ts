/**
 * Firebase real-time subscription for spectator and host sync.
 */
import { useEffect, useState } from 'react'
import { subscribeToTournament } from '../services/realtimeService'
import type { Tournament } from '../types/tournament'

export function useRealtimeTournament(code: string | null): {
  tournament: Tournament | null
  loading: boolean
  error: string | null
} {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(!!code)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!code) {
      setTournament(null)
      setLoading(false)
      setError(null)
      return
    }
    setLoading(true)
    setError(null)
    const unsubscribe = subscribeToTournament(code.toUpperCase(), (data) => {
      setTournament(data)
      setLoading(false)
      setError(data === null && code ? 'Tournament not found' : null)
    })
    return () => unsubscribe()
  }, [code])

  return { tournament, loading, error }
}
