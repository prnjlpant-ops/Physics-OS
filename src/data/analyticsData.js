import { getAllStudySessions } from '../utils/studySessionsStorage'
import {
  groupSessionsByDate,
  getDayTotalMs,
  getWeekTotalMs,
  getMonthTotalMs,
  computeStreaks,
  toDateKey,
} from '../utils/calendarStats'
import { subjects } from '../constants/subjects'
import { WEEKDAY_LABELS } from '../constants/analyticsConstants'
import {
  getMockCounts,
  getQuickStatistics,
  getRecentAttempts,
  generateAnalysisData,
  generateMockResult,
} from './mockTestsData'
import {
  getDashboardStats as getErrorDashboardStats,
  getStatistics as getErrorStatistics,
  getWeakTopics as getErrorWeakTopics,
} from './errorLearningData'

const DAY_MS = 24 * 60 * 60 * 1000
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function startOfWeek(date) {
  const start = new Date(date)
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() - start.getDay())
  return start
}

function sumMs(sessions) {
  return sessions.reduce((sum, s) => sum + (s.totalStudyTime || 0), 0)
}

/** Every subject's chapters flattened, for syllabus-wide averages. */
function allChapters() {
  return subjects.flatMap((subject) => subject.chapters)
}

/**
 * Headline numbers for the Analytics Dashboard. Pulls directly from the
 * Study Timer's stored sessions and the Subjects syllabus data — nothing
 * here is fabricated, so a fresh install honestly shows zeros.
 */
export function getDashboardOverview() {
  const sessions = getAllStudySessions()
  const sessionsByDate = groupSessionsByDate(sessions)

  const totalStudyMs = sumMs(sessions)
  const totalSessions = sessions.length
  const activeDayCount = Array.from(sessionsByDate.values()).filter(
    (daySessions) => getDayTotalMs(daySessions) > 0,
  ).length
  const avgDailyMs = activeDayCount > 0 ? totalStudyMs / activeDayCount : 0

  const { current: currentStreak, longest: longestStreak } = computeStreaks(sessionsByDate)

  const chapters = allChapters()
  const completion =
    chapters.length > 0
      ? Math.round(chapters.reduce((sum, c) => sum + (c.progress || 0), 0) / chapters.length)
      : 0

  const weekMs = getWeekTotalMs(sessions)
  const monthMs = getMonthTotalMs(sessions)

  const now = new Date()
  const thisWeekStart = startOfWeek(now).getTime()
  const prevWeekStart = thisWeekStart - 7 * DAY_MS
  const prevWeekMs = sumMs(
    sessions.filter((s) => (s.startTime || 0) >= prevWeekStart && (s.startTime || 0) < thisWeekStart),
  )

  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime()
  const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime()
  const prevMonthMs = sumMs(
    sessions.filter((s) => (s.startTime || 0) >= prevMonthStart && (s.startTime || 0) < thisMonthStart),
  )

  const weeklyTrendPct = prevWeekMs > 0 ? Math.round(((weekMs - prevWeekMs) / prevWeekMs) * 100) : null
  const monthlyTrendPct = prevMonthMs > 0 ? Math.round(((monthMs - prevMonthMs) / prevMonthMs) * 100) : null

  return {
    totalStudyMs,
    totalSessions,
    avgDailyMs,
    currentStreak,
    longestStreak,
    completion,
    weekMs,
    monthMs,
    weeklyTrendPct,
    monthlyTrendPct,
  }
}

/**
 * Study Analytics breakdowns. Accepts an already-filtered session list so
 * the page can apply the shared Subject / Date Range filters before
 * computing distributions here.
 */
export function getStudyAnalytics(sessions) {
  const sessionsByDate = groupSessionsByDate(sessions)

  const dailyHoursSeries = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setHours(0, 0, 0, 0)
    date.setDate(date.getDate() - (29 - i))
    const key = toDateKey(date)
    const ms = getDayTotalMs(sessionsByDate.get(key) || [])
    return { key, label: `${date.getDate()}/${date.getMonth() + 1}`, ms }
  })

  const dayOfWeekMs = Array(7).fill(0)
  sessions.forEach((s) => {
    if (!s.startTime) return
    const day = new Date(s.startTime).getDay()
    dayOfWeekMs[day] += s.totalStudyTime || 0
  })
  const dayOfWeekDistribution = WEEKDAY_LABELS.map((label, i) => ({ label, ms: dayOfWeekMs[i] }))

  const weeklyDistribution = Array.from({ length: 8 }, (_, i) => {
    const weekStart = startOfWeek(new Date())
    weekStart.setDate(weekStart.getDate() - (7 - i) * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 7)
    const ms = sumMs(
      sessions.filter(
        (s) => (s.startTime || 0) >= weekStart.getTime() && (s.startTime || 0) < weekEnd.getTime(),
      ),
    )
    return { label: `${weekStart.getDate()}/${weekStart.getMonth() + 1}`, ms }
  })

  const monthlyDistribution = Array.from({ length: 6 }, (_, i) => {
    const now = new Date()
    const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const monthStart = monthDate.getTime()
    const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 1).getTime()
    const ms = sumMs(
      sessions.filter((s) => (s.startTime || 0) >= monthStart && (s.startTime || 0) < monthEnd),
    )
    return { label: MONTH_LABELS[monthDate.getMonth()], ms }
  })

  const avgSessionLengthMs = sessions.length > 0 ? sumMs(sessions) / sessions.length : 0

  return { dailyHoursSeries, dayOfWeekDistribution, weeklyDistribution, monthlyDistribution, avgSessionLengthMs }
}

/**
 * Per-subject rollup: completion and chapter counts come straight from the
 * Subjects syllabus data; study hours from Study Timer sessions matched by
 * subject name; mock accuracy from the Mock Test System's own analysis.
 */
export function getSubjectAnalyticsList(sessions) {
  const mockSubjectWise = generateAnalysisData().subjectWise

  return subjects.map((subject) => {
    const totalChapters = subject.chapters.length
    const chaptersCompleted = subject.chapters.filter((c) => c.status === 'Completed').length
    const completion =
      totalChapters > 0
        ? Math.round(subject.chapters.reduce((sum, c) => sum + (c.progress || 0), 0) / totalChapters)
        : 0
    const revisionDone = subject.chapters.filter((c) => c.revision === 'Done').length
    const revisionPercent = totalChapters > 0 ? Math.round((revisionDone / totalChapters) * 100) : 0

    const studyHoursMs = sumMs(sessions.filter((s) => s.subject === subject.name))
    const mockEntry = mockSubjectWise.find((m) => m.id === subject.id)

    return {
      id: subject.id,
      name: subject.name,
      completion,
      totalChapters,
      chaptersCompleted,
      revisionPercent,
      studyHoursMs,
      mockAccuracy: mockEntry?.accuracy ?? null,
    }
  })
}

/** Mock Analytics: reuses the Mock Test System's own generated data. */
export function getMockAnalyticsSummary() {
  const counts = getMockCounts()
  const quickStats = getQuickStatistics()
  const { subjectWise } = generateAnalysisData()
  const recent = getRecentAttempts(10)

  const utilizationPercentages = recent.map((test) => {
    const result = generateMockResult(test)
    return Math.round((result.timeTakenMinutes / result.totalDurationMinutes) * 100)
  })
  const avgTimeUtilization =
    utilizationPercentages.length > 0
      ? Math.round(utilizationPercentages.reduce((a, b) => a + b, 0) / utilizationPercentages.length)
      : 0

  return { counts, quickStats, subjectPerformance: subjectWise, avgTimeUtilization }
}

/** Error Analytics: reuses the Error Learning System's own generated data. */
export function getErrorAnalyticsSummary() {
  const dashboard = getErrorDashboardStats()
  const statistics = getErrorStatistics()
  const weakTopics = getErrorWeakTopics()
  return { dashboard, statistics, weakTopics }
}

/** Best week / best month / missed days, derived only from real sessions. */
export function getConsistencySummary(sessions) {
  if (sessions.length === 0) {
    return { bestWeek: null, bestMonth: null, missedDays: 0, firstSessionDate: null }
  }

  const weekTotals = new Map()
  const monthTotals = new Map()
  let earliest = sessions[0].startTime || Date.now()

  sessions.forEach((s) => {
    const t = s.startTime || Date.now()
    if (t < earliest) earliest = t
    const weekKey = toDateKey(startOfWeek(new Date(t)))
    weekTotals.set(weekKey, (weekTotals.get(weekKey) || 0) + (s.totalStudyTime || 0))

    const d = new Date(t)
    const monthKey = `${d.getFullYear()}-${d.getMonth()}`
    monthTotals.set(monthKey, (monthTotals.get(monthKey) || 0) + (s.totalStudyTime || 0))
  })

  const bestWeekEntry = [...weekTotals.entries()].sort((a, b) => b[1] - a[1])[0]
  const bestMonthEntry = [...monthTotals.entries()].sort((a, b) => b[1] - a[1])[0]

  const [bestMonthYear, bestMonthIndex] = bestMonthEntry[0].split('-').map(Number)

  const sessionsByDate = groupSessionsByDate(sessions)
  const startDay = new Date(earliest)
  startDay.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const totalDaySpan = Math.round((today.getTime() - startDay.getTime()) / DAY_MS) + 1
  const activeDays = Array.from(sessionsByDate.values()).filter((d) => getDayTotalMs(d) > 0).length
  const missedDays = Math.max(totalDaySpan - activeDays, 0)

  return {
    bestWeek: { weekStart: bestWeekEntry[0], ms: bestWeekEntry[1] },
    bestMonth: { label: `${MONTH_LABELS[bestMonthIndex]} ${bestMonthYear}`, ms: bestMonthEntry[1] },
    missedDays,
    firstSessionDate: toDateKey(startDay),
  }
}
