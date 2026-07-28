import { LIBRARY_CATEGORY_ORDER, UNASSIGNED_SUBJECT_ID, UNASSIGNED_SUBJECT_NAME } from '../../constants/libraryConstants'
import { createMasterIndex } from './libraryModel'

/**
 * MASTER INDEX SERVICE (Library)
 * ===============================
 * Sprint 24 — Knowledge Base & Resource Engine.
 *
 * Builds the Library's Master Index: knowledge_base.json's subject/folder
 * vocabulary, merged with the real Book records booksService.js produced
 * from books.json. Every other category (Solution Manuals, Formula Sheets,
 * Memory Sheets, Notes, Videos, Research Papers, Conceptual Resources,
 * Assets, PYQs) is declared but starts empty — this is the data layer
 * future sprints populate without changing this shape.
 *
 * This is the single source of truth every Library page/component reads
 * from — no page ever imports books.json or knowledgeBaseConfig.json
 * directly.
 */
export function buildMasterIndex({ config, books }) {
  const subjects = {}
  const unassigned = []

  config.subjects.forEach((subject) => {
    const categories = Object.fromEntries(LIBRARY_CATEGORY_ORDER.map((key) => [key, []]))
    subjects[subject.id] = { id: subject.id, name: subject.name, folder: subject.folder, categories }
  })

  books.forEach((book) => {
    if (book.subjectId === UNASSIGNED_SUBJECT_ID || !subjects[book.subjectId]) {
      unassigned.push(book)
      return
    }
    subjects[book.subjectId].categories[book.categoryKey].push(book)
  })

  return createMasterIndex({ root: config.root, subjects, unassigned })
}

export function getSubjects(index) {
  return Object.values(index?.subjects ?? {})
}

export function getSubjectEntry(index, subjectId) {
  if (subjectId === UNASSIGNED_SUBJECT_ID) {
    return { id: UNASSIGNED_SUBJECT_ID, name: UNASSIGNED_SUBJECT_NAME, folder: null, categories: {} }
  }
  return index?.subjects?.[subjectId] ?? null
}

export function getCategoryResources(index, subjectId, categoryKey) {
  if (subjectId === UNASSIGNED_SUBJECT_ID) {
    return categoryKey === 'books' ? index?.unassigned ?? [] : []
  }
  return index?.subjects?.[subjectId]?.categories?.[categoryKey] ?? []
}

/** Flattens one category across every subject, including Unassigned. */
export function getResourcesByCategory(index, categoryKey) {
  const fromSubjects = getSubjects(index).flatMap((entry) => entry.categories?.[categoryKey] ?? [])
  const fromUnassigned = categoryKey === 'books' ? index?.unassigned ?? [] : []
  return [...fromSubjects, ...fromUnassigned]
}

/** Every resource in the index, across every subject and category. */
export function getAllResources(index) {
  return LIBRARY_CATEGORY_ORDER.flatMap((categoryKey) => getResourcesByCategory(index, categoryKey))
}

export function getResourceById(index, resourceId) {
  return getAllResources(index).find((resource) => resource.id === resourceId) ?? null
}

export function getIndexStats(index) {
  const all = getAllResources(index)
  return {
    subjectCount: getSubjects(index).length,
    totalResources: all.length,
    available: all.filter((resource) => resource.status === 'Available').length,
    notAdded: all.filter((resource) => resource.status !== 'Available').length,
  }
}
