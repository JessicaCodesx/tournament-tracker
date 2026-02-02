/**
 * Scoreboard columns per game mode. S&D: plants/defuses; Hardpoint/Control: score.
 */
export type StatFieldKey = 'kills' | 'deaths' | 'score' | 'plants' | 'defuses'

export interface ScoreboardColumn {
  key: StatFieldKey
  label: string
}

/** True if mode is Search & Destroy (plants/defuses). */
export function isSearchAndDestroy(mode: string): boolean {
  const m = mode.toLowerCase()
  return m.includes('search') || m.includes('destroy') || m.includes('s&d') || m.includes('snd')
}

/** True if mode uses score (Hardpoint, Control). */
export function isScoreMode(mode: string): boolean {
  const m = mode.toLowerCase()
  return m.includes('hardpoint') || m.includes('control')
}

/** Columns to show for stat entry and scoreboard display by mode. Autopopulates based on gamemode. */
export function getColumnsForMode(mode: string): ScoreboardColumn[] {
  const base: ScoreboardColumn[] = [
    { key: 'kills', label: 'K' },
    { key: 'deaths', label: 'D' },
  ]
  if (isSearchAndDestroy(mode)) {
    return [...base, { key: 'plants', label: 'Plants' }, { key: 'defuses', label: 'Defuses' }]
  }
  return [...base, { key: 'score', label: 'Score' }]
}
