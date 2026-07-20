import { getAllTopics } from '../data/syllabusData'
import { getSubjectById } from '../constants/subjects'
import { getTopicResources } from './resourceMappingService'
import { getChapterPyqs } from '../data/pyqsData'
import { getChapterFormulaCardsFlat } from '../data/formulaSheetsData'
import { getChapterMemoryCardsFlat } from '../data/memorySheetsData'
import { getChapterActiveRecallCards } from '../data/activeRecallData'
import { getChapterNotes } from '../utils/notesStorage'
import { TOPIC_STATUS } from '../constants/syllabusConstants'
import {
  TASK_TYPES,
  TASK_TYPE_BASE_MINUTES,
  DIFFICULTY_TIME_MULTIPLIER,
  TASK_STATUS,
} from '../constants/dailyStudyConstants'
import { createTask } from './taskModel'
import { createMission } from './missionModel'

/**
 * DAILY STUDY SERVICE
 * ===================
 * Sprint 19A — Daily Study Engine (Core).
 *
 * Generates "Today's Mission" by walking the same syllabus tree the
 * Syllabus Explorer and Roadmap Engine already read (`data/syllabusData.js`
 * -> `getAllTopics()`), picking the first Topic that isn't yet Mastered
 * (a live status coming from `useSyllabusStatus`), and turning that one
 * Topic's already-mapped resources (`engine/resourceMappingService.js`,
 * plus the chapter-level PYQ/Formula/Memory/Active Recall/Notes stores)
 * into a flat task list.
 *
 * PLACEHOLDER LOGIC, BY DESIGN:
 * - "Next topic" = first non-Mastered topic in syllabus order. No spaced
 *   repetition, no adaptive difficulty, no calendar awareness.
 * - Estimated time per task is a fixed placeholder band, only lightly
 *   scaled by the topic's existing difficulty rating.
 * - Task priority is inherited directly from the topic's own
 *   blueprint-derived priority (no separate per-task priority model).
 *
 * ARCHITECTURE NOTE — future blueprint integration: every task here is
 * built by `buildTasksForTopic`, the single place that decides which task
 * types apply to a topic and how long each takes. A future sprint that
 * adds a real per-topic study blueprint (explicit task list, real
 * durations) only needs to change this function's body — `TaskModel`,
 * `MissionModel`, and every caller (Today's Mission page/section) read the
 * same shape either way.
 */

function resolveEffectiveStatus(topic, statusOverrides) {
  return statusOverrides[topic.id] ?? topic.metadata.status ?? TOPIC_STATUS.NOT_STARTED
}

function scaledMinutes(type, difficulty, { scaleWithDifficulty = false } = {}) {
  const base = TASK_TYPE_BASE_MINUTES[type] ?? 20
  if (!scaleWithDifficulty) return base
  const multiplier = DIFFICULTY_TIME_MULTIPLIER[difficulty] ?? 1
  return Math.max(5, Math.round((base * multiplier) / 5) * 5)
}

/**
 * Builds the flat task list for one topic. Every task is only included if
 * the underlying resource/content actually exists — an empty chapter never
 * produces a hollow task, so Today's Mission stays honest about what's
 * really available to study.
 */
function buildTasksForTopic(topic, subject, chapter, taskStatusOverrides) {
  const difficulty = topic.metadata.difficulty ?? 'Moderate'
  const priority = topic.metadata.priority ?? 'Medium'
  const links = topic.metadata.linkedModules ?? {}

  const resources = getTopicResources(topic)
  const chapterPyqs = getChapterPyqs(subject, chapter)
  const chapterFormulaCards = getChapterFormulaCardsFlat(subject, chapter)
  const chapterMemoryCards = getChapterMemoryCardsFlat(subject, chapter)
  const chapterRecallCards = getChapterActiveRecallCards(subject, chapter)
  const chapterNotes = getChapterNotes(subject.id, chapter.slug)

  const candidates = []

  if (resources.books.length > 0) {
    candidates.push({
      type: TASK_TYPES.READ_BOOK,
      title: `Read: ${resources.books[0].title}`,
      link: `/subjects/${subject.id}/chapters/${chapter.slug}/books`,
      estimatedMinutes: scaledMinutes(TASK_TYPES.READ_BOOK, difficulty, { scaleWithDifficulty: true }),
      meta: { count: resources.books.length },
    })
  }

  if (resources.videos.length > 0) {
    candidates.push({
      type: TASK_TYPES.WATCH_VIDEO,
      title: `Watch: ${resources.videos[0].title}`,
      link: `/subjects/${subject.id}/chapters/${chapter.slug}/videos`,
      estimatedMinutes: scaledMinutes(TASK_TYPES.WATCH_VIDEO, difficulty, { scaleWithDifficulty: true }),
      meta: { count: resources.videos.length },
    })
  }

  if (chapterPyqs.length > 0) {
    const count = Math.min(5, chapterPyqs.length)
    candidates.push({
      type: TASK_TYPES.SOLVE_PYQS,
      title: `Solve PYQs — ${chapter.name} (${count} questions)`,
      link: links.pyqs ?? `/subjects/${subject.id}/pyqs`,
      estimatedMinutes: scaledMinutes(TASK_TYPES.SOLVE_PYQS, difficulty, { scaleWithDifficulty: true }),
      meta: { count: chapterPyqs.length },
    })
  }

  if (chapterFormulaCards.length > 0) {
    candidates.push({
      type: TASK_TYPES.REVISE_FORMULA_SHEET,
      title: `Revise Formula Sheet — ${chapter.name}`,
      link: links.formulaSheet ?? `/subjects/${subject.id}/chapters/${chapter.slug}/formula-sheet`,
      estimatedMinutes: scaledMinutes(TASK_TYPES.REVISE_FORMULA_SHEET, difficulty),
      meta: { count: chapterFormulaCards.length },
    })
  }

  if (chapterMemoryCards.length > 0) {
    candidates.push({
      type: TASK_TYPES.REVISE_MEMORY_SHEET,
      title: `Revise Memory Sheet — ${chapter.name}`,
      link: links.memorySheet ?? `/subjects/${subject.id}/chapters/${chapter.slug}/memory-sheet`,
      estimatedMinutes: scaledMinutes(TASK_TYPES.REVISE_MEMORY_SHEET, difficulty),
      meta: { count: chapterMemoryCards.length },
    })
  }

  if (chapterRecallCards.length > 0) {
    candidates.push({
      type: TASK_TYPES.ACTIVE_RECALL,
      title: `Active Recall — ${chapter.name}`,
      link: links.activeRecall ?? `/subjects/${subject.id}/chapters/${chapter.slug}/active-recall`,
      estimatedMinutes: scaledMinutes(TASK_TYPES.ACTIVE_RECALL, difficulty),
      meta: { count: chapterRecallCards.length },
    })
  }

  if (chapterNotes.length > 0) {
    candidates.push({
      type: TASK_TYPES.NOTES_REVISION,
      title: `Revise Notes — ${chapter.name} (${chapterNotes.length} note${chapterNotes.length > 1 ? 's' : ''})`,
      link: links.notes ?? `/subjects/${subject.id}/chapters/${chapter.slug}/notes`,
      estimatedMinutes: scaledMinutes(TASK_TYPES.NOTES_REVISION, difficulty),
      meta: { count: chapterNotes.length },
    })
  }

  return candidates.map((candidate, index) => {
    const id = `${topic.id}__task__${index}`
    return createTask({
      id,
      type: candidate.type,
      title: candidate.title,
      estimatedMinutes: candidate.estimatedMinutes,
      priority,
      status: taskStatusOverrides[id] ?? TASK_STATUS.PENDING,
      link: candidate.link,
      topicId: topic.id,
      subjectId: subject.id,
      chapterSlug: chapter.slug,
      meta: candidate.meta,
    })
  })
}

/**
 * Generates Today's Mission.
 *
 * @param statusOverrides - live topic status map from `useSyllabusStatus()`.
 * @param taskStatusOverrides - live per-task status map from `useMissionTaskStatus()`.
 */
export function generateTodaysMission(statusOverrides = {}, taskStatusOverrides = {}) {
  const topics = getAllTopics()

  if (topics.length === 0) {
    return createMission({ isEmpty: true })
  }

  const currentTopic = topics.find(
    (topic) => resolveEffectiveStatus(topic, statusOverrides) !== TOPIC_STATUS.MASTERED,
  )

  if (!currentTopic) {
    return createMission({ isAllCaughtUp: true })
  }

  const subject = getSubjectById(currentTopic.metadata.subjectId)
  const chapter = subject?.chapters.find((item) => item.slug === currentTopic.metadata.chapterSlug)

  if (!subject || !chapter) {
    return createMission({ isEmpty: true })
  }

  const tasks = buildTasksForTopic(currentTopic, subject, chapter, taskStatusOverrides)

  return createMission({
    subject: { id: subject.id, name: subject.name },
    chapter: { slug: chapter.slug, name: chapter.name },
    topic: { id: currentTopic.id, name: currentTopic.name },
    tasks,
  })
}
