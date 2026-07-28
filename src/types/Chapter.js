/**
 * CHAPTER MODEL
 * =============
 * Sprint 0 — Foundation.
 *
 * Shared data-only shape for a Chapter, nested under a Subject.
 *
 * @typedef {Object} Chapter
 * @property {string} slug
 * @property {string} name
 * @property {string} subjectId
 * @property {number} [weightage]
 * @property {Array<import('./Topic').Topic>} topics
 */

/** @returns {Chapter} */
export function createChapter({ slug, name, subjectId, weightage = null, topics = [] }) {
  return { slug, name, subjectId, weightage, topics }
}
