/**
 * SEARCH SERVICE
 * ==============
 * Sprint 25 — PYQ Engine.
 *
 * Pure, stateless search + filter + sort functions over a flat list of
 * `PaperRecord`s (see `pyqService.js`'s `getAllPapers`). Mirrors
 * `engine/library/searchService.js`'s shape exactly — same composition
 * order (search -> filter -> sort) — so behavior feels identical to the
 * Library, just over Exam/Year/Subject instead of Title/Author.
 */

/** Keyword search across exam, subject and year. */
export function searchPapers(papers, query) {
  const trimmed = query?.trim().toLowerCase()
  if (!trimmed) return papers

  return papers.filter((paper) => {
    const haystack = [paper.exam, paper.subject, paper.year != null ? String(paper.year) : null]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(trimmed)
  })
}

/**
 * Filters by exam / year / subject / status / bookmarked. Any filter left
 * as 'all' (or omitted) is skipped, so callers can pass a partial filter
 * object. `bookmarkedIds` must be supplied for the `bookmarkedOnly` filter
 * to take effect.
 */
export function filterPapers(
  papers,
  { exam = 'all', year = 'all', subject = 'all', status = 'all', bookmarkedOnly = false } = {},
  bookmarkedIds = [],
) {
  return papers.filter((paper) => {
    if (exam !== 'all' && paper.exam !== exam) return false
    if (year !== 'all' && String(paper.year) !== String(year)) return false
    if (subject !== 'all' && paper.subject !== subject) return false
    if (status !== 'all' && paper.status !== status) return false
    if (bookmarkedOnly && !bookmarkedIds.includes(paper.id)) return false
    return true
  })
}

export function sortPapers(papers, sortKey = 'year-desc') {
  const sorted = [...papers]
  switch (sortKey) {
    case 'year-asc':
      return sorted.sort((a, b) => (a.year ?? 0) - (b.year ?? 0))
    case 'exam':
      return sorted.sort((a, b) => a.exam.localeCompare(b.exam) || (b.year ?? 0) - (a.year ?? 0))
    case 'subject':
      return sorted.sort((a, b) => a.subject.localeCompare(b.subject))
    case 'status':
      return sorted.sort((a, b) => a.status.localeCompare(b.status))
    case 'year-desc':
    default:
      return sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
  }
}

/** Composes search + filters + sort in the one order every Paper Library page needs. */
export function queryPapers(papers, { query = '', filters = {}, sortKey = 'year-desc', bookmarkedIds = [] } = {}) {
  const searched = searchPapers(papers, query)
  const filtered = filterPapers(searched, filters, bookmarkedIds)
  return sortPapers(filtered, sortKey)
}

/** Distinct year list, newest first — for building the Year filter options. */
export function getDistinctYears(papers) {
  return [...new Set(papers.map((paper) => paper.year).filter((year) => year != null))].sort(
    (a, b) => b - a,
  )
}

/** Distinct subject list — for building the Subject filter options. */
export function getDistinctSubjects(papers) {
  return [...new Set(papers.map((paper) => paper.subject).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  )
}

export const SearchService = {
  searchPapers,
  filterPapers,
  sortPapers,
  queryPapers,
  getDistinctYears,
  getDistinctSubjects,
}

export default SearchService
