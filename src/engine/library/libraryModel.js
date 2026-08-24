import { DEFAULT_LIBRARY_PRIORITY } from '../../constants/libraryConstants'

/**
 * LIBRARY MODEL
 * =============
 * Sprint 24 — Knowledge Base & Resource Engine.
 *
 * Plain, source-agnostic shapes for the Library module — no storage, no
 * validation, no side effects (see `booksService.js` / `knowledgeBaseService.js`
 * for that). Mirrors the existing Model/Service split used by
 * `engine/masterIndexModel.js` + `engine/masterIndexService.js`.
 *
 * LibraryResource shape (a Book today; any future category reuses the same
 * shape, following Sprint 22's precedent of one generic resource record):
 * {
 *   id, category, categoryKey, title, author, edition, subjectId,
 *   subjectName, priority, description, tags, status, path, url, notes
 * }
 */
export function createLibraryResource({
  id,
  category,
  categoryKey,
  title,
  author = null,
  edition = null,
  subjectId,
  subjectName,
  priority = DEFAULT_LIBRARY_PRIORITY,
  description = '',
  tags = [],
  status = 'Not Added',
  path = null,
  url = null,
  notes = '',
  pages = null,
  duration = null,
}) {
  return {
    id,
    category,
    categoryKey,
    title,
    author,
    edition,
    subjectId,
    subjectName,
    priority,
    description: typeof description === 'string' ? description : '',
    tags: Array.isArray(tags) ? tags : [],
    status,
    path: path || null,
    url: url || null,
    notes: typeof notes === 'string' ? notes : '',
    pages: Number.isFinite(pages) && pages > 0 ? pages : null,
    duration: typeof duration === 'string' && duration.trim() ? duration.trim() : null,
  }
}

/** One subject's folder + category vocabulary, as declared by knowledge_base.json. */
export function createLibrarySubject({ id, name, folder, categories = [] }) {
  return { id, name, folder, categories: Array.isArray(categories) ? categories : [] }
}

/** The whole Knowledge Base config (root path + subject list). */
export function createKnowledgeBaseConfig({ version = '1.0.0', root = '', subjects = [] } = {}) {
  return { version, root, subjects }
}

/**
 * The Master Index — the merged, queryable view every future module reads
 * from. `subjects` mirrors knowledge_base.json's subject list; each
 * subject's `categories` map is keyed the same way as
 * `LIBRARY_CATEGORY_ORDER`, with real records for Books (Sprint 24) and
 * empty arrays for every other category until a future sprint populates it.
 */
export function createMasterIndex({ root = '', subjects = {}, unassigned = [], unassignedVideos = [] } = {}) {
  return { root, subjects, unassigned, unassignedVideos }
}
