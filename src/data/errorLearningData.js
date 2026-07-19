import { subjects } from '../constants/subjects'
import {
  DIFFICULTY_LEVELS,
  ERROR_SOURCES,
  ERROR_STATUS_ORDER,
  ERROR_TAG_POOL,
  ERROR_TYPES,
} from '../constants/errorLearningConstants'

/**
 * The Error Learning System converts mistakes into structured learning
 * entries. This module produces placeholder error data across the syllabus.
 * The shape mirrors what a future `errors.json` (or Mock Tests / PYQs
 * writing directly into local storage) would provide, so the UI layer will
 * not need to change when real attempt data starts generating entries.
 *
 * JSON_SHAPE (future):
 * {
 *   "id": "...", "subjectId": "...", "chapterSlug": "...", "source": "Mock",
 *   "errorType": "Conceptual Error", "difficulty": "Hard",
 *   "status": "Pending", "date": "2026-02-14",
 *   "question": "...", "yourAttempt": "...", "correctApproach": "...",
 *   "rootCause": "...", "correctConcept": "...", "keyFormula": "...",
 *   "memoryHook": "...", "tags": [...]
 * }
 */

const ERRORS_PER_CHAPTER = 2
const BASE_DATE = new Date('2026-02-01')

function pick(list, index) {
  return list[index % list.length]
}

function dateForIndex(index) {
  const date = new Date(BASE_DATE)
  date.setDate(date.getDate() + index * 3)
  return date.toISOString().slice(0, 10)
}

function buildError(subject, chapter, index) {
  const source = pick(ERROR_SOURCES, index)
  const errorType = pick(ERROR_TYPES, index + 1)
  const difficulty = pick(DIFFICULTY_LEVELS, index + 2)
  const status = pick(ERROR_STATUS_ORDER, index)
  const tags = [pick(ERROR_TAG_POOL, index), pick(ERROR_TAG_POOL, index + 3)].filter(
    (tag, tagIndex, arr) => arr.indexOf(tag) === tagIndex,
  )

  return {
    id: `${subject.id}__${chapter.slug}__error__${index}`,
    subjectId: subject.id,
    subjectName: subject.name,
    chapterSlug: chapter.slug,
    chapterName: chapter.name,
    source,
    errorType,
    difficulty,
    status,
    date: dateForIndex(index),
    question: `Placeholder ${source} question on ${chapter.name} that led to this error — full question text to be added.`,
    yourAttempt: 'Placeholder — your original working/answer to be added.',
    correctApproach: 'Placeholder — the correct step-by-step approach to be added.',
    rootCause: 'Placeholder — the underlying reason this mistake happened.',
    correctConcept: 'Placeholder — the concept this question actually tests.',
    keyFormula: 'Placeholder — the key formula relevant to this question.',
    memoryHook: 'Placeholder — a memorable cue to avoid repeating this mistake.',
    tags,
    relatedNotePath: `/subjects/${subject.id}/chapters/${chapter.slug}/notes`,
    relatedFormulaSheetPath: `/subjects/${subject.id}/chapters/${chapter.slug}/formula-sheet`,
    relatedMemorySheetPath: `/subjects/${subject.id}/chapters/${chapter.slug}/memory-sheet`,
    relatedActiveRecallPath: `/subjects/${subject.id}/chapters/${chapter.slug}/active-recall`,
  }
}

export function getChapterErrors(subject, chapter) {
  return Array.from({ length: ERRORS_PER_CHAPTER }, (_, index) => buildError(subject, chapter, index))
}

export function getSubjectErrors(subject) {
  return subject.chapters.flatMap((chapter) => getChapterErrors(subject, chapter))
}

export function getAllErrors() {
  return subjects.flatMap((subject) => getSubjectErrors(subject))
}

export function getErrorById(errorId) {
  return getAllErrors().find((error) => error.id === errorId) ?? null
}

function groupBy(list, keyFn) {
  const map = new Map()
  list.forEach((item) => {
    const key = keyFn(item)
    if (!map.has(key)) map.set(key, [])
    map.get(key).push(item)
  })
  return map
}

/**
 * Dashboard summary: Total Errors, Pending Revision, Resolved Errors,
 * Weakest Subject, Weakest Chapter, Last Error Added.
 */
export function getDashboardStats() {
  const errors = getAllErrors()
  const pending = errors.filter((error) => error.status === 'Pending')
  const resolved = errors.filter((error) => error.status === 'Resolved')

  const bySubject = groupBy(errors, (error) => error.subjectId)
  const weakestSubjectEntry = [...bySubject.entries()].sort((a, b) => b[1].length - a[1].length)[0]
  const weakestSubject = weakestSubjectEntry
    ? errors.find((error) => error.subjectId === weakestSubjectEntry[0]).subjectName
    : '—'

  const byChapter = groupBy(errors, (error) => `${error.subjectId}::${error.chapterSlug}`)
  const weakestChapterEntry = [...byChapter.entries()].sort((a, b) => b[1].length - a[1].length)[0]
  const weakestChapter = weakestChapterEntry ? weakestChapterEntry[1][0].chapterName : '—'

  const lastError = [...errors].sort((a, b) => new Date(b.date) - new Date(a.date))[0]

  return {
    totalErrors: errors.length,
    pendingRevision: pending.length,
    resolvedErrors: resolved.length,
    weakestSubject,
    weakestChapter,
    lastErrorAdded: lastError?.date ?? '—',
  }
}

/**
 * Weak Topics view: weak subjects/chapters ranked by error count, most
 * frequent error types, and most missed concepts. Placeholder cards only.
 */
export function getWeakTopics() {
  const errors = getAllErrors()

  const weakSubjects = [...groupBy(errors, (error) => error.subjectId).entries()]
    .map(([subjectId, items]) => ({
      id: subjectId,
      name: items[0].subjectName,
      errorCount: items.length,
    }))
    .sort((a, b) => b.errorCount - a.errorCount)
    .slice(0, 5)

  const weakChapters = [...groupBy(errors, (error) => `${error.subjectId}::${error.chapterSlug}`).entries()]
    .map(([key, items]) => ({
      id: key,
      name: items[0].chapterName,
      subjectName: items[0].subjectName,
      errorCount: items.length,
    }))
    .sort((a, b) => b.errorCount - a.errorCount)
    .slice(0, 6)

  const errorTypeFrequency = [...groupBy(errors, (error) => error.errorType).entries()]
    .map(([type, items]) => ({ label: type, count: items.length }))
    .sort((a, b) => b.count - a.count)

  const missedConcepts = [...groupBy(errors, (error) => error.correctConcept).entries()]
    .map(([concept, items]) => ({
      label: items[0].chapterName,
      concept,
      count: items.length,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6)

  return { weakSubjects, weakChapters, errorTypeFrequency, missedConcepts }
}

/**
 * Statistics view: source-wise and difficulty-wise error breakdowns, and
 * a resolved-vs-pending split. Placeholder data only.
 */
export function getStatistics() {
  const errors = getAllErrors()

  const bySource = [...groupBy(errors, (error) => error.source).entries()].map(([source, items]) => ({
    label: source,
    count: items.length,
  }))

  const byDifficulty = [...groupBy(errors, (error) => error.difficulty).entries()].map(([level, items]) => ({
    label: level,
    count: items.length,
  }))

  const resolvedCount = errors.filter((error) => error.status === 'Resolved').length

  return {
    bySource,
    byDifficulty,
    totalErrors: errors.length,
    resolvedCount,
    pendingCount: errors.length - resolvedCount,
    resolutionRate: errors.length === 0 ? 0 : Math.round((resolvedCount / errors.length) * 100),
  }
}

/**
 * Seed list for the Revision Queue — errors still pending review. The
 * queue hook layers bookmark/priority/resolved state from local storage
 * on top of this seed; it never mutates the underlying error data.
 */
export function generateRevisionQueueSeed() {
  return getAllErrors().filter((error) => error.status === 'Pending')
}
