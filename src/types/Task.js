/**
 * TASK MODEL
 * ==========
 * Sprint 0 — Foundation.
 *
 * Generic, source-agnostic data-only shape for a study Task. The Daily
 * Study Engine and Planner already have their own richer, feature-specific
 * task factories (`engine/taskModel.js`, `engine/plannerModel.js`) built
 * for those sprints' needs — those are unchanged. This shape is the
 * minimal common contract any future module can use without depending on
 * that engine.
 *
 * @typedef {Object} Task
 * @property {string} id
 * @property {string} title
 * @property {string} [type]
 * @property {string} status
 * @property {number} [estimatedMinutes]
 * @property {string} [subjectId]
 * @property {string} [chapterSlug]
 */

/** @returns {Task} */
export function createTask({
  id,
  title,
  type = null,
  status = 'Pending',
  estimatedMinutes = null,
  subjectId = null,
  chapterSlug = null,
}) {
  return { id, title, type, status, estimatedMinutes, subjectId, chapterSlug }
}
