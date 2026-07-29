import { useCallback, useEffect, useState } from 'react'
import WorkspaceService from '../services/WorkspaceService'

/**
 * Sprint 28 — Desktop Readiness Layer.
 *
 * React binding for WorkspaceService — current Subject/Chapter/Topic/
 * Resource, persisted and restored across refreshes (unless the user has
 * turned off "Restore Last Workspace" in Settings). Stays in sync across
 * tabs via StorageService's change events.
 */
export function useWorkspace() {
  const [state, setState] = useState(WorkspaceService.getState)

  useEffect(() => WorkspaceService.subscribe(() => setState(WorkspaceService.getState())), [])

  const setCurrentSubject = useCallback((subjectId) => setState(WorkspaceService.setCurrentSubject(subjectId)), [])
  const setCurrentChapter = useCallback(
    (chapterSlug) => setState(WorkspaceService.setCurrentChapter(chapterSlug)),
    [],
  )
  const setCurrentTopic = useCallback((topicId) => setState(WorkspaceService.setCurrentTopic(topicId)), [])
  const setCurrentResource = useCallback(
    (resourceId) => setState(WorkspaceService.setCurrentResource(resourceId)),
    [],
  )
  const reset = useCallback(() => setState(WorkspaceService.reset()), [])

  return {
    ...state,
    setCurrentSubject,
    setCurrentChapter,
    setCurrentTopic,
    setCurrentResource,
    reset,
  }
}

export default useWorkspace
