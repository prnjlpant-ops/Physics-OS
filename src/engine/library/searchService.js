/**
 * SEARCH SERVICE
 * ==============
 * Sprint 24 — Knowledge Base & Resource Engine.
 *
 * Pure, stateless search + filter functions over a flat list of
 * LibraryResource records (see `masterIndexService.js`'s `getAllResources`).
 * Keeps no state of its own — every page composes these the same way, so
 * behavior stays identical whether searching all resources, one subject,
 * or one category.
 */

/** Keyword search across title, author, subject, priority and tags. */
export function searchResources(resources, query) {
  const trimmed = query?.trim().toLowerCase()
  if (!trimmed) return resources

  return resources.filter((resource) => {
    const haystack = [
      resource.title,
      resource.author,
      resource.subjectName,
      resource.priority,
      resource.edition,
      ...(resource.tags ?? []),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(trimmed)
  })
}

/**
 * Filters by subject / priority / category / author. Any filter left as
 * 'all' (or omitted) is skipped, so callers can pass a single partial
 * filter object.
 */
export function filterResources(resources, { subjectId = 'all', priority = 'all', categoryKey = 'all', author = 'all' } = {}) {
  return resources.filter((resource) => {
    if (subjectId !== 'all' && resource.subjectId !== subjectId) return false
    if (priority !== 'all' && resource.priority !== priority) return false
    if (categoryKey !== 'all' && resource.categoryKey !== categoryKey) return false
    if (author !== 'all' && resource.author !== author) return false
    return true
  })
}

export function sortResources(resources, sortKey = 'title-asc') {
  const sorted = [...resources]
  switch (sortKey) {
    case 'title-desc':
      return sorted.sort((a, b) => (b.title ?? '').localeCompare(a.title ?? ''))
    case 'priority': {
      const order = { Essential: 0, High: 1, Medium: 2, Reference: 3 }
      return sorted.sort((a, b) => (order[a.priority] ?? 99) - (order[b.priority] ?? 99))
    }
    case 'subject':
      return sorted.sort((a, b) => (a.subjectName ?? '').localeCompare(b.subjectName ?? ''))
    case 'author':
      return sorted.sort((a, b) => (a.author ?? '').localeCompare(b.author ?? ''))
    case 'title-asc':
    default:
      return sorted.sort((a, b) => (a.title ?? '').localeCompare(b.title ?? ''))
  }
}

/** Composes search + filters + sort in the one order every Library page needs. */
export function queryResources(resources, { query = '', filters = {}, sortKey = 'title-asc' } = {}) {
  const searched = searchResources(resources, query)
  const filtered = filterResources(searched, filters)
  return sortResources(filtered, sortKey)
}

/** Distinct author list for a resource set, for building the Author filter options. */
export function getDistinctAuthors(resources) {
  return [...new Set(resources.map((resource) => resource.author).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b),
  )
}
