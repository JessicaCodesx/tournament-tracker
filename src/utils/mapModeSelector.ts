/**
 * Randomly assigns CDL map and mode per match.
 * Optionally avoids repeating mode/map until exhausted.
 */
import { CDL_MODES, CDL_MAPS_BY_MODE, type CDLMode } from '../data/cdlMaps'

export function getRandomMapAndMode(): { map: string; mode: string } {
  const mode = CDL_MODES[Math.floor(Math.random() * CDL_MODES.length)] as CDLMode
  const maps = CDL_MAPS_BY_MODE[mode]
  const map = maps[Math.floor(Math.random() * maps.length)]
  return { map, mode }
}

/**
 * Returns map/mode for a batch of matches, optionally avoiding repeats until exhausted.
 */
export function assignMapsAndModes(count: number): { map: string; mode: string }[] {
  const result: { map: string; mode: string }[] = []
  const used: Record<string, Set<string>> = { Hardpoint: new Set(), 'Search & Destroy': new Set(), Control: new Set() }
  for (let i = 0; i < count; i++) {
    const modes: CDLMode[] = [...CDL_MODES]
    shuffle(modes)
    let picked: { map: string; mode: string } | null = null
    for (const mode of modes) {
      const maps = CDL_MAPS_BY_MODE[mode]
      const available = maps.filter((m) => !used[mode].has(m))
      const map = available[Math.floor(Math.random() * available.length)] ?? maps[0]
      used[mode].add(map)
      picked = { map, mode }
      break
    }
    result.push(picked ?? getRandomMapAndMode())
  }
  return result
}

function shuffle<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
}
