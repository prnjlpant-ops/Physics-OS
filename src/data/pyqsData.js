import { getSubjects } from '../engine/blueprintService'
import { buildLinkedModuleRoutes } from '../engine/blueprintMappingLayer'
import { getPyqsByRoadmapChapter } from '../engine/pyq/questionBankService'

/**
 * Per-chapter PYQ data — Part 2 of the Resource Links & PYQ Integration
 * Framework (v2).
 * ============================================================
 * PYQs are attached to Chapters, not Books. Real question content is queried
 * dynamically via `getPyqsByRoadmapChapter` and the question bank assets,
 * with fallback to any explicit per-chapter JSON files.
 */

const chapterFiles = import.meta.glob('./pyq/chapters/*.json', { eager: true })

/** Raw `questions` arrays keyed by chapterSlug, read once at module load. */
const questionsByChapterSlug = {}
for (const path in chapterFiles) {
  const mod = chapterFiles[path]
  const data = mod?.default ?? mod
  if (data && typeof data.chapterSlug === 'string' && Array.isArray(data.questions)) {
    questionsByChapterSlug[data.chapterSlug] = data.questions
  }
}

/** Attaches subject/chapter context and linked-module routes to one raw question. */
function enrichPyq(raw, subject, chapter, index) {
  const { formulaSheet, memorySheet } = buildLinkedModuleRoutes(subject.id, chapter.slug)
  return {
    ...raw,
    questionNumber: raw.questionNumber ?? index + 1,
    subjectId: subject.id,
    subjectName: subject.name,
    chapterSlug: chapter.slug,
    chapterName: chapter.name,
    tags: Array.isArray(raw.tags) ? raw.tags : (raw.conceptTags ?? []),
    notes: raw.notes ?? '',
    relatedFormulaSheetPath: formulaSheet,
    relatedMemorySheetPath: memorySheet,
  }
}

/** All PYQs attached to one chapter, enriched with subject/chapter context. */
export function getChapterPyqs(subject, chapter) {
  if (!subject || !chapter) return []
  const dynamic = getPyqsByRoadmapChapter(chapter.slug)
  if (dynamic && dynamic.length > 0) {
    return dynamic.map((pyq, index) => enrichPyq(pyq, subject, chapter, index))
  }
  const raw = questionsByChapterSlug[chapter.slug] ?? []
  return raw.map((pyq, index) => enrichPyq(pyq, subject, chapter, index))
}

/** All PYQs across every chapter of one subject. */
export function getSubjectPyqs(subject) {
  if (!subject) return []
  return (subject.chapters ?? []).flatMap((chapter) => getChapterPyqs(subject, chapter))
}

/** Every PYQ across every subject and chapter (e.g. for Analytics-wide counts). */
export function getAllPyqs() {
  return getSubjects().flatMap((subject) => getSubjectPyqs(subject))
}

/** Finds a single PYQ by id across the whole app. */
export function getPyqById(pyqId) {
  return getAllPyqs().find((pyq) => pyq.id === pyqId) ?? null
}

/** Distinct years with PYQs for one chapter, newest first. */
export function getYearsForChapter(subject, chapter) {
  const years = getChapterPyqs(subject, chapter).map((pyq) => pyq.year)
  return [...new Set(years)].sort((a, b) => b - a)
}
