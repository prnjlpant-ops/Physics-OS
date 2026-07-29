import StorageService from './StorageService'
import { normalizeRootPath, buildSubjectPath, buildCategoryPath } from '../engine/knowledgeBaseService'

/**
 * PATH RESOLVER SERVICE
 * =====================
 * Sprint 28 — Desktop Readiness Layer.
 *
 * The single place that turns "a resource's metadata" into "a path or URL
 * worth trying to open" — never a hardcoded OS path. Reuses the existing
 * path-building math in `engine/knowledgeBaseService.js` (Sprint 21)
 * rather than re-implementing it, per the "no duplicated logic" rule.
 *
 * Reads the same Knowledge Base Root the Settings page already manages
 * (`useKnowledgeBaseSettings.js`'s storage key) so both stay in sync
 * without this service owning or duplicating that state.
 */

// Matches useKnowledgeBaseSettings.js's SETTINGS_STORAGE_KEY exactly —
// StorageService automatically prefixes with "physicsOS." the same way
// that hook's own key already is.
const KNOWLEDGE_BASE_SETTINGS_KEY = 'knowledgeBaseSettings'

function getKnowledgeBaseRoot() {
  const stored = StorageService.get(KNOWLEDGE_BASE_SETTINGS_KEY, { rootPath: '' })
  return normalizeRootPath(stored?.rootPath)
}

function isKnowledgeBaseRootConfigured() {
  return getKnowledgeBaseRoot().length > 0
}

/** Builds `<root>\<Subject>` from the configured Knowledge Base root. */
function resolveSubjectPath(subjectName) {
  return buildSubjectPath(getKnowledgeBaseRoot(), subjectName)
}

/** Builds `<root>\<Subject>\<Category>` from the configured Knowledge Base root. */
function resolveCategoryPath(subjectName, categoryKey) {
  return buildCategoryPath(getKnowledgeBaseRoot(), subjectName, categoryKey)
}

/**
 * Metadata-based lookup: given any resource-shaped object (Master Index
 * resource, Library resource, PYQ paper, Book), returns the best
 * available `{ path, url }` pair without assuming a fixed field name —
 * different modules call their local path `localPath`, `path`, or
 * `fullPath`.
 */
function resolveResourceLocation(resource) {
  if (!resource || typeof resource !== 'object') return { path: null, url: null }

  const path = resource.localPath || resource.path || resource.fullPath || null
  const url = typeof resource.url === 'string' && resource.url.trim() ? resource.url.trim() : null

  return { path, url }
}

/**
 * Placeholder for Sprint 29 (Electron): once a real desktop build exposes
 * an absolute filesystem root, this is where a relative path gets
 * resolved against it. Browser mode has no such root, so this always
 * returns null rather than guessing an OS path.
 */
function resolveDesktopAbsolutePath() {
  return null
}

export const PathResolverService = {
  getKnowledgeBaseRoot,
  isKnowledgeBaseRootConfigured,
  resolveSubjectPath,
  resolveCategoryPath,
  resolveResourceLocation,
  resolveDesktopAbsolutePath,
}

export default PathResolverService
