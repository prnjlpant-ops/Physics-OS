import { useCallback, useEffect, useMemo } from 'react'
import { generateTodaysMission } from '../engine/dailyStudyService'
import { generateDailyPlan, buildDefaultBlockOrder } from '../engine/plannerService'
import { useMissionTaskStatus } from './useMissionTaskStatus'
import { usePlannerOrder } from './usePlannerOrder'
import { TASK_STATUS } from '../constants/dailyStudyConstants'
import { useSyllabusStatus } from './useSyllabusStatus'

/**
 * useDailyPlanner
 * ===============
 * Sprint 19B — Adaptive Daily Planner.
 *
 * The Planner's equivalent of Sprint 19A's useTodaysMission: pulls
 * together live syllabus status + live task status (same two sources
 * Today's Mission already reads) and this day's stored block order, runs
 * them through the Planner Service, and returns one ready-to-render plan
 * plus every Planner Action (Move Up, Move Down, Mark Complete, Skip,
 * Reset Today).
 */
export function useDailyPlanner() {
  const { overrides: syllabusStatuses } = useSyllabusStatus()
  const { overrides: taskStatusOverrides, setTaskStatus } = useMissionTaskStatus()

  const mission = useMemo(
    () => generateTodaysMission(syllabusStatuses, taskStatusOverrides),
    [syllabusStatuses, taskStatusOverrides],
  )

  const { blockOrder, persistOrder, moveTaskUp, moveTaskDown, resetOrder } = usePlannerOrder(mission.date)

  const defaultOrder = useMemo(() => buildDefaultBlockOrder(mission.tasks), [mission.tasks])
  const effectiveOrder = blockOrder ?? defaultOrder

  const plan = useMemo(
    () => generateDailyPlan(mission, effectiveOrder, taskStatusOverrides),
    [mission, effectiveOrder, taskStatusOverrides],
  )

  const moveUp = useCallback((taskId) => moveTaskUp(effectiveOrder, taskId), [moveTaskUp, effectiveOrder])
  const moveDown = useCallback((taskId) => moveTaskDown(effectiveOrder, taskId), [moveTaskDown, effectiveOrder])
  const markComplete = useCallback((taskId) => setTaskStatus(taskId, TASK_STATUS.COMPLETED), [setTaskStatus])
  const skipTask = useCallback((taskId) => setTaskStatus(taskId, TASK_STATUS.SKIPPED), [setTaskStatus])

  const resetToday = useCallback(() => {
    resetOrder(buildDefaultBlockOrder(mission.tasks))
    mission.tasks.forEach((task) => setTaskStatus(task.id, TASK_STATUS.PENDING))
  }, [resetOrder, mission.tasks, setTaskStatus])

  // Persist the freshly-computed default order the first time a day/topic
  // is seen, so later reads (and the reconciliation in the service) have
  // something stable to build on instead of recomputing defaults forever.
  useEffect(() => {
    if (!mission.isEmpty && !mission.isAllCaughtUp && blockOrder === null && mission.tasks.length > 0) {
      persistOrder(defaultOrder)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mission.isEmpty, mission.isAllCaughtUp, blockOrder, mission.tasks.length])

  return { plan, moveUp, moveDown, markComplete, skipTask, resetToday }
}
