import { subjects } from '../constants/subjects'
import { MEMORY_SECTIONS, IMPORTANCE_LEVELS } from '../constants/memorySheetSections'

/**
 * Memory Sheets are attached to Chapters, not Books. This module produces
 * placeholder memory sheet data per chapter, grouped by section. The shape
 * mirrors what a future per-chapter `memorySheet.json` would provide, so
 * the UI layer will not need to change when real data arrives.
 *
 * Memory Sheets are independent from Formula Sheets: formulas answer
 * "what is the formula", memory sheets answer "what must I remember forever".
 */

const STATUS_TO_IMPORTANCE = {
  'Not Started': 'High',
  'In Progress': 'Medium',
  Completed: 'Low',
}

function importanceForChapter(chapter) {
  return STATUS_TO_IMPORTANCE[chapter.status] ?? IMPORTANCE_LEVELS[0]
}

function estimatedRevisionTime(chapter) {
  const totalCards = MEMORY_SECTIONS.reduce((sum, section) => sum + section.cardCount, 0)
  const base = 8 + totalCards
  const adjustment = chapter.status === 'Not Started' ? 4 : 0
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
    importance: importanceForChapter(chapter),
    sectionKey: section.key,
    sectionLabel: section.label,
    concept: `${section.label} placeholder ${ordinal}`,
    shortExplanation: 'Short explanation to be added.',
    whyItMatters: 'Why it matters — to be added.',
    typicalMistake: 'Typical mistake to be added.',
    visualCue: 'Visual cue placeholder',
    memoryHook: 'Memory hook placeholder',
  }
}

function buildSections(subject, chapter) {
  return MEMORY_SECTIONS.map((section) => ({
    key: section.key,
    label: section.label,
    cards: Array.from({ length: section.cardCount }, (_, index) =>
      buildCard(subject, chapter, section, index),
    ),
  }))
}

export function getChapterMemorySheet(subject, chapter) {
  return {
    subjectId: subject.id,
    subjectName: subject.name,
    chapterSlug: chapter.slug,
    chapterName: chapter.name,
    importance: importanceForChapter(chapter),
    revisionStatus: chapter.revision,
    estimatedRevisionTime: estimatedRevisionTime(chapter),
    sections: buildSections(subject, chapter),
  }
}

export function getChapterMemoryCardsFlat(subject, chapter) {
  return getChapterMemorySheet(subject, chapter).sections.flatMap((section) => section.cards)
}

export function getSubjectMemorySheets(subject) {
  return subject.chapters.map((chapter) => getChapterMemorySheet(subject, chapter))
}

export function getAllMemoryCards() {
  return subjects.flatMap((subject) =>
    subject.chapters.flatMap((chapter) => getChapterMemoryCardsFlat(subject, chapter)),
  )
}
