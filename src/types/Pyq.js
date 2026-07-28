/**
 * PYQ MODEL
 * =========
 * Sprint 0 — Foundation.
 *
 * Shared data-only shape for a Previous Year Question.
 *
 * @typedef {Object} Pyq
 * @property {string} id
 * @property {string} subjectId
 * @property {string} chapterSlug
 * @property {string} question
 * @property {number} [year]
 * @property {string} [source]
 * @property {string} [difficulty]
 */

/** @returns {Pyq} */
export function createPyq({
  id,
  subjectId,
  chapterSlug,
  question,
  year = null,
  source = null,
  difficulty = null,
}) {
  return { id, subjectId, chapterSlug, question, year, source, difficulty }
}
