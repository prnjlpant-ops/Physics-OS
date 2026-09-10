import { useMemo } from 'react'
import { generateTodaysMission } from '../engine/dailyStudyService'
import { useMissionTaskStatus } from './useMissionTaskStatus'
import { useSyllabusStatus } from './useSyllabusStatus'

/**
 * Generates Today's Mission from live syllabus status + live task status,
 * recomputing whenever either changes. See engine/dailyStudyService.js for
 * the generation logic itself — this hook only supplies the two live
 * overrides the service needs and re-runs it.
 */
export function useTodaysMission() {
  const { overrides: syllabusStatuses } = useSyllabusStatus()
  const { overrides: taskStatusOverrides, startTask, completeTask } = useMissionTaskStatus()

  const mission = useMemo(
    () => generateTodaysMission(syllabusStatuses, taskStatusOverrides),
    [syllabusStatuses, taskStatusOverrides],
  )

  return { mission, startTask, completeTask }
}
