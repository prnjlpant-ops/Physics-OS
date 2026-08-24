import { getSubjects } from '../engine/blueprintService'
import { buildLinkedModuleRoutes } from '../engine/blueprintMappingLayer'

/**
 * Per-chapter PYQ data — Part 2 of the Resource Links & PYQ Integration
 * Framework (v2).
 * ============================================================
 * PYQs are attached to Chapters, not Books. Real question content lives in
 * one JSON file per chapter under `data/pyq/chapters/<chapterSlug>.json` —
 * 35 files, one per blueprint chapter (see the framework doc's
 * chapterSlug reference table). This retires the old placeholder generator
 * that always returned empty state.
 *
 * Each chapter file's raw shape is intentionally minimal:
 *
 *   {
 *     "chapterSlug": "lagrangian-hamiltonian-mechanics",
 *     "questions": [
 *       { "id": "jest_2023_q7", "exam": "JEST", "year": 2023,
 *         "difficulty": "Hard", "marks": 3, "tags": ["Derivation"],
 *         "questionText": "...", "solutionText": "...", "notes": "..." }
 *     ]
 *   }
 *
 * This module is the only place that reads those raw files. It enriches
 * every question with the contextual fields the UI needs (subjectId,
 * subjectName, chapterSlug, chapterName, questionNumber, and the linked
 * formula-sheet/memory-sheet routes) so nothing else in `src/pages` or
 * `src/components` needs to know about the raw per-chapter file shape —
 * the exported function signatures below are unchanged from before.
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
    questionNumber: index + 1,
    subjectId: subject.id,
    subjectName: subject.name,
    chapterSlug: chapter.slug,
    chapterName: chapter.name,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    notes: raw.notes ?? '',
    relatedFormulaSheetPath: formulaSheet,
    relatedMemorySheetPath: memorySheet,
  }
}

/** All PYQs attached to one chapter, enriched with subject/chapter context. */
export function getChapterPyqs(subject, chapter) {
  if (!subject || !chapter) return []
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
