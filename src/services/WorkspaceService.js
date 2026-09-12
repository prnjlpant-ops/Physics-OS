import StorageService from './StorageService.js'
import SettingsService from './SettingsService.js'
import { createWorkspaceState } from '../types/Workspace.js'
import { getSubjectById, getChapterBySlug } from '../engine/blueprintService.js'

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

function sanitizeWorkspaceState(state) {
  const base = createWorkspaceState(state && typeof state === 'object' ? state : {})

  const subjectId = typeof base.currentSubjectId === 'string' && base.currentSubjectId.trim() ? base.currentSubjectId.trim() : null
  const subject = subjectId ? getSubjectById(subjectId) : null

  let chapterSlug = typeof base.currentChapterSlug === 'string' && base.currentChapterSlug.trim() ? base.currentChapterSlug.trim() : null
  if (subject && chapterSlug) {
    const chapterMatch = getChapterBySlug(subject.id, chapterSlug)
    if (!chapterMatch || !chapterMatch.chapter) {
      chapterSlug = null
    }
  } else if (chapterSlug) {
    chapterSlug = null
  }

  const next = createWorkspaceState({
    ...base,
    currentSubjectId: subject ? subject.id : null,
    currentChapterSlug: chapterSlug,
    currentTopicId: typeof base.currentTopicId === 'string' && base.currentTopicId.trim() ? base.currentTopicId.trim() : null,
    currentResourceId: typeof base.currentResourceId === 'string' && base.currentResourceId.trim() ? base.currentResourceId.trim() : null,
  })

  return next
}

function readAll() {
  const stored = StorageService.get(STORAGE_KEY, null)
  return sanitizeWorkspaceState(stored)
}

function writeAll(state) {
  const sanitized = sanitizeWorkspaceState(state)
  StorageService.set(STORAGE_KEY, sanitized)
  return sanitized
}

/** Returns the raw persisted workspace state regardless of the restore toggle. */
function get() {
  return readAll()
}

/** Returns the current workspace, or a blank one if "Restore Last Workspace" is disabled. */
function getState() {
  const restoreEnabled = SettingsService.getSetting('restoreLastWorkspace')
  if (restoreEnabled === false) return createWorkspaceState()
  return get()
}

function update(changes) {
  const next = sanitizeWorkspaceState({ ...get(), ...changes })
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
  get,
  getState,
  update,
  setCurrentSubject,
  setCurrentChapter,
  setCurrentTopic,
  setCurrentResource,
  reset,
  subscribe,
}

export default WorkspaceService
