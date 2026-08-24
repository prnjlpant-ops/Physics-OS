import { getResourceById } from '../library/masterIndexService'
import { getPaperById } from '../pyq/pyqService'

/**
 * STUDY MAPPING SERVICE
 * =====================
 * Sprint 26 — Topic Index & Study Mapping.
 *
 * Resolves a `TopicRecord`'s `related*` id arrays into the real records
 * they reference — Books/Formula Sheets/Memory Sheets/Notes/Videos/
 * Research Papers through `engine/library/masterIndexService.js`'s Master
 * Index (`KnowledgeBaseService` + `BooksService`'s output), and PYQs
 * through `engine/pyq/pyqService.js`'s Paper Library (`PYQService`). No
 * new resource storage is introduced here — per this sprint's "do not
 * duplicate models" rule, a topic only ever *references* ids that already
 * live in `books.json` / `pyqs.json`; this service is purely a lookup
 * layer over those two engines.
 *
 * Every category not yet populated by the Library (Formula Sheets, Memory
 * Sheets, Notes, Videos, Research Papers all ship empty until a future
 * sprint) simply resolves to nothing today — the ids referencing them are
 * reported as broken links rather than crashing anything, satisfying this
 * sprint's "broken links" VALIDATION requirement.
 */

const RESOURCE_FIELD_TO_CATEGORY = {
  relatedBooks: 'books',
  relatedFormulaSheets: 'formulaSheets',
  relatedMemorySheets: 'memorySheets',
  relatedNotes: 'notes',
  relatedVideos: 'videos',
  relatedResearchPapers: 'researchPapers',
}

/** Resolves one related-id array against the Library Master Index. Never throws. */
function resolveLibraryField(libraryIndex, ids, categoryKey, topic) {
  const resolved = []
  const broken = []

  // For videos, also check if the topic has a direct video resource in libraryIndex (keyed by topic.id)
  const topicVideoResource = categoryKey === 'videos' && topic?.id ? getResourceById(libraryIndex, topic.id) : null
  if (topicVideoResource && !resolved.some((r) => r.id === topicVideoResource.id)) {
    resolved.push(topicVideoResource)
  }

  ids.forEach((id) => {
    if (typeof id === 'string') {
      const resource = getResourceById(libraryIndex, id)
      if (resource) {
        if (!resolved.some((r) => r.id === resource.id)) resolved.push(resource)
      } else {
        broken.push(id)
      }
    } else if (id && typeof id === 'object' && id.url) {
      // Structured video object
      if (!resolved.some((r) => r.url === id.url)) {
        resolved.push({
          id: id.url,
          category: 'Videos',
          categoryKey: 'videos',
          title: `${id.source || 'Video'} — ${id.tag || topic?.name || 'Lecture'}`,
          author: id.source || 'Video',
          status: 'Available',
          url: id.url,
          subjectId: topic?.subjectId ?? null,
          subjectName: topic?.subject ?? null,
        })
      }
    } else {
      broken.push(String(id))
    }
  })
  return { resolved, broken }
}

/** Resolves `relatedPYQs` against the Paper Library. Never throws. */
function resolvePyqField(pyqIndex, ids) {
  const resolved = []
  const broken = []
  ids.forEach((id) => {
    const paper = getPaperById(pyqIndex, id)
    if (paper) resolved.push(paper)
    else broken.push(id)
  })
  return { resolved, broken }
}

/**
 * Builds the full Study Mapping for one topic: every related resource
 * category, each resolved to `{ resolved, broken }`. `libraryIndex` and
 * `pyqIndex` are the already-loaded `libraryMasterIndex` and
 * `pyqLibraryIndex` — passed in rather than imported directly, so this
 * stays a pure function callers can test/reuse without pulling in the
 * whole engine bundle.
 */
export function buildStudyMap(topic, libraryIndex, pyqIndex) {
  if (!topic) return null

  const map = {}
  Object.entries(RESOURCE_FIELD_TO_CATEGORY).forEach(([field, categoryKey]) => {
    map[categoryKey] = resolveLibraryField(libraryIndex, topic[field] ?? [], categoryKey, topic)
  })
  map.pyqs = resolvePyqField(pyqIndex, topic.relatedPYQs ?? [])

  return map
}

/** True if a Study Map has at least one resolved resource in any category. */
export function hasAnyResolvedResources(studyMap) {
  if (!studyMap) return false
  return Object.values(studyMap).some((entry) => entry.resolved.length > 0)
}

/** Total count of broken (unresolvable) related-resource links across a Study Map. */
export function countBrokenLinks(studyMap) {
  if (!studyMap) return 0
  return Object.values(studyMap).reduce((sum, entry) => sum + entry.broken.length, 0)
}

export const StudyMappingService = {
  buildStudyMap,
  hasAnyResolvedResources,
  countBrokenLinks,
}

export default StudyMappingService
