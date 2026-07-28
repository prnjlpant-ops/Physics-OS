import { PAPER_STATUS } from '../../constants/pyqLibraryConstants'

/**
 * PYQ SERVICE
 * ===========
 * Sprint 25 — PYQ Engine.
 *
 * The query layer every Paper Library page/hook reads through — no page
 * ever reads `engine/pyq/index.js`'s loaded index directly beyond calling
 * these getters. Mirrors `engine/library/masterIndexService.js`'s shape
 * (`getSubjects` / `getResourceById` / `getIndexStats`, here renamed to
 * match this sprint's PYQ vocabulary).
 *
 * FUTURE INDEX SUPPORT (Sprint 26): `getTopicIndexForPaper` is the one
 * seam a future topic-wise indexing sprint plugs into. It already reads
 * from the (currently always-empty) `pyq_index.json` map, so once that
 * file is populated, this function starts returning real data with no
 * signature change and no other file needing to change.
 */

export function getAllPapers(index) {
  return index?.papers ?? []
}

export function getPaperById(index, paperId) {
  return getAllPapers(index).find((paper) => paper.id === paperId) ?? null
}

export function getIndexStats(index) {
  const papers = getAllPapers(index)
  return {
    totalPapers: papers.length,
    withPath: papers.filter((paper) => Boolean(paper.path)).length,
    notAdded: papers.filter((paper) => !paper.path).length,
    completed: papers.filter((paper) => paper.status === PAPER_STATUS.COMPLETED).length,
  }
}

/**
 * Returns the topic-wise index entry for one paper, or `null` if
 * `pyq_index.json` has nothing for it yet (true for every paper today).
 * `rawTopicIndex` is the parsed `{ version, papers: { [paperId]: entry } }`
 * object from `engine/pyq/index.js`.
 */
export function getTopicIndexForPaper(rawTopicIndex, paperId) {
  return rawTopicIndex?.papers?.[paperId] ?? null
}

export function hasTopicIndex(rawTopicIndex, paperId) {
  return getTopicIndexForPaper(rawTopicIndex, paperId) !== null
}

export const PYQService = {
  getAllPapers,
  getPaperById,
  getIndexStats,
  getTopicIndexForPaper,
  hasTopicIndex,
}

export default PYQService
