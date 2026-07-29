/**
 * WORKSPACE MODEL
 * ===============
 * Sprint 28 — Desktop Readiness Layer.
 *
 * Data-only shape persisted by `services/WorkspaceService.js`.
 *
 * @typedef {Object} WorkspaceState
 * @property {string|null} currentSubjectId
 * @property {string|null} currentChapterSlug
 * @property {string|null} currentTopicId
 * @property {string|null} currentResourceId
 */

/** @returns {WorkspaceState} */
export function createWorkspaceState({
  currentSubjectId = null,
  currentChapterSlug = null,
  currentTopicId = null,
  currentResourceId = null,
} = {}) {
  return { currentSubjectId, currentChapterSlug, currentTopicId, currentResourceId }
}
