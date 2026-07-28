/**
 * TOPIC MODEL
 * ===========
 * Sprint 0 — Foundation.
 *
 * Shared data-only shape for a Topic, the leaf of the syllabus tree
 * (Subject -> Chapter -> Topic -> Resources). Status values should align
 * with `TOPIC_STATUS` in `constants/syllabusConstants.js`.
 *
 * @typedef {Object} Topic
 * @property {string} id
 * @property {string} name
 * @property {string} subjectId
 * @property {string} chapterSlug
 * @property {string} [status]
 */

/** @returns {Topic} */
export function createTopic({ id, name, subjectId, chapterSlug, status = 'Not Started' }) {
  return { id, name, subjectId, chapterSlug, status }
}
