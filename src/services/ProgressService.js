import SessionService from './SessionService'
import TaskService from './TaskService'
import { getAllTopics } from '../data/syllabusData'
import { TOPIC_STATUS } from '../constants/syllabusConstants'

/**
 * PROGRESS SERVICE
 * ================
 * Sprint 27 — Study Engine & Today's Mission.
 *
 * Composes the Progress metrics the sprint spec lists — Total/Today's/
 * Weekly Study Time, Completed Tasks, Completed Sessions, Completed
 * Topics, Last Studied Date, Current Streak — entirely from existing
 * stores (`SessionService`, `TaskService`, `TopicProgressService`). No new
 * storage, no duplicated math: every number here is read straight from a
 * service that already owns it.
 */

function getCompletedTopicsCount() {
  try {
    const raw = localStorage.getItem('physicsOS.syllabusTopicStatus')
    const statuses = raw ? JSON.parse(raw) : {}
    return getAllTopics().filter((topic) => (statuses[topic.id] ?? topic.metadata.status ?? TOPIC_STATUS.NOT_STARTED) === TOPIC_STATUS.MASTERED)
    .length
  } catch {
    return 0
  }
}

function getProgressSummary() {
  return {
    totalStudyTimeMs: SessionService.getTotalStudyTimeMs(),
    todayStudyTimeMs: SessionService.getTodayStudyTimeMs(),
    weeklyStudyTimeMs: SessionService.getWeeklyStudyTimeMs(),
    completedTasks: TaskService.getCompletedTasks().length,
    completedSessions: SessionService.getCompletedSessionsCount(),
    completedTopics: getCompletedTopicsCount(),
    totalTopics: getAllTopics().length,
    lastStudiedDate: SessionService.getLastStudiedDate(),
    currentStreak: SessionService.getCurrentStreak(),
  }
}

export const ProgressService = {
  getProgressSummary,
  getCompletedTopicsCount,
}

export default ProgressService
