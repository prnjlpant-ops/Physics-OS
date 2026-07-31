import { slugify } from '../utils/slugify'
import { getBlueprintSubjects } from './blueprintService'

/**
 * BLUEPRINT MAPPING LAYER
 * =======================
 * Sprint 17 — JEST Blueprint Import Engine.
 *
 * Connects the imported blueprint to the app's existing architecture:
 *
 *   Subjects -> Resources -> Notes -> Formula Sheets -> Memory Sheets
 *            -> PYQs -> Mock Tests -> Active Recall
 *
 * `constants/subjects.js` is the app's existing single source of truth for
 * the Subject -> Chapter shape that every other data module (resources,
 * formula sheets, memory sheets, PYQs, mock tests, active recall, error
 * learning, analytics) already builds itself from generically. This layer
 * produces that exact shape from blueprint data, so none of those modules
 * need to change — they simply see real subjects/chapters instead of
 * placeholder ones.
 *
 * Subject-id mapping note: the blueprint's "Thermodynamics & Statistical
 * Mechanics" is one domain, but this app (an existing, pre-Sprint-17
 * decision) models Thermodynamics and Statistical Mechanics as two distinct
 * subjects/nav destinations. blueprintService already splits that domain's
 * chapters accordingly, so each keeps its own id here.
 */

function subjectIdFor(subjectName) {
  return slugify(subjectName)
}

/** Finds the blueprint chapter record behind an app chapter (by subject name + chapter slug). */
export function getBlueprintChapter(subjectName, chapterSlug) {
  const subject = getBlueprintSubjects().find((s) => s.name === subjectName)
  return subject?.chapters.find((c) => c.slug === chapterSlug) ?? null
}

/**
 * Resource bundle (books / videos / solution manuals) for a given app
 * subject id, sourced from the blueprint's per-subject resource mapping.
 * Solution manuals are derived from books tagged with problem-set-heavy
 * "Recommended Exercises" info where the blueprint doesn't list a
 * dedicated solutions volume, since JEST prep resources are frequently
 * "the same book's exercises," not a separate manual.
 */
export function getBlueprintResourcesForSubject(subjectId) {
  const subject = getBlueprintSubjects().find((s) => subjectIdFor(s.name) === subjectId)
  if (!subject) return { books: [], videos: [], solutionManuals: [] }
  return subject.resources
}

/** The same Exam -> Subject -> ... -> Linked Modules route convention already established in syllabusData.js. */
export function buildLinkedModuleRoutes(subjectId, chapterSlug) {
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
