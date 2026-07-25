import {
  MASTER_INDEX_VERSION,
  DEFAULT_RESOURCE_PRIORITY,
  DEFAULT_RESOURCE_STATUS,
} from '../constants/masterIndexConstants'

/**
 * MASTER INDEX MODEL
 * ==================
 * Sprint 22 — Master Index Engine.
 *
 * Reusable shapes for the Master Index, one layer above raw storage
 * (context/MasterIndexProvider.jsx). Mirrors the Model/Service split used
 * elsewhere in the engine layer (see engine/knowledgeBaseModel.js).
 *
 * Master Index Resource shape:
 * {
 *   id, subjectId, subjectName, category, categoryKey,
 *   title, author, edition, priority, tags, status, localPath, notes
 * }
 *
 * Master Index shape (the whole file/store):
 * {
 *   version,
 *   updatedAt,
 *   subjects: {
 *     [subjectId]: {
 *       subjectName,
 *       categories: { [categoryKey]: MasterIndexResource[] }
 *     }
 *   }
 * }
 */
export function createMasterIndexResource({
  id,
  subjectId,
  subjectName,
  category,
  categoryKey,
  title,
  author = null,
  edition = null,
  priority = DEFAULT_RESOURCE_PRIORITY,
  tags = [],
  status = DEFAULT_RESOURCE_STATUS,
  localPath = null,
  notes = '',
}) {
  return {
    id,
    subjectId,
    subjectName,
    category,
    categoryKey,
    title,
    author,
    edition,
    priority,
    tags: Array.isArray(tags) ? tags : [],
    status,
    localPath: localPath || null,
    notes: typeof notes === 'string' ? notes : '',
  }
}

export function createMasterIndex({ subjects = {}, updatedAt = null } = {}) {
  return {
    version: MASTER_INDEX_VERSION,
    updatedAt: updatedAt ?? new Date().toISOString(),
    subjects,
  }
}

export function createSubjectEntry({ subjectName, categories = {} }) {
  return { subjectName, categories }
}
