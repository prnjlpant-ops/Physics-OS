/**
 * TOPIC SEARCH SERVICE
 * ====================
 * Sprint 26 — Topic Index & Study Mapping.
 *
 * Pure, stateless search + filter + sort functions over a flat list of
 * `TopicRecord`s (see `topicIndexService.js`'s `getAllTopics`). Mirrors
 * `engine/pyq/searchService.js`'s shape exactly — same composition order
 * (search -> filter -> sort) — so behavior feels identical across every
 * catalog page in the app, just over Topic/Chapter/Subject instead of
 * Exam/Year/Subject.
 */

/** Keyword search across topic name, chapter, subject and description. */
export function searchTopics(topics, query) {
  const trimmed = query?.trim().toLowerCase()
  if (!trimmed) return topics

  return topics.filter((topic) => {
    const haystack = [topic.name, topic.chapter, topic.subject, topic.description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(trimmed)
  })
}

/**
 * Filters by subject / chapter / status. Any filter left as 'all' (or
 * omitted) is skipped, so callers can pass a partial filter object.
 * `getStatus` must be supplied for the `status` filter to take effect,
 * since topic status is user-driven (persisted), not a static field.
 */
export function filterTopics(topics, { subjectId = 'all', chapterSlug = 'all', status = 'all' } = {}, getStatus = () => null) {
  return topics.filter((topic) => {
    if (subjectId !== 'all' && topic.subjectId !== subjectId) return false
    if (chapterSlug !== 'all' && topic.chapterSlug !== chapterSlug) return false
    if (status !== 'all' && getStatus(topic.id) !== status) return false
    return true
  })
}

export function sortTopics(topics, sortKey = 'name-asc') {
  const sorted = [...topics]
  switch (sortKey) {
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'subject':
      return sorted.sort((a, b) => a.subject.localeCompare(b.subject) || a.chapter.localeCompare(b.chapter))
    case 'chapter':
      return sorted.sort((a, b) => a.chapter.localeCompare(b.chapter))
    case 'name-asc':
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
  }
}

/** Composes search + filters + sort in the one order every Topic Index page needs. */
export function queryTopics(topics, { query = '', filters = {}, sortKey = 'name-asc', getStatus = () => null } = {}) {
  const searched = searchTopics(topics, query)
  const filtered = filterTopics(searched, filters, getStatus)
  return sortTopics(filtered, sortKey)
}

/** Distinct chapter list (within an optional subject scope), for building the Chapter filter. */
export function getDistinctChapters(topics, subjectId = 'all') {
  const scoped = subjectId === 'all' ? topics : topics.filter((topic) => topic.subjectId === subjectId)
  const seen = new Map()
  scoped.forEach((topic) => {
    if (!seen.has(topic.chapterSlug)) seen.set(topic.chapterSlug, topic.chapter)
  })
  return [...seen.entries()]
    .map(([chapterSlug, chapterName]) => ({ chapterSlug, chapterName }))
    .sort((a, b) => a.chapterName.localeCompare(b.chapterName))
}

export const TopicSearchService = {
  searchTopics,
  filterTopics,
  sortTopics,
  queryTopics,
  getDistinctChapters,
}

export default TopicSearchService
