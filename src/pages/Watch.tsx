import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useTournamentContext } from '../context/TournamentContext'
import { useRealtimeTournament } from '../hooks/useRealtime'
import JoinTournament from '../components/spectator/JoinTournament'
import SpectatorDashboard from '../components/spectator/SpectatorDashboard'
import MatchHistory from '../components/spectator/MatchHistory'
import TournamentSummary from '../components/shared/TournamentSummary'
import BracketView from '../components/shared/BracketView'
import LoadingSpinner from '../components/common/LoadingSpinner'

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
          <button type="button" onClick={() => navigate('/')} className="back-link mb-5">
            ← Home
          </button>
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
          <button type="button" onClick={() => navigate('/')} className="back-link mb-5">
            ← Home
          </button>
          <JoinTournament onJoin={handleJoin} loading={false} error={error} />
        </div>
      </div>
    )
  }

  if (!tournament) return null

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-5 sm:p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <button type="button" onClick={() => navigate('/')} className="back-link mb-5">
          ← Home
        </button>
        <p className="text-caption mb-5">
          Watching: <strong className="text-[var(--text-primary)]">{tournament.code}</strong>
        </p>
        <div className="mb-8">
          <BracketView tournament={tournament} />
        </div>
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
