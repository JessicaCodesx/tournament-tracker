import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useTournamentContext } from '../context/TournamentContext'
import { useRealtimeTournament } from '../hooks/useRealtime'
import JoinTournament from '../components/spectator/JoinTournament'
import SpectatorDashboard from '../components/spectator/SpectatorDashboard'
import MatchHistory from '../components/spectator/MatchHistory'
import TournamentSummary from '../components/shared/TournamentSummary'
import LoadingSpinner from '../components/common/LoadingSpinner'
import Button from '../components/common/Button'

export default function Watch() {
  const { code: urlCode } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const { code, setCode, setTournament } = useTournamentContext()
  const watchCode = urlCode ?? code
  const { tournament, loading, error } = useRealtimeTournament(watchCode)

  useEffect(() => {
    if (urlCode) setCode(urlCode.toUpperCase())
  }, [urlCode, setCode])

  useEffect(() => {
    setTournament(tournament)
  }, [tournament, setTournament])

  const handleJoin = (newCode: string) => {
    setCode(newCode)
    navigate(`/watch/${newCode}`)
  }

  if (!watchCode) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-5 sm:p-6 md:p-8">
        <div className="max-w-md mx-auto">
          <Button variant="ghost" className="mb-4 min-h-0 py-2" onClick={() => navigate('/')}>
            ← Home
          </Button>
          <JoinTournament onJoin={handleJoin} loading={false} error={null} />
        </div>
      </div>
    )
  }

  if (loading && !tournament) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (error && !tournament) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-5 sm:p-6 md:p-8">
        <div className="max-w-md mx-auto">
          <Button variant="ghost" className="mb-4 min-h-0 py-2" onClick={() => navigate('/')}>
            ← Home
          </Button>
          <JoinTournament onJoin={handleJoin} loading={false} error={error} />
        </div>
      </div>
    )
  }

  if (!tournament) return null

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-5 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" className="mb-4 min-h-0 py-2" onClick={() => navigate('/')}>
          ← Home
        </Button>
        <p className="text-sm text-[var(--text-muted)] mb-4">
          Watching: <strong className="text-[var(--text-primary)]">{tournament.code}</strong>
        </p>
        {tournament.status === 'completed' ? (
          <>
            <TournamentSummary tournament={tournament} className="mb-6" />
            <MatchHistory tournament={tournament} />
          </>
        ) : (
          <>
            <SpectatorDashboard tournament={tournament} className="mb-6" />
            <MatchHistory tournament={tournament} />
          </>
        )}
      </div>
    </div>
  )
}
