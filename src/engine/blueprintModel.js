import { slugify } from '../utils/slugify'
import {
  DIFFICULTY_LEVELS,
  IMPORTANCE_LEVELS,
  PRIORITY_LEVELS,
} from '../constants/syllabusConstants'

/**
 * BLUEPRINT DATA MODEL
 * ====================
 * Sprint 17 — JEST Blueprint Import Engine.
 *
 * This module defines the single, source-agnostic shape that both the
 * Markdown parser and the JSON loader (see `blueprintParser.js`) normalize
 * into. Nothing downstream (syllabus tree, resources, roadmap) should ever
 * read the raw Markdown or raw JSON directly — everything goes through a
 * `BlueprintData` object built by these normalizers, so replacing the
 * source file never requires touching a component.
 *
 * BlueprintData shape:
 * {
 *   meta: { title, track },
 *   examPattern: { duration, mode, medium, calculatorAllowed, sections: [...], totalQuestions, totalMarks },
 *   subjects: [
 *     {
 *       id, name, weightageRange, priority, jamOverlap, deadline,
 *       primaryBook, primaryVideo, difficultyOverall,
 *       coreOverlapTopics, jestExclusiveTopics,
 *       chapters: [
 *         { name, slug, weightage, pyqFrequency, mathPrerequisites,
 *           difficulty, highYieldStars, commonMisconceptions, questionStyle }
 *       ],
 *       resources: { books: [...], videos: [...], solutionManuals: [...] },
 *     }
 *   ],
 *   roadmap: [ { month, phase, focus, intensity, notes } ],
 *   highYieldChecklist: [ { rank, topic, subject, rationale } ],
 * }
 */

/** Normalizes a single chapter/topic row into a stable shape (adds a slug). */
export function normalizeChapter(raw) {
  return {
    name: raw.name,
    slug: slugify(raw.name),
    weightage: raw.weightage ?? 'Medium',
    pyqFrequency: raw.pyqFrequency ?? 'Occasionally Tested',
    mathPrerequisites: raw.mathPrerequisites ?? '',
    difficulty: raw.difficulty ?? 'Medium',
    highYieldStars: Number(raw.highYieldStars) || 3,
    commonMisconceptions: raw.commonMisconceptions ?? '',
    questionStyle: raw.questionStyle ?? '',
  }
}

/** Normalizes a resource book/video/solution-manual entry. */
function normalizeResourceItem(raw) {
  return { ...raw }
}

/** Normalizes a single subject block, including its chapters + resources. */
export function normalizeSubject(raw) {
  return {
    id: raw.id ?? slugify(raw.name),
    name: raw.name,
    weightageRange: raw.weightageRange ?? '',
    priority: raw.priority ?? 'Medium',
    jamOverlap: raw.jamOverlap ?? 'Medium',
    deadline: raw.deadline ?? '',
    primaryBook: raw.primaryBook ?? '',
    primaryVideo: raw.primaryVideo ?? '',
    difficultyOverall: raw.difficultyOverall ?? 'Medium',
    coreOverlapTopics: raw.coreOverlapTopics ?? '',
    jestExclusiveTopics: raw.jestExclusiveTopics ?? '',
    chapters: (raw.chapters ?? []).map(normalizeChapter),
    resources: {
      books: (raw.resources?.books ?? []).map(normalizeResourceItem),
      videos: (raw.resources?.videos ?? []).map(normalizeResourceItem),
      solutionManuals: (raw.resources?.solutionManuals ?? []).map(normalizeResourceItem),
    },
  }
}

/** Normalizes a full parsed/loaded payload into the canonical BlueprintData shape. */
export function normalizeBlueprintData(raw) {
  return {
    meta: {
      title: raw.meta?.title ?? 'Untitled Blueprint',
      track: raw.meta?.track ?? '',
    },
    examPattern: raw.examPattern ?? null,
    subjects: (raw.subjects ?? []).map(normalizeSubject),
    roadmap: raw.roadmap ?? [],
    highYieldChecklist: raw.highYieldChecklist ?? [],
  }
}

/**
 * ---------------------------------------------------------------------
 * Enum translation
 * ---------------------------------------------------------------------
 * The blueprint uses its own free-text vocabulary (weightage bands,
 * PYQ frequency, high-yield star ratings). The Syllabus module's UI
 * (TopicMetadataPanel, badges, filters) is built against a fixed set of
 * enums (constants/syllabusConstants.js). These helpers translate one
 * into the other without either module needing to know about the other's
 * vocabulary.
 */

const DIFFICULTY_WORD_MAP = {
  low: 'Easy',
  'low–medium': 'Easy',
  'low-medium': 'Easy',
  medium: 'Moderate',
  'medium–high': 'Moderate',
  'medium-high': 'Moderate',
  high: 'Hard',
  'very high': 'Hard',
}

export function mapDifficulty(blueprintDifficulty) {
  const key = String(blueprintDifficulty ?? '').trim().toLowerCase()
  return DIFFICULTY_WORD_MAP[key] ?? DIFFICULTY_LEVELS[1]
}

/** High-yield star rating (2-5) -> Importance enum. */
export function mapImportance(highYieldStars) {
  if (highYieldStars >= 5) return 'Critical'
  if (highYieldStars >= 4) return 'High'
  if (highYieldStars >= 3) return 'Medium'
  return IMPORTANCE_LEVELS[0]
}

const PRIORITY_WORD_MAP = {
  'very high': 'High',
  high: 'High',
  'high (foundational)': 'High',
  medium: 'Medium',
  'low–medium': 'Low',
  'low-medium': 'Low',
  low: 'Low',
}

export function mapPriority(blueprintPriority) {
  const key = String(blueprintPriority ?? '').trim().toLowerCase()
  return PRIORITY_WORD_MAP[key] ?? PRIORITY_LEVELS[1]
}

/** PYQ frequency -> a coarse revision-status seed (everything starts "Not Revised" in practice). */
export function mapRevisionStatus() {
  return 'Not Revised'
}

/** Rough study-time estimate derived from difficulty, since the blueprint gives weekly — not per-topic — hours. */
export function estimateStudyTime(difficultyEnum) {
  if (difficultyEnum === 'Hard') return '2 hr'
  if (difficultyEnum === 'Moderate') return '1.5 hr'
  return '1 hr'
}

export function estimateProblemSolvingTime(difficultyEnum) {
  if (difficultyEnum === 'Hard') return '1 hr'
  if (difficultyEnum === 'Moderate') return '45 min'
  return '30 min'
}
