/**
 * Tournament operations: create, load, submit match results.
 */
import { useCallback } from 'react'
import { createTournament as createTournamentDb, getTournament as getTournamentDb, updateTournament as updateTournamentDb, updateMatchesAndLeaderboard } from '../services/tournamentService'
import { generateTournamentCode } from '../utils/codeGenerator'
import { generateMatchups } from '../utils/teamGenerator'
import { assignMapsAndModes } from '../utils/mapModeSelector'
import { calculateLeaderboard } from '../utils/leaderboardCalculator'
import { setCurrentTournamentCode, addRecentTournament } from '../utils/storage'
import type { Tournament, Player, TournamentFormat, Match, MatchStat } from '../types/tournament'

export function useTournamentActions() {
  const createTournament = useCallback(
    async (players: Player[], format: TournamentFormat): Promise<Tournament> => {
      const code = generateTournamentCode()
      const playerIds = players.map((p) => p.id)
      const matchups = generateMatchups(playerIds, format)
      const mapModes = assignMapsAndModes(matchups.length)
      const matches = matchups.map(([team1, team2, team3], i): Match => {
        const match: Match = {
          id: `m${i + 1}`,
          matchNumber: i + 1,
          team1,
          team2,
          map: mapModes[i].map,
          mode: mapModes[i].mode,
          status: 'pending',
          winner: null,
          stats: {},
        }
        if (team3 !== undefined) match.team3 = team3
        return match
      })
      const allPlayerIds = playerIds
      const leaderboard = Object.fromEntries(
        allPlayerIds.map((id) => [
          id,
          {
            wins: 0,
            losses: 0,
            totalKills: 0,
            totalDeaths: 0,
            kdRatio: 0,
            avgScore: 0,
            gamesPlayed: 0,
          },
        ])
      )
      const tournament: Tournament = {
        id: `tournament_${Date.now()}`,
        code,
        created: new Date().toISOString(),
        format,
        players,
        matches,
        leaderboard,
        status: 'in-progress',
        completed: null,
      }
      await createTournamentDb(tournament)
      setCurrentTournamentCode(code)
      addRecentTournament({
        code,
        date: tournament.created.slice(0, 10),
        players,
      })
      return tournament
    },
    []
  )

  const loadTournament = useCallback(async (code: string): Promise<Tournament | null> => {
    return getTournamentDb(code.toUpperCase())
  }, [])

  const regenerateMapsAndModes = useCallback(async (tournamentCode: string): Promise<Tournament | null> => {
    const t = await getTournamentDb(tournamentCode)
    if (!t) return null
    const mapModes = assignMapsAndModes(t.matches.length)
    const matches = t.matches.map((m, i) => ({
      ...m,
      map: mapModes[i].map,
      mode: mapModes[i].mode,
    }))
    await updateTournamentDb(tournamentCode, { matches })
    return { ...t, matches }
  }, [])

  const submitMatchResults = useCallback(
    async (
      tournamentCode: string,
      matchIndex: number,
      winner: 'team1' | 'team2' | 'team3',
      stats: Record<string, MatchStat>
    ): Promise<Tournament | null> => {
      const t = await getTournamentDb(tournamentCode)
      if (!t) return null
      const matches = [...t.matches]
      const m = matches[matchIndex]
      if (!m) return null
      matches[matchIndex] = {
        ...m,
        status: 'completed',
        winner,
        stats,
        timestamp: new Date().toISOString(),
      }
      const allPlayerIds = t.players.map((p) => p.id)
      const leaderboard = calculateLeaderboard(allPlayerIds, matches)
      const allComplete = matches.every((match) => match.status === 'completed')
      const status = allComplete ? 'completed' : 'in-progress'
      const completed = allComplete ? new Date().toISOString() : null
      await updateMatchesAndLeaderboard(tournamentCode, matches, leaderboard, status, completed)
      return { ...t, matches, leaderboard, status, completed }
    },
    []
  )

  return { createTournament, loadTournament, submitMatchResults, regenerateMapsAndModes }
}
