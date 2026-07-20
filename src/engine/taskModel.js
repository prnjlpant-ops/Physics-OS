import { TASK_STATUS, TASK_TYPE_ICON_KEY } from '../constants/dailyStudyConstants'

/**
 * TASK MODEL
 * ==========
 * Sprint 19A — Daily Study Engine (Core).
 *
 * The reusable shape for a single task inside a Mission (see missionModel.js).
 * A task is always generated FROM something that already exists elsewhere in
 * the app (a book, a video, a chapter's PYQs, a formula/memory sheet, an
 * Active Recall deck, or the user's own notes) — this factory only
 * normalizes those into one uniform, JSON-ready shape so the UI never has
 * to branch on task type to render a card.
 *
 * Task shape:
 * {
 *   id, type, title, estimatedMinutes, priority, status,
 *   link, topicId, subjectId, chapterSlug, meta
 * }
 */
export function createTask({
  id,
  type,
  title,
  estimatedMinutes,
  priority = 'Medium',
  status = TASK_STATUS.PENDING,
  link = null,
  topicId,
  subjectId,
  chapterSlug,
  meta = {},
}) {
  return {
    id,
    type,
    title,
    iconKey: TASK_TYPE_ICON_KEY[type] ?? 'task',
    estimatedMinutes,
    priority,
    status,
    link,
    topicId,
    subjectId,
    chapterSlug,
    meta,
  }
}

export function totalEstimatedMinutes(tasks) {
  return tasks.reduce((sum, task) => sum + (task.estimatedMinutes || 0), 0)
}

export function completedTaskCount(tasks) {
  return tasks.filter((task) => task.status === TASK_STATUS.COMPLETED).length
}
