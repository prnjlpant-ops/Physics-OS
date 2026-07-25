import { subjects as allSubjects } from '../constants/subjects'
import {
  KNOWLEDGE_BASE_CATEGORY_ORDER,
  KNOWLEDGE_BASE_CATEGORY_META,
} from '../constants/knowledgeBaseConstants'
import {
  MASTER_INDEX_VERSION,
  RESOURCE_STATUS,
  DEFAULT_RESOURCE_PRIORITY,
  DEFAULT_RESOURCE_STATUS,
} from '../constants/masterIndexConstants'
import { createMasterIndex, createMasterIndexResource, createSubjectEntry } from './masterIndexModel'

/**
 * MASTER INDEX SERVICE
 * ====================
 * Sprint 22 — Master Index Engine.
 *
 * Pure functions the rest of the app (starting with the Knowledge Base
 * module, and reusable by any future module) uses to read from, validate,
 * and reshape the Master Index. This service never touches localStorage or
 * the file system directly — that's context/MasterIndexProvider.jsx's job.
 * Nothing here scans a disk; resources only ever come from the index
 * itself (seeded defaults, or whatever the user imports).
 */

/**
 * Builds the Master Index's first-run contents: one resource record per
 * Knowledge Base category, for every subject in the syllabus. This is the
 * data-driven replacement for Sprint 21's on-the-fly placeholder cards —
 * the exact same information, but now a persisted, editable, exportable
 * record instead of something recomputed on every render.
 */
export function createDefaultMasterIndex() {
  const subjectsMap = Object.fromEntries(
    allSubjects.map((subject) => {
      const categories = Object.fromEntries(
        KNOWLEDGE_BASE_CATEGORY_ORDER.map((categoryKey) => {
          const meta = KNOWLEDGE_BASE_CATEGORY_META[categoryKey]
          const resource = createMasterIndexResource({
            id: `${subject.id}-${categoryKey}`,
            subjectId: subject.id,
            subjectName: subject.name,
            category: meta.label,
            categoryKey,
            title: meta.label,
            status: RESOURCE_STATUS.NOT_ADDED,
            localPath: null,
          })
          return [categoryKey, [resource]]
        }),
      )
      return [subject.id, createSubjectEntry({ subjectName: subject.name, categories })]
    }),
  )

  return createMasterIndex({ subjects: subjectsMap })
}

/**
 * Normalizes one resource record: fills missing/malformed fields with safe
 * defaults and — critically — always derives `status` from whether
 * `localPath` is actually set. A resource can never claim to be "In
 * Progress" or "Completed" while its path is empty; it always displays as
 * "Not Added" instead. This is what lets Import accept partially-filled-in
 * JSON without ever throwing or rendering something misleading.
 */
export function normalizeResource(raw, context = {}) {
  if (!raw || typeof raw !== 'object') return null

  const categoryKey = raw.categoryKey || context.categoryKey
  const meta = KNOWLEDGE_BASE_CATEGORY_META[categoryKey]
  const localPath =
    typeof raw.localPath === 'string' && raw.localPath.trim() ? raw.localPath.trim() : null

  return createMasterIndexResource({
    id:
      raw.id ||
      `${context.subjectId ?? 'subject'}-${categoryKey ?? 'category'}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
    subjectId: raw.subjectId || context.subjectId,
    subjectName: raw.subjectName || context.subjectName,
    category: raw.category || meta?.label || categoryKey,
    categoryKey,
    title:
      typeof raw.title === 'string' && raw.title.trim() ? raw.title.trim() : meta?.label ?? 'Untitled',
    author: raw.author || null,
    edition: raw.edition || null,
    priority: raw.priority || DEFAULT_RESOURCE_PRIORITY,
    tags: Array.isArray(raw.tags) ? raw.tags.filter((tag) => typeof tag === 'string') : [],
    status: localPath ? raw.status || DEFAULT_RESOURCE_STATUS : RESOURCE_STATUS.NOT_ADDED,
    localPath,
    notes: typeof raw.notes === 'string' ? raw.notes : '',
  })
}

/**
 * Validates and normalizes an entire Master Index payload (e.g. freshly
 * parsed from an imported JSON file). Never throws — always returns a
 * usable index plus a list of human-readable warnings for anything it had
 * to fill in or drop.
 */
export function validateMasterIndex(raw) {
  const warnings = []

  if (!raw || typeof raw !== 'object') {
    return {
      index: createDefaultMasterIndex(),
      warnings: ['File was empty or not valid JSON — loaded defaults instead.'],
    }
  }

  const rawSubjects = raw.subjects && typeof raw.subjects === 'object' ? raw.subjects : {}
  if (!raw.subjects) warnings.push('Missing "subjects" — treated as empty.')

  const subjectsMap = {}

  Object.entries(rawSubjects).forEach(([subjectId, entry]) => {
    if (!entry || typeof entry !== 'object') {
      warnings.push(`Subject "${subjectId}" was malformed and was skipped.`)
      return
    }

    const subjectName = typeof entry.subjectName === 'string' ? entry.subjectName : subjectId
    const rawCategories =
      entry.categories && typeof entry.categories === 'object' ? entry.categories : {}
    const categories = {}

    KNOWLEDGE_BASE_CATEGORY_ORDER.forEach((categoryKey) => {
      const list = Array.isArray(rawCategories[categoryKey]) ? rawCategories[categoryKey] : []
      categories[categoryKey] = list
        .map((resource) => normalizeResource(resource, { subjectId, subjectName, categoryKey }))
        .filter(Boolean)
    })

    subjectsMap[subjectId] = createSubjectEntry({ subjectName, categories })
  })

  return {
    index: createMasterIndex({ subjects: subjectsMap, updatedAt: raw.updatedAt }),
    warnings,
  }
}

/** Returns the full category map for one subject, filling in any subject the index doesn't know about yet. */
export function getSubjectResources(index, subjectId) {
  const entry = index?.subjects?.[subjectId]
  if (entry) return entry.categories

  return Object.fromEntries(KNOWLEDGE_BASE_CATEGORY_ORDER.map((categoryKey) => [categoryKey, []]))
}

export function getCategoryResources(index, subjectId, categoryKey) {
  return getSubjectResources(index, subjectId)[categoryKey] ?? []
}

/** Flattens one category across every subject — for future modules (e.g. a global "All Notes" view). */
export function getResourcesByCategory(index, categoryKey) {
  return Object.values(index?.subjects ?? {}).flatMap((entry) => entry.categories?.[categoryKey] ?? [])
}

export function exportMasterIndexJson(index) {
  return JSON.stringify(
    { ...index, version: MASTER_INDEX_VERSION, updatedAt: new Date().toISOString() },
    null,
    2,
  )
}

/** Parses an imported JSON string. Never throws — returns { index, warnings, error }. */
export function parseMasterIndexJson(jsonString) {
  try {
    const parsed = JSON.parse(jsonString)
    const { index, warnings } = validateMasterIndex(parsed)
    return { index, warnings, error: null }
  } catch {
    return { index: null, warnings: [], error: 'That file is not valid JSON.' }
  }
}
