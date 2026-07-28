/**
 * PYQ LIBRARY CONSTANTS
 * =====================
 * Sprint 25 — PYQ Engine.
 *
 * Shared vocabulary for the Paper Library (`engine/pyq/*`,
 * `hooks/usePyqLibrary.js`, `hooks/usePaperBookmarks.js`,
 * `hooks/usePaperProgress.js`, `components/paperLibrary/*`,
 * `pages/PyqsPage.jsx`, `pages/PyqPaperDetailsPage.jsx`).
 *
 * Kept separate from `constants/pyqConstants.js`, which already backs the
 * existing per-chapter PYQ practice feature (individual questions, marks,
 * difficulty) — a different feature with its own vocabulary, left
 * untouched by this sprint.
 */

/** Exams pyqs.json currently has papers for. */
export const EXAM_ORDER = ['JEST', 'IIT JAM', 'GATE']

export const EXAM_META = {
  JEST: { label: 'JEST' },
  'IIT JAM': { label: 'IIT JAM' },
  GATE: { label: 'GATE Physics' },
  // Sprint 25 explicitly scopes these as future support — no papers exist
  // for them yet, so they're declared (for a stable filter list / import
  // shape) but never populated by this sprint.
  'TIFR GS': { label: 'TIFR GS', comingSoon: true },
  'CSIR NET': { label: 'CSIR NET', comingSoon: true },
}

/** Every exam Physics OS knows the *name* of, in display order (current + future). */
export const ALL_EXAMS_ORDER = [...EXAM_ORDER, 'TIFR GS', 'CSIR NET']

export const PAPER_STATUS = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  REVISION_NEEDED: 'Revision Needed',
}

export const PAPER_STATUS_ORDER = [
  PAPER_STATUS.NOT_STARTED,
  PAPER_STATUS.IN_PROGRESS,
  PAPER_STATUS.COMPLETED,
  PAPER_STATUS.REVISION_NEEDED,
]

export const PAPER_STATUS_STYLES = {
  [PAPER_STATUS.NOT_STARTED]: 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585]',
  [PAPER_STATUS.IN_PROGRESS]: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  [PAPER_STATUS.COMPLETED]: 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]',
  [PAPER_STATUS.REVISION_NEEDED]: 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]',
}

export const PAPER_SORT_OPTIONS = [
  { key: 'year-desc', label: 'Year (Newest)' },
  { key: 'year-asc', label: 'Year (Oldest)' },
  { key: 'exam', label: 'Exam' },
  { key: 'subject', label: 'Subject' },
  { key: 'status', label: 'Status' },
]

export const DEFAULT_PAPER_SORT = 'year-desc'
