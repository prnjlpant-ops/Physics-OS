export function formatDuration(ms) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (value) => String(value).padStart(2, '0')
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

export function formatClockTime(timestamp) {
  if (!timestamp) return '--:--'
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateLabel(timestamp) {
  if (!timestamp) return '--'
  return new Date(timestamp).toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Compact "12.5h" style label used across the Analytics System, where
 * HH:MM:SS (formatDuration) would be too granular for aggregate totals.
 */
export function formatHoursLabel(ms) {
  const hours = ms / 3_600_000
  return `${hours.toFixed(1)}h`
}

/**
 * Compact "45m" / "1h 20m" style label for shorter durations such as a
 * single average session length.
 */
export function formatMinutesLabel(ms) {
  const totalMinutes = Math.round(ms / 60000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours === 0) return `${minutes}m`
  return `${hours}h ${minutes}m`
}
