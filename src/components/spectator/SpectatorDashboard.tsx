/**
 * Read-only spectator view: leaderboard, current match, progress, player stats.
 */
import Card from '../common/Card'
import Leaderboard from '../shared/Leaderboard'
import CurrentMatchDisplay from '../shared/CurrentMatchDisplay'
import ProgressBar from '../shared/ProgressBar'
import PlayerStats from '../shared/PlayerStats'
import type { Tournament } from '../../types/tournament'

interface SpectatorDashboardProps {
  tournament: Tournament
  className?: string
}

export default function SpectatorDashboard({ tournament, className = '' }: SpectatorDashboardProps) {
  const currentMatch = tournament.matches.find(
    (m) => m.status === 'in-progress' || m.status === 'pending'
  )
  const completedCount = tournament.matches.filter((m) => m.status === 'completed').length
  const total = tournament.matches.length

  return (
    <div className={`space-y-5 ${className}`}>
      <Card elevated>
        <ProgressBar current={completedCount} total={total} className="mb-4" />
        <Leaderboard tournament={tournament} />
      </Card>
      {currentMatch && (
        <Card elevated>
          <p className="section-label text-[var(--text-secondary)] mb-1">Current match</p>
          <h2 className="text-title text-base text-[var(--text-primary)] mb-3">Live</h2>
          <CurrentMatchDisplay tournament={tournament} match={currentMatch} />
        </Card>
      )}
      {completedCount > 0 && (
        <Card elevated>
          <PlayerStats tournament={tournament} />
        </Card>
      )}
    </div>
  )
}
