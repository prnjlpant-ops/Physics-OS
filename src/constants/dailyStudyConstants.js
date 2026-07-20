/**
 * DAILY STUDY ENGINE — CONSTANTS
 * ==============================
 * Sprint 19A. Shared vocabulary for the Daily Study Service and the
 * Today's Mission UI. Kept free of any React/icon imports so the engine
 * layer (src/engine/dailyStudyService.js) stays a plain data module —
 * components map `iconKey` to an actual icon.
 */

export const TASK_TYPES = {
  READ_BOOK: 'Read Book',
  WATCH_VIDEO: 'Watch Video',
  SOLVE_PYQS: 'Solve PYQs',
  REVISE_FORMULA_SHEET: 'Revise Formula Sheet',
  REVISE_MEMORY_SHEET: 'Revise Memory Sheet',
  ACTIVE_RECALL: 'Active Recall',
  NOTES_REVISION: 'Notes Revision',
}

export const TASK_TYPE_ORDER = [
  TASK_TYPES.READ_BOOK,
  TASK_TYPES.WATCH_VIDEO,
  TASK_TYPES.SOLVE_PYQS,
  TASK_TYPES.REVISE_FORMULA_SHEET,
  TASK_TYPES.REVISE_MEMORY_SHEET,
  TASK_TYPES.ACTIVE_RECALL,
  TASK_TYPES.NOTES_REVISION,
]

/** Placeholder per-task time, in minutes, before any difficulty adjustment. */
export const TASK_TYPE_BASE_MINUTES = {
  [TASK_TYPES.READ_BOOK]: 45,
  [TASK_TYPES.WATCH_VIDEO]: 30,
  [TASK_TYPES.SOLVE_PYQS]: 40,
  [TASK_TYPES.REVISE_FORMULA_SHEET]: 15,
  [TASK_TYPES.REVISE_MEMORY_SHEET]: 15,
  [TASK_TYPES.ACTIVE_RECALL]: 20,
  [TASK_TYPES.NOTES_REVISION]: 15,
}

/** Only the primary study tasks scale with topic difficulty; quick revision tasks stay fixed-length. */
export const DIFFICULTY_TIME_MULTIPLIER = {
  Easy: 0.8,
  Moderate: 1,
  Hard: 1.3,
}

/** Icon key consumed by components/dailyStudy/TaskTypeIcon.jsx — keeps this file icon-library-free. */
export const TASK_TYPE_ICON_KEY = {
  [TASK_TYPES.READ_BOOK]: 'book',
  [TASK_TYPES.WATCH_VIDEO]: 'video',
  [TASK_TYPES.SOLVE_PYQS]: 'pyqs',
  [TASK_TYPES.REVISE_FORMULA_SHEET]: 'formula',
  [TASK_TYPES.REVISE_MEMORY_SHEET]: 'memory',
  [TASK_TYPES.ACTIVE_RECALL]: 'recall',
  [TASK_TYPES.NOTES_REVISION]: 'notes',
}

export const TASK_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  // Added in Sprint 19B for the Adaptive Daily Planner ("Skip" action).
  // Today's Mission never sets this itself, but it shares the same
  // status store (useMissionTaskStatus) so a task skipped in the Planner
  // also reads as Skipped wherever else its status is shown.
  SKIPPED: 'Skipped',
}

export const TASK_STATUS_STYLES = {
  [TASK_STATUS.PENDING]: 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585]',
  [TASK_STATUS.IN_PROGRESS]: 'border-[#4fc1ff]/30 bg-[#4fc1ff]/10 text-[#4fc1ff]',
  [TASK_STATUS.COMPLETED]: 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]',
  [TASK_STATUS.SKIPPED]: 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]',
}

// Reuses the same three-level vocabulary as engine/blueprintModel.js (PRIORITY_LEVELS),
// duplicated here as styles only so this module doesn't need to import constants/syllabusConstants.
export const TASK_PRIORITY_STYLES = {
  Low: 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585]',
  Medium: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  High: 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]',
}
