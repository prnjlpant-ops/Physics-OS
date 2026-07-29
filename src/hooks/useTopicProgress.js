import { useCallback, useEffect, useState } from 'react'
import TopicProgressService from '../engine/topics/topicProgressService'
import { TOPIC_STATUS } from '../constants/topicConstants'

/**
 * Sprint 26 — Topic Index & Study Mapping.
 * Reactive wrapper around `engine/topics/topicProgressService.js`. Persists
 * through StorageService, so progress stays in sync across every mounted
 * component and across browser tabs — mirrors `hooks/usePaperProgress.js`.
 */
export function useTopicProgress() {
  const [statuses, setStatuses] = useState(TopicProgressService.getAllStatuses)

  useEffect(
    () => TopicProgressService.subscribeToProgress(() => setStatuses(TopicProgressService.getAllStatuses())),
    [],
  )

  const getStatus = useCallback((id) => statuses[id] ?? TOPIC_STATUS.NOT_STARTED, [statuses])

  const setStatus = useCallback((id, status) => {
    setStatuses(TopicProgressService.setStatus(id, status))
  }, [])

  return { statuses, getStatus, setStatus }
}

export default useTopicProgress
