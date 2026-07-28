import { useCallback, useEffect, useState } from 'react'
import QuestionProgressService from '../engine/pyq/questionProgressService'
import { PAPER_STATUS } from '../constants/pyqLibraryConstants'

/**
 * Sprint 25 — PYQ Engine.
 * Reactive wrapper around `engine/pyq/questionProgressService.js`. Every id
 * passed in today is a whole paper's id; the underlying service is shaped
 * so Sprint 26 can pass individual question ids through this same hook
 * once `pyq_index.json` is populated.
 */
export function usePaperProgress() {
  const [statuses, setStatuses] = useState(QuestionProgressService.getAllStatuses)

  useEffect(
    () => QuestionProgressService.subscribeToProgress(() => setStatuses(QuestionProgressService.getAllStatuses())),
    [],
  )

  const getStatus = useCallback((id) => statuses[id] ?? PAPER_STATUS.NOT_STARTED, [statuses])

  const setStatus = useCallback((id, status) => {
    setStatuses(QuestionProgressService.setStatus(id, status))
  }, [])

  return { statuses, getStatus, setStatus }
}
