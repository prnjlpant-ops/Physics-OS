import { UNASSIGNED_SUBJECT_ID, UNASSIGNED_SUBJECT_NAME } from '../../constants/libraryConstants'
import { createTopicSubjectNode, createTopicChapterNode } from './topicModel'

/**
 * TOPIC NAVIGATION SERVICE
 * ========================
 * Sprint 26 — Topic Index & Study Mapping.
 *
 * Builds and traverses the Subject -> Chapter -> Topic navigation tree
 * from a flat `TopicRecord[]` (see `topicIndexService.js`'s `getAllTopics`).
 * The tree is always *derived*, never stored — the same
 * "source-agnostic engine over a flat record list" pattern
 * `engine/pyq/searchService.js` uses, just for grouping instead of
 * search/filter/sort.
 *
 * No subject or chapter is ever hardcoded: subjects come from whichever
 * `knowledge_base.json` subjects the loaded topics actually reference (via
 * `subjectId`/`subject`), and chapters come from whichever `chapter`
 * strings the loaded topics declare. If `topics` is empty, every function
 * here returns an empty tree/list rather than throwing.
 */

/** Builds the full Subject -> Chapter -> Topic tree from a flat topic list. */
export function buildTopicTree(topics) {
  const subjectMap = new Map()

  topics.forEach((topic) => {
    const subjectKey = topic.subjectId || UNASSIGNED_SUBJECT_ID
    if (!subjectMap.has(subjectKey)) {
      subjectMap.set(
        subjectKey,
        createTopicSubjectNode({
          subjectId: subjectKey,
          subjectName: topic.subject || UNASSIGNED_SUBJECT_NAME,
          chapters: [],
        }),
      )
    }
    const subjectNode = subjectMap.get(subjectKey)

    let chapterNode = subjectNode.chapters.find((chapter) => chapter.chapterSlug === topic.chapterSlug)
    if (!chapterNode) {
      chapterNode = createTopicChapterNode({
        chapterSlug: topic.chapterSlug,
        chapterName: topic.chapter,
        subjectId: subjectKey,
        topics: [],
      })
      subjectNode.chapters.push(chapterNode)
    }

    chapterNode.topics.push(topic)
  })

  const subjects = [...subjectMap.values()]
  subjects.forEach((subject) => {
    subject.chapters.sort((a, b) => a.chapterName.localeCompare(b.chapterName))
    subject.chapters.forEach((chapter) => chapter.topics.sort((a, b) => a.name.localeCompare(b.name)))
  })
  subjects.sort((a, b) => a.subjectName.localeCompare(b.subjectName))

  return subjects
}

export function getSubjectsFromTree(tree) {
  return tree ?? []
}

export function getSubjectNode(tree, subjectId) {
  return tree?.find((subject) => subject.subjectId === subjectId) ?? null
}

export function getChaptersForSubject(tree, subjectId) {
  return getSubjectNode(tree, subjectId)?.chapters ?? []
}

export function getChapterNode(tree, subjectId, chapterSlug) {
  return getChaptersForSubject(tree, subjectId).find((chapter) => chapter.chapterSlug === chapterSlug) ?? null
}

export function getTopicsForChapter(tree, subjectId, chapterSlug) {
  return getChapterNode(tree, subjectId, chapterSlug)?.topics ?? []
}

/** Subject / Chapter / Topic names for breadcrumbs — gracefully falls back if a topic's chapter/subject can't be resolved. */
export function getBreadcrumbForTopic(topic) {
  if (!topic) return { subjectName: null, chapterName: null, topicName: null }
  return {
    subjectName: topic.subject || UNASSIGNED_SUBJECT_NAME,
    chapterName: topic.chapter || 'Unspecified Chapter',
    topicName: topic.name,
  }
}

export const TopicNavigationService = {
  buildTopicTree,
  getSubjectsFromTree,
  getSubjectNode,
  getChaptersForSubject,
  getChapterNode,
  getTopicsForChapter,
  getBreadcrumbForTopic,
}

export default TopicNavigationService
