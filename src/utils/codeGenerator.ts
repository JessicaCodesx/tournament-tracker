/**
 * Generates a unique 6-character alphanumeric tournament code.
 * Excludes visually ambiguous characters (0/O, 1/I/L).
 */
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export function generateTournamentCode(): string {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += CHARS.charAt(Math.floor(Math.random() * CHARS.length))
  }
  return code
}
