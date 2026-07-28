import {
  ACTIVE_LIBRARY_CATEGORY,
  DEFAULT_LIBRARY_PRIORITY,
  LIBRARY_CATEGORY_META,
  LIBRARY_PRIORITY_ORDER,
  UNASSIGNED_SUBJECT_ID,
  UNASSIGNED_SUBJECT_NAME,
} from '../../constants/libraryConstants'
import { createLibraryResource } from './libraryModel'
import { findSubjectByName, buildResourcePath } from './knowledgeBaseService'

/**
 * BOOKS SERVICE
 * =============
 * Sprint 24 — Knowledge Base & Resource Engine.
 *
 * Turns raw `books.json` into normalized `LibraryResource` records. Books
 * are never hardcoded — every book displayed anywhere in the app is loaded
 * dynamically through this service. Validation never throws: malformed
 * entries are fixed up with safe defaults (or skipped, for duplicates) and
 * reported back as human-readable warnings, the same contract
 * `engine/masterIndexService.js` already uses for its own JSON import.
 */

function normalizePriority(rawPriority) {
  if (typeof rawPriority === 'string' && LIBRARY_PRIORITY_ORDER.includes(rawPriority)) {
    return rawPriority
  }
  return DEFAULT_LIBRARY_PRIORITY
}

/**
 * Normalizes one raw book entry against the Knowledge Base config.
 * Returns `{ resource, warnings }` — never throws, never drops required
 * display fields (falls back to placeholder text instead).
 */
function normalizeBook(raw, config, index) {
  const warnings = []

  if (!raw || typeof raw !== 'object') {
    warnings.push(`Book at position ${index} was malformed and was skipped.`)
    return { resource: null, warnings }
  }

  const id =
    typeof raw.id === 'string' && raw.id.trim() ? raw.id.trim() : `book-${index}-${Math.random().toString(36).slice(2, 8)}`
  if (!raw.id) warnings.push(`Book "${raw.title ?? id}" is missing an "id" — one was generated.`)

  const title = typeof raw.title === 'string' && raw.title.trim() ? raw.title.trim() : 'Untitled Book'
  if (!raw.title) warnings.push(`Book "${id}" is missing a "title".`)

  const author = typeof raw.author === 'string' && raw.author.trim() ? raw.author.trim() : 'Unknown Author'
  if (!raw.author) warnings.push(`Book "${title}" is missing an "author".`)

  const matchedSubject = findSubjectByName(config, raw.subject)
  if (raw.subject && !matchedSubject) {
    warnings.push(`Book "${title}" references unknown subject "${raw.subject}" — grouped under Unassigned.`)
  }
  if (!raw.subject) {
    warnings.push(`Book "${title}" is missing a "subject" — grouped under Unassigned.`)
  }

  const subjectId = matchedSubject?.id ?? UNASSIGNED_SUBJECT_ID
  const subjectName = matchedSubject?.name ?? (typeof raw.subject === 'string' && raw.subject.trim() ? raw.subject.trim() : UNASSIGNED_SUBJECT_NAME)

  const path = typeof raw.path === 'string' && raw.path.trim() ? raw.path.trim() : null
  const fullPath = buildResourcePath(config, path)

  const resource = createLibraryResource({
    id,
    category: LIBRARY_CATEGORY_META[ACTIVE_LIBRARY_CATEGORY].label,
    categoryKey: ACTIVE_LIBRARY_CATEGORY,
    title,
    author,
    edition: typeof raw.edition === 'string' && raw.edition.trim() ? raw.edition.trim() : null,
    subjectId,
    subjectName,
    priority: normalizePriority(raw.priority),
    description: typeof raw.description === 'string' ? raw.description : '',
    tags: Array.isArray(raw.tags) ? raw.tags.filter((tag) => typeof tag === 'string') : [],
    status: fullPath ? 'Available' : 'Not Added',
    path: fullPath,
    url: typeof raw.url === 'string' && raw.url.trim() ? raw.url.trim() : null,
  })

  return { resource, warnings }
}

/**
 * Validates and normalizes an entire books.json payload. Never throws —
 * always returns a usable book list plus warnings for anything dropped or
 * defaulted. Handles: invalid JSON shape, missing fields, duplicate ids,
 * and unknown subjects (per Sprint 24's VALIDATION section).
 */
export function parseBooksJson(raw, config) {
  const warnings = []

  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.books)) {
    return { books: [], warnings: ['books.json was empty, not valid JSON, or missing a "books" array.'] }
  }

  const seenIds = new Set()
  const books = []

  raw.books.forEach((rawBook, index) => {
    const { resource, warnings: bookWarnings } = normalizeBook(rawBook, config, index)
    warnings.push(...bookWarnings)
    if (!resource) return

    if (seenIds.has(resource.id)) {
      warnings.push(`Duplicate book id "${resource.id}" was skipped.`)
      return
    }
    seenIds.add(resource.id)
    books.push(resource)
  })

  return { books, warnings }
}

export function getBookById(books, id) {
  return books.find((book) => book.id === id) ?? null
}
