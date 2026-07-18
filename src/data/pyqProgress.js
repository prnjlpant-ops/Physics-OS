import { PYQ_STATUS } from '../constants/pyqConstants'

/**
 * Builds Progress Panel numbers (Total / Solved / Remaining / Bookmarked /
 * Revision Queue) for any list of PYQs, using live status overrides,
 * bookmark ids, and revision queue ids from their respective hooks.
 */
export function getPyqProgress(pyqList, { getStatus, bookmarkedIds, queuedIds }) {
  const total = pyqList.length
  const solved = pyqList.filter((pyq) => getStatus(pyq) === PYQ_STATUS.SOLVED).length
  const bookmarked = pyqList.filter((pyq) => bookmarkedIds.includes(pyq.id)).length
  const inQueue = pyqList.filter((pyq) => queuedIds.includes(pyq.id)).length

  return {
    total,
    solved,
    remaining: total - solved,
    bookmarked,
    revisionQueue: inQueue,
  }
}

export function getChapterPyqStats(allPyqs, subjectId, chapterSlug, getStatus) {
  const chapterPyqs = allPyqs.filter(
    (pyq) => pyq.subjectId === subjectId && pyq.chapterSlug === chapterSlug,
  )
  const solved = chapterPyqs.filter((pyq) => getStatus(pyq) === PYQ_STATUS.SOLVED).length

  return { totalQuestions: chapterPyqs.length, solved }
}
