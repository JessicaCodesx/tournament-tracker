/**
 * Full bracket experience: player list sidebar, bracket grid, player stats modal, match detail modal.
 */
import { useState } from 'react'
import Bracket from './Bracket'
import Modal from '../common/Modal'
import PlayerStatsModalContent from './PlayerStatsModalContent'
import MatchDetailModalContent from './MatchDetailModalContent'
import { getCurrentMatchIndex, getWinStreak } from '../../utils/tournamentHelpers'
import type { Tournament, Match } from '../../types/tournament'

interface BracketViewProps {
  tournament: Tournament
  currentMatchIndex?: number
  onMatchClick?: (match: Match, index: number) => void
  className?: string
}

export default function BracketView({
  tournament,
  currentMatchIndex: currentMatchIndexProp,
  onMatchClick,
  className = '',
}: BracketViewProps) {
  const derivedCurrent = getCurrentMatchIndex(tournament)
  const currentMatchIndex = currentMatchIndexProp ?? derivedCurrent

  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  const handleMatchClick = (match: Match, index: number) => {
    setSelectedMatch(match)
    onMatchClick?.(match, index)
  }

  return (
    <div className={`flex flex-col lg:flex-row gap-6 ${className}`}>
      {/* Player list sidebar */}
      <aside className="lg:w-48 shrink-0">
        <h2 className="text-title text-base text-[var(--text-primary)] mb-2">Players</h2>
        <p className="text-caption mb-3">Click a player for stats</p>
        <ul className="space-y-1">
          {tournament.players
            .slice()
            .sort((a, b) => (a.name < b.name ? -1 : 1))
            .map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setSelectedPlayerId(p.id)}
                  className="w-full text-left px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent)]/40 hover:bg-[var(--bg-card-hover)] transition-colors duration-[var(--transition-fast)]"
                >
                  {p.name}
                  {getWinStreak(tournament, p.id) >= 3 && (
                    <span className="ml-1" aria-hidden>🔥</span>
                  )}
                </button>
              </li>
            ))}
        </ul>
      </aside>

      {/* Bracket grid */}
      <div className="flex-1 min-w-0">
        <Bracket
          tournament={tournament}
          currentMatchIndex={currentMatchIndex}
          onMatchClick={handleMatchClick}
        />
      </div>

      {/* Player stats modal */}
      <Modal
        isOpen={!!selectedPlayerId}
        onClose={() => setSelectedPlayerId(null)}
        title={selectedPlayerId ? tournament.players.find((p) => p.id === selectedPlayerId)?.name ?? 'Player stats' : undefined}
      >
        {selectedPlayerId && (
          <PlayerStatsModalContent tournament={tournament} playerId={selectedPlayerId} />
        )}
      </Modal>

      {/* Match detail modal */}
      <Modal
        isOpen={!!selectedMatch}
        onClose={() => setSelectedMatch(null)}
        title={selectedMatch ? `Match ${selectedMatch.matchNumber} — ${selectedMatch.mode} · ${selectedMatch.map}` : undefined}
      >
        {selectedMatch && (
          <MatchDetailModalContent tournament={tournament} match={selectedMatch} />
        )}
      </Modal>
    </div>
  )
}
