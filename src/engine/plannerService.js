import { TIME_BLOCK_ORDER, TASK_TYPE_DEFAULT_BLOCK, TIME_BLOCKS } from '../constants/plannerConstants'
import { TASK_STATUS } from '../constants/dailyStudyConstants'
import { createPlannerTask, createDailyPlan } from './plannerModel'

/**
 * PLANNER SERVICE
 * ===============
 * Sprint 19B — Adaptive Daily Planner.
 *
 * Expands the Daily Study Engine (engine/dailyStudyService.js) into a
 * full-day planner: it takes the Mission that service already generates
 * (one Subject -> Chapter -> Topic -> flat task list) and organizes those
 * same tasks into Morning / Afternoon / Evening / Flexible, applies the
 * user's own reordering and Pending/In Progress/Completed/Skipped status,
 * and rolls the result up into a Daily Summary.
 *
 * NO AI. NO AUTOMATIC SCHEDULING. Block placement is one fixed, readable
 * rule (`TASK_TYPE_DEFAULT_BLOCK`) applied once per task; after that, the
 * user's own Move Up/Down is the only thing that changes order, and it is
 * simply remembered (see hooks/usePlannerOrder.js).
 *
 * ARCHITECTURE NOTE — future syllabus integration: today, `generateTodaysMission`
 * only ever returns tasks for a single in-focus topic, so every planner
 * task shares one Subject/Chapter/Topic. This service does not assume
 * that — it reads each task's own subject/chapter/topic — so a future
 * sprint that makes the Mission multi-topic (e.g. several topics due the
 * same day) requires no changes here.
 */

function defaultBlockForTask(task) {
  return TASK_TYPE_DEFAULT_BLOCK[task.type] ?? TIME_BLOCKS.FLEXIBLE
}

/**
 * Builds the "fresh" block assignment + in-block order for a mission's
 * tasks, with no stored overrides applied. Used both as the starting
 * point for a new day and as the target of "Reset Today".
 */
export function buildDefaultBlockOrder(missionTasks) {
  const order = Object.fromEntries(TIME_BLOCK_ORDER.map((block) => [block, []]))
  missionTasks.forEach((task) => {
    order[defaultBlockForTask(task)].push(task.id)
  })
  return order
}

/**
 * Reconciles a stored block/order map (from usePlannerOrder) against the
 * mission's current task ids: drops ids that no longer exist (task's
 * underlying resource disappeared, or the in-focus topic changed) and
 * appends any new task id to its default block so nothing is ever lost
 * off the plan silently.
 */
export function reconcileBlockOrder(storedOrder, missionTasks) {
  const knownIds = new Set(missionTasks.map((task) => task.id))
  const placedIds = new Set()
  const reconciled = Object.fromEntries(TIME_BLOCK_ORDER.map((block) => [block, []]))

  TIME_BLOCK_ORDER.forEach((block) => {
    const idsForBlock = storedOrder?.[block] ?? []
    idsForBlock.forEach((id) => {
      if (knownIds.has(id) && !placedIds.has(id)) {
        reconciled[block].push(id)
        placedIds.add(id)
      }
    })
  })

  missionTasks.forEach((task) => {
    if (!placedIds.has(task.id)) {
      reconciled[defaultBlockForTask(task)].push(task.id)
      placedIds.add(task.id)
    }
  })

  return reconciled
}

/**
 * Generates today's plan.
 *
 * @param mission - output of engine/dailyStudyService.js#generateTodaysMission
 * @param blockOrder - this day's { Morning: [taskId,...], ... } from usePlannerOrder
 * @param taskStatusOverrides - shared per-task status map from useMissionTaskStatus
 *   (same store Today's Mission uses — Skipped is Planner-only, but the
 *   status itself lives in one place so the two views never disagree).
 */
export function generateDailyPlan(mission, blockOrder, taskStatusOverrides = {}) {
  if (mission.isEmpty) return createDailyPlan({ date: mission.date, isEmpty: true })
  if (mission.isAllCaughtUp) return createDailyPlan({ date: mission.date, isAllCaughtUp: true })

  const tasksById = new Map(mission.tasks.map((task) => [task.id, task]))
  const reconciledOrder = reconcileBlockOrder(blockOrder, mission.tasks)

  const blocks = Object.fromEntries(
    TIME_BLOCK_ORDER.map((block) => {
      const plannerTasks = reconciledOrder[block]
        .map((id) => tasksById.get(id))
        .filter(Boolean)
        .map((task) =>
          createPlannerTask({
            id: task.id,
            name: task.title,
            subjectName: mission.subject.name,
            chapterName: mission.chapter.name,
            topicName: mission.topic.name,
            estimatedMinutes: task.estimatedMinutes,
            priority: task.priority,
            status: taskStatusOverrides[task.id] ?? task.status ?? TASK_STATUS.PENDING,
            block,
            link: task.link,
          }),
        )
      return [block, plannerTasks]
    }),
  )

  return createDailyPlan({ date: mission.date, blocks })
}

/**
 * Calculates the daily session splits / capacity based on planner settings.
 * N = floor((dailyStudyHours * 60) / (sessionLength + breakLength))
 *
 * @param {object} settings - { dailyStudyHours, preferredSessionLength, sessionLength, breakLength, maxTasksPerDay }
 * @returns {object} { targetSessions, sessionLength, breakLength, dailyStudyHours, totalAllocatedMinutes }
 */
export function calculateDailySessionSplit(settings = {}) {
  const hours = Number(settings.dailyStudyHours ?? 6)
  const sessionLength = Number(settings.preferredSessionLength ?? settings.sessionLength ?? 45)
  const breakLength = Number(settings.breakLength ?? 10)
  const cycle = sessionLength + breakLength

  const targetSessions = cycle > 0 ? Math.floor((hours * 60) / cycle) : 0
  const totalAllocatedMinutes = targetSessions * sessionLength

  return {
    targetSessions,
    sessionLength,
    breakLength,
    dailyStudyHours: hours,
    totalAllocatedMinutes,
  }
}

