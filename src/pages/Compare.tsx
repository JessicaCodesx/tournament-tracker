/**
 * Compare up to 3 tournaments by shareable code: side-by-side player stats + culminating leaderboard.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getTournament } from '../services/tournamentService'
import {
  formatTournamentDate,
  getPlayerNamesForComparisonN,
  getEntryByName,
  getDisplayNameN,
  buildCulminatingLeaderboard,
} from '../utils/compareHelpers'
import Button from '../components/common/Button'
import Input from '../components/common/Input'
import Card from '../components/common/Card'
import LoadingSpinner from '../components/common/LoadingSpinner'
import type { Tournament } from '../types/tournament'

export default function Compare() {
  const [code1, setCode1] = useState('')
  const [code2, setCode2] = useState('')
  const [code3, setCode3] = useState('')
  const [t1, setT1] = useState<Tournament | null>(null)
  const [t2, setT2] = useState<Tournament | null>(null)
  const [t3, setT3] = useState<Tournament | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const codes = [code1.trim().toUpperCase(), code2.trim().toUpperCase(), code3.trim().toUpperCase()].filter(Boolean)
  const tournaments = [t1, t2, t3].filter((t): t is Tournament => t != null)

  const handleLoad = async () => {
    const c1 = code1.trim().toUpperCase()
    const c2 = code2.trim().toUpperCase()
    const c3 = code3.trim().toUpperCase()
    const entered = [c1, c2, c3].filter(Boolean)
    if (entered.length < 2) {
      setError('Enter at least two tournament codes.')
      return
    }
    const unique = new Set(entered)
    if (unique.size !== entered.length) {
      setError('Enter different codes for each tournament.')
      return
    }
    setError(null)
    setLoading(true)
    setT1(null)
    setT2(null)
    setT3(null)
    try {
      const results = await Promise.all([
        c1 ? getTournament(c1) : Promise.resolve(null),
        c2 ? getTournament(c2) : Promise.resolve(null),
        c3 ? getTournament(c3) : Promise.resolve(null),
      ])
      let notFound: string | null = null
      if (c1 && !results[0]) notFound = c1
      else if (c2 && !results[1]) notFound = c2
      else if (c3 && !results[2]) notFound = c3
      if (notFound) {
        setError(`Tournament "${notFound}" not found.`)
        return
      }
      setT1(results[0] ?? null)
      setT2(results[1] ?? null)
      setT3(results[2] ?? null)
    } catch (e) {
      setError('Failed to load tournaments. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setCode1('')
    setCode2('')
    setCode3('')
    setT1(null)
    setT2(null)
    setT3(null)
    setError(null)
  }

  const canLoad = loading === false && codes.length >= 2 && codes.length === new Set(codes).size
  const culminating = tournaments.length >= 2 ? buildCulminatingLeaderboard(tournaments) : []
  const showPlants = culminating.some((e) => (e.totalPlants ?? 0) > 0)
  const showDefuses = culminating.some((e) => (e.totalDefuses ?? 0) > 0)

  return (
    <div className="min-h-screen px-4 py-5 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="back-link mb-5"
        >
          ← Back
        </button>
        <p className="section-label text-[var(--accent)] mb-1">Compare tournaments</p>
        <h1 className="text-display text-2xl sm:text-3xl text-[var(--text-primary)] mb-2">
          Past vs past
        </h1>
        <p className="text-caption mb-6">
          Enter 2 or 3 shareable codes to compare the same players across tournaments and see a combined leaderboard.
        </p>

        <Card elevated className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <Input
              label="Tournament 1 code"
              placeholder="e.g. SQUAD7"
              value={code1}
              onChange={(e) => setCode1(e.target.value.toUpperCase().slice(0, 6))}
              className="font-mono uppercase"
            />
            <Input
              label="Tournament 2 code"
              placeholder="e.g. GAMES4"
              value={code2}
              onChange={(e) => setCode2(e.target.value.toUpperCase().slice(0, 6))}
              className="font-mono uppercase"
            />
            <Input
              label="Tournament 3 code (optional)"
              placeholder="e.g. FINALS"
              value={code3}
              onChange={(e) => setCode3(e.target.value.toUpperCase().slice(0, 6))}
              className="font-mono uppercase"
            />
          </div>
          {error && <p className="text-sm text-amber-400/90 mb-4">{error}</p>}
          <div className="flex flex-wrap gap-2">
            <Button onClick={handleLoad} disabled={!canLoad}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <LoadingSpinner className="h-4 w-4" /> Loading…
                </span>
              ) : (
                'Compare'
              )}
            </Button>
            {tournaments.length > 0 && (
              <Button variant="secondary" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>
        </Card>

        {tournaments.length >= 2 && (
          <>
            <Card elevated className="overflow-x-auto mb-6">
              <h2 className="text-title text-lg text-[var(--text-primary)] mb-1">
                Player comparison
              </h2>
              <p className="text-caption mb-4">
                Players matched by name. Stats from each tournament side by side.
              </p>
              <div className="min-w-[400px]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border-default)]">
                      <th className="section-label py-3 pr-4 text-left text-[var(--text-muted)]">
                        Player
                      </th>
                      {tournaments.map((t) => (
                        <th key={t.code} className="section-label py-3 pr-4 text-left text-[var(--text-muted)]">
                          {t.code} ({formatTournamentDate(t.created)})
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {getPlayerNamesForComparisonN(tournaments).map((nameLower) => {
                      const displayName = getDisplayNameN(nameLower, tournaments)
                      return (
                        <tr
                          key={nameLower}
                          className="border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-card-hover)] transition-colors"
                        >
                          <td className="py-3 pr-4 font-medium text-[var(--text-primary)]">
                            {displayName}
                          </td>
                          {tournaments.map((t) => {
                            const e = getEntryByName(t, nameLower)
                            return (
                              <td key={t.code} className="py-3 pr-4 text-[var(--text-secondary)]">
                                {e ? (
                                  <span className="tabular-nums">
                                    {e.wins}W–{e.losses}L · K/D {e.kdRatio.toFixed(2)} · {e.totalKills}K / {e.totalDeaths}D
                                  </span>
                                ) : (
                                  <span className="text-[var(--text-muted)]">—</span>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-caption mt-4">
                View full results:{' '}
                {tournaments.map((t, i) => (
                  <span key={t.code}>
                    {i > 0 && ' · '}
                    <Link to={`/watch/${t.code}`} className="text-[var(--accent)] hover:underline">{t.code}</Link>
                  </span>
                ))}
              </p>
            </Card>

            <Card elevated className="overflow-x-auto">
              <h2 className="text-title text-lg text-[var(--text-primary)] mb-1">
                Culminating leaderboard
              </h2>
              <p className="text-caption mb-4">
                Combined stats from all {tournaments.length} tournament{tournaments.length !== 1 ? 's' : ''}. Top 3 by wins, then K/D.
              </p>
              <div className="min-w-[520px]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border-default)]">
                      <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">Rank</th>
                      <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">Player</th>
                      <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">W</th>
                      <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">L</th>
                      <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">Games</th>
                      <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">W%</th>
                      <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">K/D</th>
                      <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">Kills</th>
                      <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">Deaths</th>
                      <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">Avg</th>
                      {showPlants && <th className="section-label py-3 pr-3 font-medium text-[var(--text-muted)]">Plants</th>}
                      {showDefuses && <th className="section-label py-3 font-medium text-[var(--text-muted)]">Defuses</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {culminating.map((e) => {
                      const winPct = e.gamesPlayed > 0 ? Math.round((e.wins / e.gamesPlayed) * 100) : 0
                      const isTop3 = e.rank <= 3
                      return (
                        <tr
                          key={e.displayName}
                          className={`border-b border-[var(--border-subtle)] last:border-0 transition-colors duration-[var(--transition-fast)] ${
                            isTop3 ? 'bg-[var(--accent-muted)]/30' : 'hover:bg-[var(--bg-card-hover)]'
                          }`}
                        >
                          <td className="py-3 pr-3 font-semibold text-[var(--text-secondary)]">{e.rank}</td>
                          <td className="py-3 pr-3 font-medium text-[var(--text-primary)]">{e.displayName}</td>
                          <td className="py-3 pr-3 text-[var(--text-secondary)]">{e.wins}</td>
                          <td className="py-3 pr-3 text-[var(--text-secondary)]">{e.losses}</td>
                          <td className="py-3 pr-3 text-[var(--text-secondary)]">{e.gamesPlayed}</td>
                          <td className="py-3 pr-3 text-[var(--text-secondary)]">{winPct}%</td>
                          <td className="py-3 pr-3 font-medium tabular-nums text-[var(--text-primary)]">
                            {e.kdRatio.toFixed(2)}
                          </td>
                          <td className="py-3 pr-3 tabular-nums text-[var(--text-secondary)]">{e.totalKills}</td>
                          <td className="py-3 pr-3 tabular-nums text-[var(--text-secondary)]">{e.totalDeaths}</td>
                          <td className="py-3 pr-3 tabular-nums text-[var(--text-secondary)]">
                            {e.avgScore > 0 ? Math.round(e.avgScore) : '—'}
                          </td>
                          {showPlants && (
                            <td className="py-3 pr-3 tabular-nums text-[var(--text-secondary)]">
                              {e.totalPlants ?? '—'}
                            </td>
                          )}
                          {showDefuses && (
                            <td className="py-3 tabular-nums text-[var(--text-secondary)]">
                              {e.totalDefuses ?? '—'}
                            </td>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
