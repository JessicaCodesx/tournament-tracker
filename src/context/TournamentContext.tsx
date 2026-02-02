/**
 * Global tournament state for host and spectator flows.
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Tournament } from '../types/tournament'

interface TournamentContextValue {
  tournament: Tournament | null
  setTournament: (t: Tournament | null) => void
  code: string | null
  setCode: (c: string | null) => void
  clearTournament: () => void
}

const TournamentContext = createContext<TournamentContextValue | null>(null)

export function TournamentProvider({ children }: { children: ReactNode }) {
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [code, setCode] = useState<string | null>(null)
  const clearTournament = useCallback(() => {
    setTournament(null)
    setCode(null)
  }, [])
  return (
    <TournamentContext.Provider
      value={{
        tournament,
        setTournament,
        code,
        setCode,
        clearTournament,
      }}
    >
      {children}
    </TournamentContext.Provider>
  )
}

export function useTournamentContext() {
  const ctx = useContext(TournamentContext)
  if (!ctx) throw new Error('useTournamentContext must be used within TournamentProvider')
  return ctx
}
