import { UNASSIGNED_SUBJECT_ID, UNASSIGNED_SUBJECT_NAME } from '../../constants/libraryConstants'

/**
 * TOPIC MODEL
 * ===========
 * Sprint 26 — Topic Index & Study Mapping.
 *
 * Plain, source-agnostic shapes for the Topic Index module — no storage,
 * no validation, no side effects (see `topicIndexService.js` for that).
 * Mirrors the Model/Service split already used by
 * `engine/library/libraryModel.js` and `engine/pyq/pyqModel.js`.
 *
 * TopicRecord shape (one topic, built from `pyq_index.json`'s `topics`
 * array):
 * {
 *   id, name, chapter, chapterSlug, subject, subjectId, description,
 *   relatedBooks, relatedFormulaSheets, relatedMemorySheets, relatedNotes,
 *   relatedVideos, relatedResearchPapers, relatedPYQs
 * }
 *
 * `subject` mirrors `PaperRecord`'s plain display-name field (see
 * `engine/pyq/pyqModel.js`); `subjectId` is carried alongside it purely so
 * `TopicNavigationService` can group topics under the same subject
 * vocabulary the Library already uses (`knowledge_base.json`), without
 * introducing a second subject-identity scheme.
 */
export function createTopicRecord({
  id,
  name,
  chapter,
  chapterSlug,
  subject,
  subjectId = UNASSIGNED_SUBJECT_ID,
  description = '',
  relatedBooks = [],
  relatedFormulaSheets = [],
  relatedMemorySheets = [],
  relatedNotes = [],
  relatedVideos = [],
  relatedResearchPapers = [],
  relatedPYQs = [],
}) {
  return {
    id,
    name,
    chapter,
    chapterSlug,
    subject,
    subjectId,
    description: typeof description === 'string' ? description : '',
    relatedBooks: Array.isArray(relatedBooks) ? relatedBooks : [],
    relatedFormulaSheets: Array.isArray(relatedFormulaSheets) ? relatedFormulaSheets : [],
    relatedMemorySheets: Array.isArray(relatedMemorySheets) ? relatedMemorySheets : [],
    relatedNotes: Array.isArray(relatedNotes) ? relatedNotes : [],
    relatedVideos: Array.isArray(relatedVideos) ? relatedVideos : [],
    relatedResearchPapers: Array.isArray(relatedResearchPapers) ? relatedResearchPapers : [],
    relatedPYQs: Array.isArray(relatedPYQs) ? relatedPYQs : [],
  }
}

/** The whole Topic Index — every topic, plus load metadata. Never throws to build; may be empty. */
export function createTopicIndex({ version = '1.0.0', lastUpdated = null, topics = [] } = {}) {
  return { version, lastUpdated, topics }
}

/**
 * TOPIC NAVIGATION TREE
 * ---------------------
 * Built by `topicNavigationService.js` from a flat `TopicRecord[]` — never
 * stored, always derived. Subject -> Chapter -> Topic, the exact hierarchy
 * this sprint introduces.
 */
export function createTopicSubjectNode({ subjectId = UNASSIGNED_SUBJECT_ID, subjectName = UNASSIGNED_SUBJECT_NAME, chapters = [] } = {}) {
  return { subjectId, subjectName, chapters }
}

export function createTopicChapterNode({ chapterSlug, chapterName, subjectId, topics = [] }) {
  return { chapterSlug, chapterName, subjectId, topics }
}
