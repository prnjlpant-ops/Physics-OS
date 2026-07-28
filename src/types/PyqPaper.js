/**
 * PYQ PAPER MODEL
 * ===============
 * Sprint 0 pattern, added Sprint 25 — PYQ Engine.
 *
 * Shared data-only shape for a whole previous-year exam paper (a PDF, one
 * per exam/year), as distinct from `types/Pyq.js` — which already models a
 * single *question* attached to a Chapter (used by the existing
 * per-chapter PYQ practice feature at `/subjects/:subjectId/pyqs`, left
 * untouched by this sprint). Neither shape is a duplicate of the other:
 * this one describes a paper as a whole document; `Pyq` describes one
 * question inside a syllabus chapter.
 *
 * @typedef {Object} PyqPaper
 * @property {string} id
 * @property {string} exam One of `EXAM_ORDER` (constants/pyqLibraryConstants.js).
 * @property {string} subject
 * @property {number} year
 * @property {string} [path] Local path, relative to the Paper Library root.
 * @property {number|null} [questionCount] Only ever real once pyq_index.json (Sprint 26) is populated.
 */

/** @returns {PyqPaper} */
export function createPyqPaper({ id, exam, subject, year, path = null, questionCount = null }) {
  return { id, exam, subject, year, path, questionCount }
}
