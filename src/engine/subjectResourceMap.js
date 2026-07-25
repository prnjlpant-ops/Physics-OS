import { subjects, getSubjectById } from '../constants/subjects'
import { buildSubjectKnowledgeBase } from './knowledgeBaseService'

/**
 * SUBJECT RESOURCE MAP
 * ====================
 * Sprint 21 — Knowledge Base Integration.
 *
 * Sits above KnowledgeBaseService the same way constants/subjects.js sits
 * above the blueprint: it fans the (subject, rootPath) -> SubjectKnowledgeBase
 * computation out across every subject in the syllabus, so pages never call
 * the service directly and never need to know how the path hierarchy is
 * built.
 *
 * ARCHITECTURE NOTE — future local integration: today this map is rebuilt
 * on demand from the current root path (no caching, no disk access). When
 * real folder scanning arrives, only knowledgeBaseService.js needs to
 * change — this map's shape (subjectId -> SubjectKnowledgeBase) stays the
 * same, so SubjectKnowledgeBasePage and Settings keep working unmodified.
 */

/** Builds the Knowledge Base entry for one subject. */
export function getSubjectKnowledgeBase(subjectId, rootPath) {
  const subject = getSubjectById(subjectId)
  if (!subject) return null
  return buildSubjectKnowledgeBase(subject, rootPath)
}

/** Builds the Knowledge Base entry for every subject, keyed by subjectId. */
export function buildSubjectResourceMap(rootPath) {
  return Object.fromEntries(
    subjects.map((subject) => [subject.id, buildSubjectKnowledgeBase(subject, rootPath)]),
  )
}
