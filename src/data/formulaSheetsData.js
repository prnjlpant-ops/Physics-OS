/**
 * Formula Sheets are attached to Chapters, not Books. This module currently
 * returns empty state values pending real formula sheet content. The public
 * API shape remains intact for every consumer.
 */

export function getChapterFormulaSheet(subject, chapter) {
  return {
    subjectId: subject.id,
    subjectName: subject.name,
    chapterSlug: chapter.slug,
    chapterName: chapter.name,
    lastUpdated: 'Not yet updated',
    difficulty: 'Unknown',
    estimatedRevisionTime: '0 min',
    sections: [],
  }
}

export function getChapterFormulaCardsFlat() {
  return []
}

export function getSubjectFormulaSheets() {
  return []
}

export function getAllFormulaCards() {
  return []
}
