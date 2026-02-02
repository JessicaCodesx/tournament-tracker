/**
 * CDL (Call of Duty League) maps and modes for Black Ops 7.
 * Used by map/mode randomizer when assigning each match.
 */

export const CDL_MODES = ['Hardpoint', 'Search & Destroy', 'Control'] as const
export type CDLMode = (typeof CDL_MODES)[number]

export const CDL_MAPS_BY_MODE: Record<CDLMode, readonly string[]> = {
  'Hardpoint': ['Babylon', 'Protocol', 'Skyline', 'Red Card'],
  'Search & Destroy': ['Hacienda', 'Skyline', 'Babylon', 'Warhead'],
  'Control': ['Highrise', 'Babylon', 'Protocol'],
}
