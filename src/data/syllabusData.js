import { subjects as physicsSubjects } from '../constants/subjects'
import { createNode, buildNodeId, getNodesAtLevel, flattenTree } from '../engine/syllabusEngine'
import {
  TOPIC_STATUS,
  DIFFICULTY_LEVELS,
  IMPORTANCE_LEVELS,
  PRIORITY_LEVELS,
  REVISION_STATUS_LEVELS,
  TOPIC_STATUS_WEIGHT,
} from '../constants/syllabusConstants'
import { slugify } from '../utils/slugify'

/**
 * Placeholder Syllabus data.
 * ==========================
 * This module reuses the subject/chapter names already defined in
 * `constants/subjects.js` (read-only) so the Syllabus tree feels
 * continuous with the rest of the app, then layers the additional
 * Unit / Topic / Subtopic levels the syllabus engine requires.
 *
 * None of this is real JEST or IIT JAM syllabus content — Sprint 17
 * replaces this file's output with a real imported blueprint, produced
 * through the same `createNode` shape.
 */

const STUDY_TIME_OPTIONS = ['30 min', '45 min', '1 hr', '1.5 hr', '2 hr']
const PROBLEM_TIME_OPTIONS = ['20 min', '30 min', '45 min', '1 hr']

const TOPIC_LABELS = ['Foundational Concepts', 'Core Techniques', 'Advanced Applications']
const SUBTOPIC_LABELS = ['Key Definitions', 'Worked Examples']

const EXAM_DEFINITIONS = [
  { id: 'iit-jam', name: 'IIT JAM (Placeholder)' },
  { id: 'jest', name: 'JEST (Placeholder)' },
]

const CHAPTERS_PER_UNIT = 2

function pick(list, index) {
  return list[index % list.length]
}

function buildLinkedModules(subjectId, chapterSlug) {
  return {
    resources: `/subjects/${subjectId}/chapters/${chapterSlug}`,
    notes: `/subjects/${subjectId}/chapters/${chapterSlug}/notes`,
    formulaSheet: `/subjects/${subjectId}/chapters/${chapterSlug}/formula-sheet`,
    memorySheet: `/subjects/${subjectId}/chapters/${chapterSlug}/memory-sheet`,
    pyqs: `/subjects/${subjectId}/pyqs`,
    mockTests: '/mock-tests',
    activeRecall: `/subjects/${subjectId}/chapters/${chapterSlug}/active-recall`,
    errorLearning: '/error-learning',
  }
}

function buildSubtopics(parentId, topicIndex) {
  return SUBTOPIC_LABELS.map((label, index) =>
    createNode({
      level: 'subtopic',
      name: label,
      slug: slugify(`${label}-${topicIndex}-${index}`),
      parentId,
      metadata: {
        summary: `Placeholder summary for "${label}" — real content arrives with the Sprint 17 blueprint.`,
      },
    }),
  )
}

function buildTopics(parentId, subject, chapter) {
  return TOPIC_LABELS.map((label, index) => {
    const slug = slugify(`${chapter.slug}-${label}`)
    const topicId = buildNodeId(parentId, slug)

    return createNode({
      level: 'topic',
      name: `${chapter.name}: ${label}`,
      slug,
      parentId,
      metadata: {
        estimatedStudyTime: pick(STUDY_TIME_OPTIONS, index),
        estimatedProblemSolvingTime: pick(PROBLEM_TIME_OPTIONS, index + 1),
        importance: pick(IMPORTANCE_LEVELS, index),
        difficulty: pick(DIFFICULTY_LEVELS, index + 1),
        priority: pick(PRIORITY_LEVELS, index),
        status: TOPIC_STATUS.NOT_STARTED,
        revisionStatus: pick(REVISION_STATUS_LEVELS, index),
        subjectId: subject.id,
        subjectName: subject.name,
        chapterSlug: chapter.slug,
        chapterName: chapter.name,
        linkedModules: buildLinkedModules(subject.id, chapter.slug),
      },
      children: buildSubtopics(topicId, index),
    })
  })
}

function buildChapterNode(parentId, subject, chapter) {
  const chapterId = buildNodeId(parentId, chapter.slug)

  return createNode({
    level: 'chapter',
    name: chapter.name,
    slug: chapter.slug,
    parentId,
    metadata: { subjectId: subject.id },
    children: buildTopics(chapterId, subject, chapter),
  })
}

function buildUnits(parentId, subject) {
  const units = []
  for (let i = 0; i < subject.chapters.length; i += CHAPTERS_PER_UNIT) {
    const chapterSlice = subject.chapters.slice(i, i + CHAPTERS_PER_UNIT)
    const unitIndex = units.length + 1
    const unitSlug = slugify(`unit-${unitIndex}`)
    const unitId = buildNodeId(parentId, unitSlug)

    units.push(
      createNode({
        level: 'unit',
        name: `Unit ${unitIndex}`,
        slug: unitSlug,
        parentId,
        metadata: { subjectId: subject.id },
        children: chapterSlice.map((chapter) => buildChapterNode(unitId, subject, chapter)),
      }),
    )
  }
  return units
}

function buildSubjectNode(parentId, subject) {
  const subjectId = buildNodeId(parentId, subject.id)

  return createNode({
    level: 'subject',
    name: subject.name,
    slug: subject.id,
    parentId,
    metadata: { subjectId: subject.id, icon: subject.icon },
    children: buildUnits(subjectId, subject),
  })
}

function buildExamNode(examDefinition) {
  const examId = buildNodeId(null, examDefinition.id)

  return createNode({
    level: 'exam',
    name: examDefinition.name,
    slug: examDefinition.id,
    parentId: null,
    metadata: {},
    children: physicsSubjects.map((subject) => buildSubjectNode(examId, subject)),
  })
}

let cachedTree = null

/** The full placeholder Exam → Subject → Unit → Chapter → Topic → Subtopic tree. */
export function getSyllabusTree() {
  if (!cachedTree) {
    cachedTree = EXAM_DEFINITIONS.map((exam) => buildExamNode(exam))
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
 * status overrides (see useSyllabusStatus). Placeholder weighting only —
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
