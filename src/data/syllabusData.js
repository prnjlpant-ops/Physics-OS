import {
  loadSyllabusFromMarkdown,
  getNodesAtLevel,
  flattenTree,
} from '../engine/syllabusEngine'
import { getBlueprintData, getSubjects } from '../engine/blueprintService'
import { TOPIC_STATUS_WEIGHT } from '../constants/syllabusConstants'

/**
 * Syllabus data — Sprint 17.
 * ==========================
 * The syllabus is now built entirely from the imported JEST 2027 blueprint
 * (see `src/data/blueprint/`, `engine/blueprintService.js`,
 * `engine/blueprintParser.js` and `engine/blueprintMappingLayer.js`).
 *
 * This module's public API (getSyllabusTree, getAllTopics, getTopicById,
 * getSyllabusProgress, searchTopics, ...) is unchanged from Sprint 16, so
 * no page or component needed to change — only the tree's source did.
 *
 * To update the syllabus in a future sprint: replace the Markdown/JSON
 * files in `src/data/blueprint/`. Nothing here needs to change.
 */

let cachedTree = null

/** The full Exam -> Subject -> Unit -> Chapter -> Topic -> Subtopic tree, built from the imported blueprint. */
export function getSyllabusTree() {
  if (!cachedTree) {
    const blueprintData = getBlueprintData()
    const subjectsWithIcons = getSubjects().map((subject) => ({
      id: subject.id,
      icon: subject.icon,
    }))
    cachedTree = loadSyllabusFromMarkdown(blueprintData, subjectsWithIcons)
  }
  return cachedTree
}

export function getAllTopics() {
  return getNodesAtLevel(getSyllabusTree(), 'topic')
}

export function getTopicById(topicId) {
  return getAllTopics().find((topic) => topic.id === topicId) ?? null
}

export function getAllSubjectsInTree() {
  return getNodesAtLevel(getSyllabusTree(), 'subject')
}

export function getAllChaptersInTree() {
  return getNodesAtLevel(getSyllabusTree(), 'chapter')
}

/**
 * Builds Overall / Subject / Chapter / Topic completion numbers from live
 * status overrides (see useSyllabusStatus). Weighting-only progress model —
 * no scheduling or mastery algorithm.
 */
export function getSyllabusProgress(statusOverrides = {}) {
  const topics = getAllTopics()

  const completionOf = (topicList) => {
    if (topicList.length === 0) return 0
    const total = topicList.reduce((sum, topic) => {
      const status = statusOverrides[topic.id] ?? topic.metadata.status
      return sum + (TOPIC_STATUS_WEIGHT[status] ?? 0)
    }, 0)
    return Math.round((total / topicList.length) * 100)
  }

  const bySubject = getAllSubjectsInTree().map((subject) => {
    const subjectTopics = getNodesAtLevel([subject], 'topic')
    return {
      id: subject.id,
      name: subject.name,
      examName: subject.ancestors[0]?.name ?? '',
      completion: completionOf(subjectTopics),
      topicCount: subjectTopics.length,
    }
  })

  const byChapter = getAllChaptersInTree().map((chapter) => {
    const chapterTopics = getNodesAtLevel([chapter], 'topic')
    return {
      id: chapter.id,
      name: chapter.name,
      subjectName: chapter.ancestors[1]?.name ?? '',
      completion: completionOf(chapterTopics),
      topicCount: chapterTopics.length,
    }
  })

  return {
    overallCompletion: completionOf(topics),
    totalTopics: topics.length,
    bySubject,
    byChapter,
  }
}

export function searchTopics(query) {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return getAllTopics()

  return getAllTopics().filter((topic) => {
    const haystack = [
      topic.name,
      topic.metadata.subjectName,
      topic.metadata.chapterName,
      ...topic.ancestors.map((ancestor) => ancestor.name),
    ]
      .join(' ')
      .toLowerCase()
    return haystack.includes(normalized)
  })
}

export { flattenTree }
