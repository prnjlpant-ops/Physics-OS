import { buildSubjectsFromBlueprint, getBlueprintChapter } from '../engine/blueprintMappingLayer'

/**
 * Subjects — Sprint 17.
 * =====================
 * Every subject/chapter in this app used to be hardcoded here as placeholder
 * data (Sprint 16 and earlier). It is now built from the imported JEST 2027
 * blueprint (see `src/data/blueprint/` + `engine/blueprintMappingLayer.js`).
 *
 * The exported shape is unchanged: an array of
 * { id, name, icon, description, chapters: [{ name, slug, status, progress,
 * reading, problems, revision }] }. Every other data module in `src/data/*`
 * (resources, formula sheets, memory sheets, PYQs, mock tests, active
 * recall, error learning, analytics) already builds itself generically from
 * this shape — so none of them needed to change for real syllabus content
 * to flow through the whole app.
 *
 * To update the syllabus in a future sprint: replace the blueprint file(s)
 * in `src/data/blueprint/`. This file does not need to change.
 */
export const subjects = buildSubjectsFromBlueprint()

export function getSubjectById(id) {
  return subjects.find((subject) => subject.id === id)
}

export function getChapterBySlug(subjectId, chapterSlug) {
  const subject = getSubjectById(subjectId)
  if (!subject) return null

  const chapter = subject.chapters.find((item) => item.slug === chapterSlug)
  if (!chapter) return null

  return { subject, chapter }
}

/** Convenience passthrough to the chapter's full blueprint record (weightage, PYQ frequency, etc.). */
export function getChapterBlueprint(subjectId, chapterSlug) {
  const subject = getSubjectById(subjectId)
  if (!subject) return null
  return getBlueprintChapter(subject.name, chapterSlug)
}
