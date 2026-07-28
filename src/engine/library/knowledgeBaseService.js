import { normalizeRootPath } from '../knowledgeBaseService'
import { LIBRARY_CATEGORY_ORDER, LIBRARY_CATEGORY_META } from '../../constants/libraryConstants'
import { createKnowledgeBaseConfig, createLibrarySubject } from './libraryModel'

/**
 * KNOWLEDGE BASE SERVICE (Library)
 * =================================
 * Sprint 24 — Knowledge Base & Resource Engine.
 *
 * Loads and validates `data/library/knowledgeBaseConfig.json` — the Master
 * Index's subject/folder vocabulary (never hardcoded; this is the source of
 * truth every other Library service reads from). Reuses
 * `engine/knowledgeBaseService.js`'s `normalizeRootPath` for path math
 * instead of re-implementing it, per the "no duplicate data structures"
 * rule — everything else here is specific to the flat config shape
 * introduced by this sprint's uploaded JSON, so it lives in its own file.
 *
 * NO FILE SYSTEM ACCESS. NO FOLDER SCANNING. This only builds path
 * *strings* and validates JSON already loaded into memory.
 */

/** Validates and normalizes a raw knowledge_base.json payload. Never throws. */
export function parseKnowledgeBaseConfig(raw) {
  const warnings = []

  if (!raw || typeof raw !== 'object') {
    return { config: createKnowledgeBaseConfig(), warnings: ['knowledge_base.json was empty or not valid JSON.'] }
  }

  const root = typeof raw.root === 'string' ? raw.root : ''
  if (!raw.root) warnings.push('knowledge_base.json is missing a "root" path.')

  const rawSubjects = Array.isArray(raw.subjects) ? raw.subjects : []
  if (!Array.isArray(raw.subjects)) warnings.push('knowledge_base.json is missing a "subjects" array.')

  const seenIds = new Set()
  const subjects = []

  rawSubjects.forEach((entry, index) => {
    if (!entry || typeof entry !== 'object') {
      warnings.push(`Subject at position ${index} was malformed and was skipped.`)
      return
    }

    const id = typeof entry.id === 'string' && entry.id.trim() ? entry.id.trim() : null
    const name = typeof entry.name === 'string' && entry.name.trim() ? entry.name.trim() : null

    if (!id || !name) {
      warnings.push(`Subject at position ${index} is missing an "id" or "name" and was skipped.`)
      return
    }

    if (seenIds.has(id)) {
      warnings.push(`Duplicate subject id "${id}" was skipped.`)
      return
    }
    seenIds.add(id)

    const categories = Array.isArray(entry.categories)
      ? entry.categories.filter((category) => typeof category === 'string')
      : []

    subjects.push(
      createLibrarySubject({
        id,
        name,
        folder: typeof entry.folder === 'string' && entry.folder.trim() ? entry.folder.trim() : name,
        categories,
      }),
    )
  })

  return {
    config: createKnowledgeBaseConfig({
      version: typeof raw.version === 'string' ? raw.version : '1.0.0',
      root,
      subjects,
    }),
    warnings,
  }
}

export function isRootConfigured(config) {
  return Boolean(normalizeRootPath(config?.root))
}

/** Case-insensitive lookup — books.json references subjects by display name, not id. */
export function findSubjectByName(config, name) {
  if (!name) return null
  const target = name.trim().toLowerCase()
  return config?.subjects?.find((subject) => subject.name.trim().toLowerCase() === target) ?? null
}

export function getSubjectById(config, subjectId) {
  return config?.subjects?.find((subject) => subject.id === subjectId) ?? null
}

/** Builds the full on-disk path for a resource, joining the configured root with its relative path. */
export function buildResourcePath(config, relativePath) {
  const root = normalizeRootPath(config?.root)
  if (!root || !relativePath) return relativePath || null
  const cleanRelative = String(relativePath).trim().replace(/^[\\/]+/, '')
  return `${root}\\${cleanRelative.replace(/\//g, '\\')}`
}

/** Which categories a subject actually declares, in the app-wide display order. */
export function getSubjectCategoryOrder(subject) {
  if (!subject) return LIBRARY_CATEGORY_ORDER
  const declaredLabels = new Set(subject.categories.map((label) => label.trim().toLowerCase()))
  return LIBRARY_CATEGORY_ORDER.filter((key) =>
    declaredLabels.has(LIBRARY_CATEGORY_META[key].label.toLowerCase()),
  )
}
