/**
 * Deterministic placeholder-data helpers.
 *
 * The Mock Test System has no backend and no evaluation engine, so every
 * "score", "accuracy" or "time taken" figure shown in the UI is fabricated.
 * We still want the same test id to always produce the same numbers within
 * a session (so navigating away and back doesn't visibly change the mock
 * result), so we derive a seed from the string instead of calling Math.random.
 */
export function hashString(value) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function seededFloat(seed, salt = 0) {
  const x = Math.sin(seed + salt) * 10000
  return x - Math.floor(x)
}

export function seededInt(seed, min, max, salt = 0) {
  return min + Math.floor(seededFloat(seed, salt) * (max - min + 1))
}
