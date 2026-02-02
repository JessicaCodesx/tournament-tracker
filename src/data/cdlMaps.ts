/**
 * CDL (Call of Duty League) maps and modes for Black Ops 7.
 * Used by map/mode randomizer when assigning each match.
 */

export const CDL_MODES = ['Hardpoint', 'Search & Destroy', 'Control'] as const
export type CDLMode = (typeof CDL_MODES)[number]

export const CDL_MAPS_BY_MODE: Record<CDLMode, readonly string[]> = {
  'Hardpoint': ['Blackheart', 'Colossus', 'Den', 'Exposure', 'Scar'],
  'Search & Destroy': ['Colossus', 'Den', 'Exposure', 'Raid', 'Scar Overload', 'Scar'],
  'Control': ['Blackheart', 'Colossus', 'Den', 'Exposure', 'Scar'],
}
