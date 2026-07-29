import { getAllStudySessions } from '../utils/studySessionsStorage'
import {
  groupSessionsByDate,
  getDayTotalMs,
  getTodayTotalMs,
  getWeekTotalMs,
  computeStreaks,
  toDateKey,
} from '../utils/calendarStats'

/**
 * SESSION SERVICE
 * ===============
 * Sprint 27 — Study Engine & Today's Mission.
 *
 * A thin query layer over the existing session store
 * (`utils/studySessionsStorage.js`, Sprint 15/Study Timer) and the
 * existing Calendar stats helpers (`utils/calendarStats.js`, Sprint 20).
 * Per this sprint's "reuse, don't duplicate" rule, this file adds no new
 * storage and no new math for anything Calendar already computes — it
 * only composes those into the shapes `ProgressService` and the Study
 * Session workspace need.
 *
 * The session record itself (id, startTime, endTime, duration, subject,
 * chapter, topic, notes, reflection, confidence, resourcesOpened,
 * tasksCompleted) is written by `context/StudyTimerContext.jsx`'s
 * `completeSession` — extended this sprint to include the new fields the
 * Session Model requires, while staying backward compatible with sessions
 * saved before this sprint (missing fields simply read as empty/undefined).
 */

function getAllSessions() {
  return getAllStudySessions()
}

function getSessionsForDate(dateKey) {
  const grouped = groupSessionsByDate(getAllSessions())
  return grouped.get(dateKey) || []
}

function getTotalStudyTimeMs() {
  return getAllSessions().reduce((sum, s) => sum + (s.totalStudyTime || 0), 0)
}

function getTodayStudyTimeMs() {
  return getTodayTotalMs(groupSessionsByDate(getAllSessions()))
}

function getWeeklyStudyTimeMs() {
  return getWeekTotalMs(getAllSessions())
}

function getLastStudiedDate() {
  const sessions = getAllSessions()
  if (sessions.length === 0) return null
  const latest = sessions.reduce((max, s) => Math.max(max, s.startTime || 0), 0)
  return latest ? toDateKey(latest) : null
}

function getCurrentStreak() {
  const { current } = computeStreaks(groupSessionsByDate(getAllSessions()))
  return current
}

function getCompletedSessionsCount() {
  return getAllSessions().length
}

export const SessionService = {
  getAllSessions,
  getSessionsForDate,
  getDayTotalMs,
  getTotalStudyTimeMs,
  getTodayStudyTimeMs,
  getWeeklyStudyTimeMs,
  getLastStudiedDate,
  getCurrentStreak,
  getCompletedSessionsCount,
}

export default SessionService
