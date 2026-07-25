import { KNOWLEDGE_BASE_CATEGORY_ORDER } from '../constants/knowledgeBaseConstants'

/**
 * KNOWLEDGE BASE MODEL
 * ====================
 * Sprint 21 — Knowledge Base Integration.
 *
 * Reusable shapes for the Knowledge Base, one layer above the raw settings
 * value (hooks/useKnowledgeBaseSettings.js). Mirrors the Model/Service split
 * used elsewhere in the engine layer (see engine/plannerModel.js).
 *
 * Knowledge Base resource shape (one per category, today):
 * {
 *   id, name, category, categoryKey, subjectId, subjectName,
 *   status, localPath
 * }
 *
 * Subject Knowledge Base shape:
 * {
 *   subjectId, subjectName, rootPath, isRootConfigured,
 *   categories: { [categoryKey]: KnowledgeBaseResource[] }
 * }
 */
export function createKnowledgeBaseResource({
  id,
  name,
  category,
  categoryKey,
  subjectId,
  subjectName,
  status,
  localPath = null,
}) {
  return {
    id,
    name,
    category,
    categoryKey,
    subjectId,
    subjectName,
    status,
    localPath,
  }
}

export function createSubjectKnowledgeBase({
  subjectId,
  subjectName,
  rootPath,
  isRootConfigured,
  categories = null,
}) {
  const resolvedCategories =
    categories ?? Object.fromEntries(KNOWLEDGE_BASE_CATEGORY_ORDER.map((key) => [key, []]))

  return {
    subjectId,
    subjectName,
    rootPath,
    isRootConfigured,
    categories: resolvedCategories,
  }
}
