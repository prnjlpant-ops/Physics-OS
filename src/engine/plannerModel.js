import { TASK_STATUS } from '../constants/dailyStudyConstants'
import { TIME_BLOCK_ORDER } from '../constants/plannerConstants'

/**
 * PLANNER MODEL
 * =============
 * Sprint 19B — Adaptive Daily Planner.
 *
 * The reusable shapes for the Planner, one layer above Sprint 19A's
 * Mission/Task models (engine/missionModel.js, engine/taskModel.js). A
 * planner task is a Mission task enriched with the Subject/Chapter/Topic
 * it belongs to (so a card never needs to re-derive that) and a Block
 * ("Morning" | "Afternoon" | "Evening" | "Flexible").
 *
 * Planner task shape:
 * {
 *   id, name, subjectName, chapterName, topicName, estimatedMinutes,
 *   priority, status, block, link
 * }
 *
 * Daily plan shape:
 * {
 *   date, blocks: { Morning: Task[], Afternoon: Task[], Evening: Task[], Flexible: Task[] },
 *   summary: { plannedMinutes, completedMinutes, remainingMinutes, completedTaskCount, totalTaskCount },
 *   isEmpty, isAllCaughtUp
 * }
 */
export function createPlannerTask({
  id,
  name,
  subjectName,
  chapterName,
  topicName,
  estimatedMinutes,
  priority = 'Medium',
  status = TASK_STATUS.PENDING,
  block,
  link = null,
}) {
  return {
    id,
    name,
    subjectName,
    chapterName,
    topicName,
    estimatedMinutes,
    priority,
    status,
    block,
    link,
  }
}

/** Pure summary calculation — no storage, no side effects. */
export function computePlannerSummary(tasks) {
  const plannedMinutes = tasks.reduce((sum, task) => sum + (task.estimatedMinutes || 0), 0)
  const completedTasks = tasks.filter((task) => task.status === TASK_STATUS.COMPLETED)
  const completedMinutes = completedTasks.reduce((sum, task) => sum + (task.estimatedMinutes || 0), 0)
  const remainingMinutes = tasks
    .filter((task) => task.status !== TASK_STATUS.COMPLETED && task.status !== TASK_STATUS.SKIPPED)
    .reduce((sum, task) => sum + (task.estimatedMinutes || 0), 0)

  return {
    plannedMinutes,
    completedMinutes,
    remainingMinutes,
    completedTaskCount: completedTasks.length,
    totalTaskCount: tasks.length,
  }
}

export function createDailyPlan({
  date = new Date().toISOString().slice(0, 10),
  blocks = null,
  isEmpty = false,
  isAllCaughtUp = false,
}) {
  const resolvedBlocks = blocks ?? Object.fromEntries(TIME_BLOCK_ORDER.map((block) => [block, []]))
  const allTasks = TIME_BLOCK_ORDER.flatMap((block) => resolvedBlocks[block] ?? [])

  return {
    date,
    blocks: resolvedBlocks,
    summary: computePlannerSummary(allTasks),
    isEmpty,
    isAllCaughtUp,
  }
}
