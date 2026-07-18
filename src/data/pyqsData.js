import { subjects } from '../constants/subjects'
import {
  DIFFICULTY_LEVELS,
  EXAMS,
  MARKS_OPTIONS,
  PYQ_STATUS_ORDER,
  PYQ_TAG_POOL,
} from '../constants/pyqConstants'

/**
 * PYQs are attached to Chapters, not Books. This module produces
 * placeholder previous-year-question data per chapter. The shape mirrors
 * what a future per-chapter `pyqs.json` would provide (see the JSON_SHAPE
 * comment below), so the UI layer will not need to change when real
 * question banks arrive.
 *
 * JSON_SHAPE (future):
 * {
 *   "chapterSlug": "vector-calculus",
 *   "questions": [
 *     { "id": "...", "exam": "JEST", "year": 2023, "difficulty": "Hard",
 *       "marks": 4, "tags": [...], "questionText": "...",
 *       "solutionText": "...", "notes": "..." }
 *   ]
 * }
 */

const QUESTIONS_PER_CHAPTER = 6
const YEARS = [2019, 2020, 2021, 2022, 2023, 2024]

function pick(list, index) {
  return list[index % list.length]
}

function buildQuestion(subject, chapter, index) {
  const exam = pick(EXAMS, index)
  const year = pick(YEARS, index + chapter.name.length)
  const difficulty = pick(DIFFICULTY_LEVELS, index + 1)
  const marks = pick(MARKS_OPTIONS, index + 2)
  const status = pick(PYQ_STATUS_ORDER, index)
  const tags = [pick(PYQ_TAG_POOL, index), pick(PYQ_TAG_POOL, index + 3)].filter(
    (tag, tagIndex, arr) => arr.indexOf(tag) === tagIndex,
  )

  return {
    id: `${subject.id}__${chapter.slug}__pyq__${index}`,
    questionNumber: index + 1,
    exam,
    year,
    subjectId: subject.id,
    subjectName: subject.name,
    chapterSlug: chapter.slug,
    chapterName: chapter.name,
    difficulty,
    marks,
    status,
    tags,
    questionText: `Placeholder ${exam} ${year} question ${index + 1} on ${chapter.name}. Full question text to be added.`,
    solutionText: 'Placeholder solution — step-by-step working to be added.',
    notes: '',
    relatedFormulaSheetPath: `/subjects/${subject.id}/chapters/${chapter.slug}/formula-sheet`,
    relatedMemorySheetPath: `/subjects/${subject.id}/chapters/${chapter.slug}/memory-sheet`,
  }
}

export function getChapterPyqs(subject, chapter) {
  return Array.from({ length: QUESTIONS_PER_CHAPTER }, (_, index) =>
    buildQuestion(subject, chapter, index),
  )
}

export function getSubjectPyqs(subject) {
  return subject.chapters.flatMap((chapter) => getChapterPyqs(subject, chapter))
}

export function getAllPyqs() {
  return subjects.flatMap((subject) => getSubjectPyqs(subject))
}

export function getPyqById(pyqId) {
  return getAllPyqs().find((pyq) => pyq.id === pyqId) ?? null
}

export function getYearsForChapter(subject, chapter) {
  const years = getChapterPyqs(subject, chapter).map((pyq) => pyq.year)
  return [...new Set(years)].sort((a, b) => b - a)
}
