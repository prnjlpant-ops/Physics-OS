/**
 * Active Recall cards are attached to Chapters, not Books. This module
 * currently returns empty state values pending real active recall data.
 * Public exports preserve the existing API shape for UI and analytics
 * consumers.
 */

export function getChapterActiveRecallCards() {
  return []
}

export function getSubjectActiveRecallCards() {
  return []
}

export function getAllActiveRecallCards() {
  return []
}

export function getActiveRecallProgress() {
  return {
    total: 0,
    reviewed: 0,
    remaining: 0,
    bookmarked: 0,
  }
}
