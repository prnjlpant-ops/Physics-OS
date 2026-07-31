/**
 * Memory Sheets are attached to Chapters, not Books. This module currently
 * returns empty state values pending real memory sheet content. The public
 * API shape remains intact for every consumer.
 */

export function getChapterMemorySheet(subject, chapter) {
  return {
    subjectId: subject.id,
    subjectName: subject.name,
    chapterSlug: chapter.slug,
    chapterName: chapter.name,
    importance: 'Unknown',
    revisionStatus: chapter.revision ?? 'Unknown',
    estimatedRevisionTime: '0 min',
    sections: [],
  }
}

export function getChapterMemoryCardsFlat() {
  return []
}

export function getSubjectMemorySheets() {
  return []
}

export function getAllMemoryCards() {
  return []
}
