const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Converts a Date or timestamp into a local YYYY-MM-DD key.
 */
export function toDateKey(input) {
  const d = input instanceof Date ? input : new Date(input)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Groups existing study sessions by their stored `date` field.
 * Does not create or duplicate any session data.
 */
export function groupSessionsByDate(sessions) {
  const map = new Map()
  sessions.forEach((session) => {
    const key = session.date || toDateKey(session.startTime)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(session)
  })
  return map
}

export function getDayTotalMs(daySessions) {
  return daySessions.reduce((sum, s) => sum + (s.totalStudyTime || 0), 0)
}

/**
 * 0 hr -> 0, 0-1 hr -> 1, 1-2 hr -> 2, 2-4 hr -> 3, 4+ hr -> 4
 */
export function getIntensityLevel(hours) {
  if (hours <= 0) return 0
  if (hours < 1) return 1
  if (hours < 2) return 2
  if (hours < 4) return 3
  return 4
}

export function getTodayTotalMs(sessionsByDate) {
  const key = toDateKey(new Date())
  return getDayTotalMs(sessionsByDate.get(key) || [])
}

function getStartOfWeek(now) {
  const start = new Date(now)
  start.setDate(start.getDate() - start.getDay())
  start.setHours(0, 0, 0, 0)
  return start
}

export function getWeekTotalMs(sessions) {
  const startOfWeek = getStartOfWeek(new Date())
  return sessions
    .filter((s) => (s.startTime || 0) >= startOfWeek.getTime())
    .reduce((sum, s) => sum + (s.totalStudyTime || 0), 0)
}

export function getMonthTotalMs(sessions) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  return sessions
    .filter((s) => (s.startTime || 0) >= startOfMonth)
    .reduce((sum, s) => sum + (s.totalStudyTime || 0), 0)
}

/**
 * Current and longest study streaks, derived only from days that already
 * have stored sessions with study time greater than zero.
 */
export function computeStreaks(sessionsByDate) {
  const activeDates = new Set(
    Array.from(sessionsByDate.entries())
      .filter(([, sessions]) => getDayTotalMs(sessions) > 0)
      .map(([key]) => key),
  )

  if (activeDates.size === 0) return { current: 0, longest: 0 }

  const sortedDates = Array.from(activeDates).sort()
  let longest = 1
  let run = 1
  for (let i = 1; i < sortedDates.length; i += 1) {
    const prev = new Date(sortedDates[i - 1])
    const curr = new Date(sortedDates[i])
    const diffDays = Math.round((curr - prev) / DAY_MS)
    if (diffDays === 1) {
      run += 1
    } else if (diffDays > 1) {
      run = 1
    }
    longest = Math.max(longest, run)
  }

  let current = 0
  const cursor = new Date()
  cursor.setHours(0, 0, 0, 0)
  let key = toDateKey(cursor)
  if (!activeDates.has(key)) {
    cursor.setDate(cursor.getDate() - 1)
    key = toDateKey(cursor)
  }
  while (activeDates.has(key)) {
    current += 1
    cursor.setDate(cursor.getDate() - 1)
    key = toDateKey(cursor)
  }

  return { current, longest }
}

/**
 * Filters existing sessions by a UI-selected range. Does not mutate storage.
 */
export function filterSessionsByRange(sessions, filter, customRange) {
  if (filter === 'all') return sessions
  const now = new Date()

  if (filter === 'today') {
    const key = toDateKey(now)
    return sessions.filter((s) => (s.date || toDateKey(s.startTime)) === key)
  }

  if (filter === 'week') {
    const startOfWeek = getStartOfWeek(now)
    return sessions.filter((s) => (s.startTime || 0) >= startOfWeek.getTime())
  }

  if (filter === 'month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
    return sessions.filter((s) => (s.startTime || 0) >= startOfMonth)
  }

  if (filter === 'custom' && customRange?.from && customRange?.to) {
    const from = new Date(customRange.from).setHours(0, 0, 0, 0)
    const to = new Date(customRange.to).setHours(23, 59, 59, 999)
    return sessions.filter((s) => {
      const t = s.startTime || 0
      return t >= from && t <= to
    })
  }

  return sessions
}

export function searchSessions(sessions, query) {
  if (!query || !query.trim()) return sessions
  const q = query.trim().toLowerCase()
  return sessions.filter(
    (s) =>
      (s.subject || '').toLowerCase().includes(q) ||
      (s.chapter || '').toLowerCase().includes(q) ||
      (s.task || '').toLowerCase().includes(q),
  )
}
