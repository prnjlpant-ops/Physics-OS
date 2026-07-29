/**
 * TOPIC CONSTANTS
 * ===============
 * Sprint 26 — Topic Index & Study Mapping.
 *
 * Shared vocabulary for the new Topic Index module (`engine/topics/*`,
 * `hooks/useTopicIndex.js`, `hooks/useTopicProgress.js`,
 * `components/topics/*`, `pages/topics/*`). Kept as its own file, mirroring
 * `constants/pyqLibraryConstants.js`'s precedent — a distinct feature with
 * its own status vocabulary, separate from Paper status and Syllabus
 * `TOPIC_STATUS` (`constants/syllabusConstants.js`, a different tree with
 * its own progress model).
 */

export const TOPIC_STATUS = {
  NOT_STARTED: 'Not Started',
  IN_PROGRESS: 'In Progress',
  MASTERED: 'Mastered',
  REVISION_NEEDED: 'Revision Needed',
}

export const TOPIC_STATUS_ORDER = [
  TOPIC_STATUS.NOT_STARTED,
  TOPIC_STATUS.IN_PROGRESS,
  TOPIC_STATUS.MASTERED,
  TOPIC_STATUS.REVISION_NEEDED,
]

export const TOPIC_STATUS_STYLES = {
  [TOPIC_STATUS.NOT_STARTED]: 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585]',
  [TOPIC_STATUS.IN_PROGRESS]: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  [TOPIC_STATUS.MASTERED]: 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]',
  [TOPIC_STATUS.REVISION_NEEDED]: 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]',
}

export const TOPIC_SORT_OPTIONS = [
  { key: 'name-asc', label: 'Topic (A–Z)' },
  { key: 'name-desc', label: 'Topic (Z–A)' },
  { key: 'subject', label: 'Subject' },
  { key: 'chapter', label: 'Chapter' },
]

export const DEFAULT_TOPIC_SORT = 'name-asc'

/** Study Mapping category order + labels — mirrors `LIBRARY_CATEGORY_META`'s labels for visual consistency. */
export const STUDY_MAPPING_CATEGORY_ORDER = [
  'books',
  'formulaSheets',
  'memorySheets',
  'notes',
  'videos',
  'researchPapers',
]
