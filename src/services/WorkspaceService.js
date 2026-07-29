import StorageService from './StorageService'
import SettingsService from './SettingsService'
import { createWorkspaceState } from '../types/Workspace'

/**
 * WORKSPACE SERVICE
 * =================
 * Sprint 28 — Desktop Readiness Layer.
 *
 * Tracks "where the user currently is" — Current Subject, Current
 * Chapter, Current Topic, Current Resource — persisted so it survives a
 * refresh. Respects Settings -> "Restore Last Workspace": when that's
 * turned off, `getState()` always returns a blank workspace instead of
 * whatever was last saved (the saved state itself is left untouched, so
 * turning the setting back on immediately restores it).
 *
 * This does not replace any existing per-feature "last opened" state
 * (e.g. Study Timer's own session tracking) — it's a new, generic layer
 * pages can adopt incrementally, starting with `ContinueStudyingCard`.
 */

const STORAGE_KEY = 'workspace'

function readAll() {
  const stored = StorageService.get(STORAGE_KEY, null)
  return createWorkspaceState(stored && typeof stored === 'object' ? stored : {})
}

function writeAll(state) {
  return StorageService.set(STORAGE_KEY, state)
}

/** Returns the current workspace, or a blank one if "Restore Last Workspace" is disabled. */
function getState() {
  const restoreEnabled = SettingsService.getSetting('restoreLastWorkspace')
  if (restoreEnabled === false) return createWorkspaceState()
  return readAll()
}

function update(changes) {
  const next = createWorkspaceState({ ...readAll(), ...changes })
  writeAll(next)
  return next
}

function setCurrentSubject(subjectId) {
  return update({ currentSubjectId: subjectId })
}

function setCurrentChapter(chapterSlug) {
  return update({ currentChapterSlug: chapterSlug })
}

function setCurrentTopic(topicId) {
  return update({ currentTopicId: topicId })
}

function setCurrentResource(resourceId) {
  return update({ currentResourceId: resourceId })
}

function reset() {
  const blank = createWorkspaceState()
  writeAll(blank)
  return blank
}

function subscribe(callback) {
  return StorageService.subscribe(STORAGE_KEY, callback)
}

export const WorkspaceService = {
  getState,
  setCurrentSubject,
  setCurrentChapter,
  setCurrentTopic,
  setCurrentResource,
  reset,
  subscribe,
}

export default WorkspaceService
