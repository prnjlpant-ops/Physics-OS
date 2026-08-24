import { useMemo } from 'react'
import { generateTodaysMission } from '../engine/dailyStudyService'
import { useMissionTaskStatus } from './useMissionTaskStatus'
import { useTopicProgress } from './useTopicProgress'

/**
 * Generates Today's Mission from live syllabus status + live task status,
 * recomputing whenever either changes. See engine/dailyStudyService.js for
 * the generation logic itself — this hook only supplies the two live
 * overrides the service needs and re-runs it.
 */
export function useTodaysMission() {
  const { statuses: roadmapStatuses } = useTopicProgress()
  const { overrides: taskStatusOverrides, startTask, completeTask } = useMissionTaskStatus()

  const mission = useMemo(
    () => generateTodaysMission(roadmapStatuses, taskStatusOverrides),
    [roadmapStatuses, taskStatusOverrides],
  )

  return { mission, startTask, completeTask }
}
