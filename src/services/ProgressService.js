import SessionService from './SessionService'
import TaskService from './TaskService'
import TopicProgressService from '../engine/topics/topicProgressService'
import { topicRecords } from '../engine/topics'
import { TOPIC_STATUS } from '../constants/topicConstants'

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
  const statuses = TopicProgressService.getAllStatuses()
  return topicRecords.filter((topic) => (statuses[topic.id] ?? TOPIC_STATUS.NOT_STARTED) === TOPIC_STATUS.MASTERED)
    .length
}

function getProgressSummary() {
  return {
    totalStudyTimeMs: SessionService.getTotalStudyTimeMs(),
    todayStudyTimeMs: SessionService.getTodayStudyTimeMs(),
    weeklyStudyTimeMs: SessionService.getWeeklyStudyTimeMs(),
    completedTasks: TaskService.getCompletedTasks().length,
    completedSessions: SessionService.getCompletedSessionsCount(),
    completedTopics: getCompletedTopicsCount(),
    totalTopics: topicRecords.length,
    lastStudiedDate: SessionService.getLastStudiedDate(),
    currentStreak: SessionService.getCurrentStreak(),
  }
}

export const ProgressService = {
  getProgressSummary,
  getCompletedTopicsCount,
}

export default ProgressService
