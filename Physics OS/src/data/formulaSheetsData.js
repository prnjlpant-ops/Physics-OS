import { subjects } from '../constants/subjects'
import { FORMULA_SECTIONS, DIFFICULTY_LEVELS } from '../constants/formulaSheetSections'

/**
 * Formula Sheets are attached to Chapters, not Books. This module produces
 * placeholder formula sheet data per chapter, grouped by section. The shape
 * mirrors what a future per-chapter `formulaSheet.json` would provide, so
 * the UI layer will not need to change when real data arrives.
 */

const STATUS_TO_DIFFICULTY = {
  Completed: 'Easy',
  'In Progress': 'Moderate',
  'Not Started': 'Hard',
}

function difficultyForChapter(chapter) {
  return STATUS_TO_DIFFICULTY[chapter.status] ?? DIFFICULTY_LEVELS[0]
}

function estimatedRevisionTime(chapter) {
  const totalCards = FORMULA_SECTIONS.reduce((sum, section) => sum + section.cardCount, 0)
  const base = 10 + totalCards
  const adjustment = chapter.status === 'Not Started' ? 5 : 0
  return `${base + adjustment} min`
}

function buildCard(subject, chapter, section, index) {
  const ordinal = index + 1
  return {
    id: `${subject.id}__${chapter.slug}__${section.key}__${index}`,
    subjectId: subject.id,
    subjectName: subject.name,
    chapterSlug: chapter.slug,
    chapterName: chapter.name,
    difficulty: difficultyForChapter(chapter),
    sectionKey: section.key,
    sectionLabel: section.label,
    formula: `${section.label} placeholder ${ordinal} — to be added`,
    meaning: 'Meaning to be added.',
    physicalInterpretation: 'Physical interpretation to be added.',
    whenToUse: 'When-to-use notes to be added.',
    specialConditions: 'Special conditions to be added.',
  }
}

function buildSections(subject, chapter) {
  return FORMULA_SECTIONS.map((section) => ({
    key: section.key,
    label: section.label,
    cards: Array.from({ length: section.cardCount }, (_, index) =>
      buildCard(subject, chapter, section, index),
    ),
  }))
}

export function getChapterFormulaSheet(subject, chapter) {
  return {
    subjectId: subject.id,
    subjectName: subject.name,
    chapterSlug: chapter.slug,
    chapterName: chapter.name,
    lastUpdated: 'Not yet updated',
    difficulty: difficultyForChapter(chapter),
    estimatedRevisionTime: estimatedRevisionTime(chapter),
    sections: buildSections(subject, chapter),
  }
}

export function getChapterFormulaCardsFlat(subject, chapter) {
  return getChapterFormulaSheet(subject, chapter).sections.flatMap((section) => section.cards)
}

export function getSubjectFormulaSheets(subject) {
  return subject.chapters.map((chapter) => getChapterFormulaSheet(subject, chapter))
}

export function getAllFormulaCards() {
  return subjects.flatMap((subject) =>
    subject.chapters.flatMap((chapter) => getChapterFormulaCardsFlat(subject, chapter)),
  )
}
