import { KNOWLEDGE_BASE_CATEGORY_META } from '../constants/knowledgeBaseConstants'

/**
 * KNOWLEDGE BASE SERVICE
 * ======================
 * Sprint 21 — Knowledge Base Integration.
 * Sprint 22 — Master Index Engine: this service no longer generates
 * placeholder resource cards (see engine/masterIndexService.js for that —
 * resources now come from the Master Index). What's left here is just the
 * pure path-building math for the "Knowledge Base Root Path" preview shown
 * in Settings and on each Subject's Knowledge Base tab.
 *
 * NO AUTOMATIC SCANNING. NO FILE SYSTEM ACCESS. This service never reads
 * the user's disk — it only builds path *strings* from the root the user
 * typed in Settings.
 */

/** Strips trailing slashes/backslashes and surrounding whitespace. */
export function normalizeRootPath(rootPath) {
  if (!rootPath || typeof rootPath !== 'string') return ''
  return rootPath.trim().replace(/[\\/]+$/, '')
}

export function isRootPathConfigured(rootPath) {
  return normalizeRootPath(rootPath).length > 0
}

/** Builds the folder path for a subject inside the Knowledge Base root. */
export function buildSubjectPath(rootPath, subjectName) {
  const root = normalizeRootPath(rootPath)
  if (!root) return null
  return `${root}\\${subjectName}`
}

/** Builds the folder path for a category inside a subject's Knowledge Base folder. */
export function buildCategoryPath(rootPath, subjectName, categoryKey) {
  const subjectPath = buildSubjectPath(rootPath, subjectName)
  if (!subjectPath) return null
  const meta = KNOWLEDGE_BASE_CATEGORY_META[categoryKey]
  if (!meta) return null
  return `${subjectPath}\\${meta.label}`
}
