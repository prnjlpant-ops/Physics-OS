import { PAPER_STATUS } from '../../constants/pyqLibraryConstants'

/**
 * PYQ MODEL
 * =========
 * Sprint 25 — PYQ Engine.
 *
 * Plain, source-agnostic shapes for the Paper Library — no storage, no
 * validation, no side effects (see `paperService.js` for that). Mirrors
 * the Model/Service split already used by `engine/library/libraryModel.js`
 * + `engine/library/knowledgeBaseService.js`.
 *
 * PaperRecord shape (one whole exam paper, built from pyqs.json):
 * {
 *   id, exam, subject, year, path, fullPath, status, questionCount
 * }
 */
export function createPaperRecord({
  id,
  exam,
  subject,
  year,
  path = null,
  fullPath = null,
  status = PAPER_STATUS.NOT_STARTED,
  questionCount = null,
}) {
  return { id, exam, subject, year, path, fullPath, status, questionCount }
}

/** The whole Paper Library index — every paper, plus the configured root. */
export function createPyqLibraryIndex({ root = '', papers = [] } = {}) {
  return { root, papers }
}

/**
 * FUTURE INDEX SUPPORT (Sprint 26) — do not populate yet.
 * ---------------------------------------------------------------
 * The shape `pyq_index.json` will eventually carry, once topic-wise
 * indexing is built: for a given paper, its questions grouped by Subject
 * -> Chapter -> Topic. Defined now purely so `pyqService.js`'s
 * `getTopicIndexForPaper()` has a stable contract to return, and so
 * Sprint 26 can start filling in `pyq_index.json` without any other file
 * in this sprint needing to change shape.
 *
 * TopicIndexEntry shape:
 * {
 *   paperId,
 *   subjects: [
 *     { subjectId, subjectName, chapters: [
 *       { chapterSlug, chapterName, topics: [
 *         { topicId, topicName, questionIds: [] }
 *       ] }
 *     ] }
 *   ]
 * }
 */
export function createTopicIndexEntry({ paperId, subjects = [] }) {
  return { paperId, subjects }
}
