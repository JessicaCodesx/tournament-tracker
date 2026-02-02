/**
 * Core tournament and match types for the CoD Tournament Tracker.
 */

export type TournamentFormat = '3v3' | '2v2v2'

export interface Player {
  id: string
  name: string
}

export type MatchStatus = 'pending' | 'in-progress' | 'completed'

/** Per-player stats for a match. Fields vary by mode (S&D: plants/defuses; HP/Control: score). */
export interface MatchStat {
  kills: number
  deaths: number
  score?: number
  plants?: number
  defuses?: number
}

export interface Match {
  id: string
  matchNumber: number
  team1: string[]
  team2: string[]
  team3?: string[]
  map: string
  mode: string
  status: MatchStatus
  winner: 'team1' | 'team2' | 'team3' | null
  stats: Record<string, MatchStat>
  timestamp?: string
}

export interface LeaderboardEntry {
  wins: number
  losses: number
  totalKills: number
  totalDeaths: number
  kdRatio: number
  avgScore: number
  gamesPlayed: number
  totalPlants?: number
  totalDefuses?: number
}

export type TournamentStatus = 'setup' | 'in-progress' | 'completed'

export interface Tournament {
  id: string
  code: string
  created: string
  format: TournamentFormat
  players: Player[]
  matches: Match[]
  leaderboard: Record<string, LeaderboardEntry>
  status: TournamentStatus
  completed?: string | null
}
