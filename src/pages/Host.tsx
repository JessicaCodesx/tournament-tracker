/**
 * Host flow: setup → share code → current match → stat entry → summary.
 * Syncs with Firebase realtime so spectators see updates.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTournamentContext } from '../context/TournamentContext'
import { useRealtimeTournament } from '../hooks/useRealtime'
import { useTournamentActions } from '../hooks/useTournament'
import { updateMatch } from '../services/tournamentService'
import TournamentSetup from '../components/host/TournamentSetup'
import ShareCode from '../components/host/ShareCode'
import CurrentMatch from '../components/host/CurrentMatch'
import StatEntry from '../components/host/StatEntry'
import Leaderboard from '../components/shared/Leaderboard'
import TournamentSummary from '../components/shared/TournamentSummary'
import Button from '../components/common/Button'
import type { TournamentFormat } from '../types/tournament'
import type { Player } from '../types/tournament'

type Phase = 'setup' | 'share' | 'match' | 'statEntry' | 'summary'

export default function Host() {
  const navigate = useNavigate()
  const { code, setCode, tournament, setTournament, clearTournament } = useTournamentContext()
  const { tournament: liveTournament } = useRealtimeTournament(code)
  const { createTournament, submitMatchResults } = useTournamentActions()

  const [phase, setPhase] = useState<Phase>('setup')
  const [matchIndex, setMatchIndex] = useState(0)
  const [generating, setGenerating] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const t = liveTournament ?? tournament

  useEffect(() => {
    if (liveTournament) setTournament(liveTournament)
  }, [liveTournament, setTournament])

  const handleGenerate = async (players: Player[], format: TournamentFormat) => {
    setGenerating(true)
    try {
      const created = await createTournament(players, format)
      setTournament(created)
      setCode(created.code)
      setPhase('share')
    } finally {
      setGenerating(false)
    }
  }

  const handleStartTournament = () => {
    setMatchIndex(0)
    setPhase('match')
  }

  const handleStartMatch = async () => {
    if (!code || !t) return
    const match = t.matches[matchIndex]
    if (!match || match.status !== 'pending') return
    await updateMatch(code, matchIndex, { status: 'in-progress' })
  }

  const handleMatchComplete = () => {
    setPhase('statEntry')
  }

  const handleStatBack = () => {
    setPhase('match')
  }

  const handleStatSubmit = async (
    winner: 'team1' | 'team2' | 'team3',
    stats: Record<string, { kills: number; deaths: number; score?: number }>
  ) => {
    if (!code) return
    setSubmitting(true)
    try {
      const updated = await submitMatchResults(code, matchIndex, winner, stats)
      if (updated) setTournament(updated)
      const nextIndex = matchIndex + 1
      if (nextIndex >= (t?.matches.length ?? 0)) {
        setPhase('summary')
      } else {
        setMatchIndex(nextIndex)
        setPhase('match')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleNewTournament = () => {
    clearTournament()
    setPhase('setup')
    setMatchIndex(0)
  }

  const handleViewResults = () => {
    if (code) navigate(`/watch/${code}`)
  }

  if (phase === 'setup') {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" className="mb-4" onClick={() => navigate('/')}>
            ← Home
          </Button>
          <TournamentSetup onGenerate={handleGenerate} generating={generating} />
        </div>
      </div>
    )
  }

  if (phase === 'share' && t) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8">
        <div className="max-w-lg mx-auto">
          <Button variant="ghost" className="mb-4" onClick={() => navigate('/')}>
            ← Home
          </Button>
          <ShareCode code={t.code} onStart={handleStartTournament} />
        </div>
      </div>
    )
  }

  if (phase === 'match' && t && t.matches[matchIndex]) {
    const match = t.matches[matchIndex]
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" className="mb-4" onClick={() => navigate('/')}>
            ← Home
          </Button>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CurrentMatch
                tournament={t}
                match={match}
                matchIndex={matchIndex}
                onStartMatch={handleStartMatch}
                onMatchComplete={handleMatchComplete}
              />
            </div>
            <div>
              <Leaderboard tournament={t} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (phase === 'statEntry' && t && t.matches[matchIndex]) {
    const match = t.matches[matchIndex]
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" className="mb-4" onClick={handleStatBack}>
            ← Back to match
          </Button>
          <StatEntry
            tournament={t}
            match={match}
            matchIndex={matchIndex}
            onBack={handleStatBack}
            onSubmit={handleStatSubmit}
            submitting={submitting}
          />
        </div>
      </div>
    )
  }

  if (phase === 'summary' && t) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8">
        <div className="max-w-lg mx-auto">
          <Button variant="ghost" className="mb-4" onClick={() => navigate('/')}>
            ← Home
          </Button>
          <TournamentSummary tournament={t} className="mb-6" />
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleNewTournament}>Start New Tournament</Button>
            <Button variant="secondary" onClick={handleViewResults}>
              View / Share Results
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
