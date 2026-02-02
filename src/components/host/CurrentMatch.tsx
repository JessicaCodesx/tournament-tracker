/**
 * Host view of current match: map/mode, teams, Start Match / Match Complete.
 */
import Button from '../common/Button'
import Card from '../common/Card'
import CurrentMatchDisplay from '../shared/CurrentMatchDisplay'
import ProgressBar from '../shared/ProgressBar'
import type { Tournament, Match } from '../../types/tournament'

interface CurrentMatchProps {
  tournament: Tournament
  match: Match
  matchIndex: number
  onStartMatch: () => void
  onMatchComplete: () => void
}

export default function CurrentMatch({
  tournament,
  match,
  matchIndex,
  onStartMatch,
  onMatchComplete,
}: CurrentMatchProps) {
  const total = tournament.matches.length

  return (
    <Card elevated>
      <ProgressBar current={matchIndex + 1} total={total} className="mb-5" />
      <p className="section-label text-[var(--text-secondary)] mb-1">Current match</p>
      <h2 className="text-title text-lg text-[var(--text-primary)] mb-4">
        Match {match.matchNumber} of {total}
      </h2>
      <CurrentMatchDisplay tournament={tournament} match={match} className="mb-5" />
      <div className="flex flex-wrap gap-3">
        {match.status === 'pending' && (
          <Button onClick={onStartMatch}>Start Match</Button>
        )}
        {(match.status === 'pending' || match.status === 'in-progress') && (
          <Button variant="primary" onClick={onMatchComplete}>
            Match Complete — Enter Stats
          </Button>
        )}
      </div>
    </Card>
  )
}
