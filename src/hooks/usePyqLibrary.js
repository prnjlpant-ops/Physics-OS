import { useMemo, useState } from 'react'
import { pyqLibraryIndex, pyqLoadWarnings, pyqTopicIndex } from '../engine/pyq'
import { getAllPapers, getPaperById, getIndexStats, getTopicIndexForPaper } from '../engine/pyq/pyqService'
import { queryPapers, getDistinctYears, getDistinctSubjects } from '../engine/pyq/searchService'
import { DEFAULT_PAPER_SORT } from '../constants/pyqLibraryConstants'
import { usePaperBookmarks } from './usePaperBookmarks'
import { usePaperProgress } from './usePaperProgress'

/**
 * Sprint 25 — PYQ Engine.
 *
 * The main hook every Paper Library page/component uses. Wraps the
 * (static, built-once) Paper Library index with the bits of state a
 * browsing UI needs — search text, active filters, sort order — and
 * decorates each paper with its *live* status from
 * `QuestionProgressService`, since (unlike the Library's Book status)
 * paper status is user-driven, not derived once at load time.
 */
export function usePyqLibrary() {
  const allPapersRaw = useMemo(() => getAllPapers(pyqLibraryIndex), [])
  const { bookmarkIds, toggleBookmark } = usePaperBookmarks()
  const { getStatus, setStatus } = usePaperProgress()

  const allPapers = useMemo(
    () => allPapersRaw.map((paper) => ({ ...paper, status: getStatus(paper.id) })),
    [allPapersRaw, getStatus],
  )

  const years = useMemo(() => getDistinctYears(allPapersRaw), [allPapersRaw])
  const subjects = useMemo(() => getDistinctSubjects(allPapersRaw), [allPapersRaw])

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({
    exam: 'all',
    year: 'all',
    subject: 'all',
    status: 'all',
    bookmarkedOnly: false,
  })
  const [sortKey, setSortKey] = useState(DEFAULT_PAPER_SORT)

  const setFilter = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }))

  const results = useMemo(
    () => queryPapers(allPapers, { query: search, filters, sortKey, bookmarkedIds: bookmarkIds }),
    [allPapers, search, filters, sortKey, bookmarkIds],
  )

  const stats = useMemo(() => getIndexStats({ ...pyqLibraryIndex, papers: allPapers }), [allPapers])

  return {
    root: pyqLibraryIndex.root,
    years,
    subjects,
    allPapers,
    results,
    stats,
    search,
    setSearch,
    filters,
    setFilter,
    sortKey,
    setSortKey,
    warnings: pyqLoadWarnings,
    bookmarkIds,
    toggleBookmark,
    getStatus,
    setStatus,
    getPaperById: (id) => {
      const paper = getPaperById(pyqLibraryIndex, id)
      return paper ? { ...paper, status: getStatus(paper.id) } : null
    },
    getTopicIndexForPaper: (id) => getTopicIndexForPaper(pyqTopicIndex, id),
  }
}
