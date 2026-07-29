import { slugify } from '../../utils/slugify'
import { findSubjectByName } from '../library/knowledgeBaseService'
import { UNASSIGNED_SUBJECT_ID, UNASSIGNED_SUBJECT_NAME } from '../../constants/libraryConstants'
import { createTopicRecord, createTopicIndex } from './topicModel'

/**
 * TOPIC INDEX SERVICE
 * ===================
 * Sprint 26 — Topic Index & Study Mapping.
 *
 * Loads and validates `pyq_index.json`'s `topics` array — the Topic
 * Index's source of truth. No topic is ever hardcoded; every topic shown
 * anywhere in the app is loaded dynamically through this service, the same
 * contract `engine/library/booksService.js` and `engine/pyq/paperService.js`
 * already use for their own JSON. Validation never throws: malformed
 * entries are fixed up with safe defaults (or skipped, for missing
 * identity/duplicates) and reported back as human-readable warnings.
 *
 * Reuses `engine/library/knowledgeBaseService.js`'s `findSubjectByName` and
 * `constants/libraryConstants.js`'s Unassigned-subject vocabulary instead
 * of re-implementing subject matching — per this sprint's "do not
 * duplicate models" rule, `knowledge_base.json`'s subject list stays the
 * single source of truth for what a "known subject" is.
 *
 * NO FILE SYSTEM ACCESS. NO FOLDER SCANNING. This only validates JSON
 * already loaded into memory. Works correctly even when `topics` is an
 * empty array — that is the default shipped state.
 */

function normalizeRelatedIds(raw) {
  return Array.isArray(raw) ? raw.filter((id) => typeof id === 'string' && id.trim()) : []
}

/**
 * Normalizes one raw topic entry against the Knowledge Base config.
 * Returns `{ topic, warnings }` — never throws. A topic missing both an
 * id and a name is unusable and is skipped (per this sprint's VALIDATION
 * requirements for "missing topic metadata"); every other gap is patched
 * with a safe, clearly-labeled default instead of dropping the topic.
 */
function normalizeTopic(raw, config, index) {
  const warnings = []

  if (!raw || typeof raw !== 'object') {
    warnings.push(`Topic at position ${index} was malformed and was skipped.`)
    return { topic: null, warnings }
  }

  const name = typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim() : null
  const id =
    typeof raw.id === 'string' && raw.id.trim()
      ? raw.id.trim()
      : name
        ? `topic-${slugify(name)}-${index}`
        : null

  if (!id || !name) {
    warnings.push(`Topic at position ${index} is missing an "id" or "name" and was skipped.`)
    return { topic: null, warnings }
  }
  if (!raw.id) warnings.push(`Topic "${name}" is missing an "id" — one was generated.`)

  const chapter = typeof raw.chapter === 'string' && raw.chapter.trim() ? raw.chapter.trim() : 'Unspecified Chapter'
  if (!raw.chapter) warnings.push(`Topic "${name}" is missing a "chapter" — grouped under Unspecified Chapter.`)
  const chapterSlug = slugify(chapter) || 'unspecified-chapter'

  const matchedSubject = findSubjectByName(config, raw.subject)
  if (raw.subject && !matchedSubject) {
    warnings.push(`Topic "${name}" references unknown subject "${raw.subject}" — grouped under Unassigned.`)
  }
  if (!raw.subject) {
    warnings.push(`Topic "${name}" is missing a "subject" — grouped under Unassigned.`)
  }

  const subjectId = matchedSubject?.id ?? UNASSIGNED_SUBJECT_ID
  const subjectName =
    matchedSubject?.name ?? (typeof raw.subject === 'string' && raw.subject.trim() ? raw.subject.trim() : UNASSIGNED_SUBJECT_NAME)

  const topic = createTopicRecord({
    id,
    name,
    chapter,
    chapterSlug,
    subject: subjectName,
    subjectId,
    description: typeof raw.description === 'string' ? raw.description : '',
    relatedBooks: normalizeRelatedIds(raw.relatedBooks),
    relatedFormulaSheets: normalizeRelatedIds(raw.relatedFormulaSheets),
    relatedMemorySheets: normalizeRelatedIds(raw.relatedMemorySheets),
    relatedNotes: normalizeRelatedIds(raw.relatedNotes),
    relatedVideos: normalizeRelatedIds(raw.relatedVideos),
    relatedResearchPapers: normalizeRelatedIds(raw.relatedResearchPapers),
    relatedPYQs: normalizeRelatedIds(raw.relatedPYQs),
  })

  return { topic, warnings }
}

/**
 * Validates and normalizes an entire `pyq_index.json` payload's `topics`
 * array against the Knowledge Base config. Never throws — always returns a
 * usable (possibly empty) topic list plus warnings for anything dropped or
 * defaulted. Handles: invalid JSON shape, a missing/empty `topics` array,
 * duplicate ids, unknown chapters, unknown subjects, and malformed entries
 * (Sprint 26's VALIDATION section). An empty or absent `topics` array is
 * not an error — it is the file's default shipped state.
 */
export function parseTopicIndex(raw, config) {
  const warnings = []

  if (!raw || typeof raw !== 'object') {
    return { topics: [], warnings: ['pyq_index.json was empty or not valid JSON — the Topic Index will be empty.'] }
  }

  const rawTopics = Array.isArray(raw.topics) ? raw.topics : []
  if (!Array.isArray(raw.topics) && raw.topics !== undefined) {
    warnings.push('pyq_index.json\'s "topics" field is not an array — the Topic Index will be empty.')
  }

  const seenIds = new Set()
  const topics = []

  rawTopics.forEach((rawTopic, index) => {
    const { topic, warnings: topicWarnings } = normalizeTopic(rawTopic, config, index)
    warnings.push(...topicWarnings)
    if (!topic) return

    if (seenIds.has(topic.id)) {
      warnings.push(`Duplicate topic id "${topic.id}" was skipped.`)
      return
    }
    seenIds.add(topic.id)
    topics.push(topic)
  })

  return { topics, warnings }
}

export function getAllTopics(topicIndex) {
  return topicIndex?.topics ?? []
}

export function getTopicById(topicIndex, topicId) {
  return getAllTopics(topicIndex).find((topic) => topic.id === topicId) ?? null
}

export function getIndexStats(topicIndex, config) {
  const topics = getAllTopics(topicIndex)
  return {
    subjectCount: config?.subjects?.length ?? 0,
    chapterCount: new Set(topics.map((topic) => `${topic.subjectId}::${topic.chapterSlug}`)).size,
    topicCount: topics.length,
    withResources: topics.filter(
      (topic) =>
        topic.relatedBooks.length ||
        topic.relatedFormulaSheets.length ||
        topic.relatedMemorySheets.length ||
        topic.relatedNotes.length ||
        topic.relatedVideos.length ||
        topic.relatedResearchPapers.length ||
        topic.relatedPYQs.length,
    ).length,
  }
}

export const TopicIndexService = {
  parseTopicIndex,
  getAllTopics,
  getTopicById,
  getIndexStats,
}

export default TopicIndexService

export { createTopicIndex }
