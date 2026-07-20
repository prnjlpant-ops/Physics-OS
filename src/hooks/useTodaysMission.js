import { useMemo } from 'react'
import { generateTodaysMission } from '../engine/dailyStudyService'
import { useSyllabusStatus } from './useSyllabusStatus'
import { useMissionTaskStatus } from './useMissionTaskStatus'

/**
 * Generates Today's Mission from live syllabus status + live task status,
 * recomputing whenever either changes. See engine/dailyStudyService.js for
 * the generation logic itself — this hook only supplies the two live
 * overrides the service needs and re-runs it.
 */
export function useTodaysMission() {
  const { overrides: statusOverrides } = useSyllabusStatus()
  const { overrides: taskStatusOverrides, startTask, completeTask } = useMissionTaskStatus()

  const mission = useMemo(
    () => generateTodaysMission(statusOverrides, taskStatusOverrides),
    [statusOverrides, taskStatusOverrides],
  )

  return { mission, startTask, completeTask }
}
