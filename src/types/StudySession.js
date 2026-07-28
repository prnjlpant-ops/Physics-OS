/**
 * STUDY SESSION MODEL
 * ===================
 * Sprint 0 — Foundation.
 *
 * Shared data-only shape for a completed Study Timer session. Mirrors what
 * `utils/studySessionsStorage.js` already persists; that module and its
 * storage key are unchanged by this sprint.
 *
 * @typedef {Object} StudySession
 * @property {string} id
 * @property {string} startedAt ISO timestamp
 * @property {string} endedAt ISO timestamp
 * @property {number} durationMinutes
 * @property {string} [subjectId]
 * @property {string} [chapterSlug]
 * @property {string} [notes]
 */

/** @returns {StudySession} */
export function createStudySession({
  id,
  startedAt,
  endedAt,
  durationMinutes,
  subjectId = null,
  chapterSlug = null,
  notes = '',
}) {
  return { id, startedAt, endedAt, durationMinutes, subjectId, chapterSlug, notes }
}
