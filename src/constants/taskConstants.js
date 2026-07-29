/**
 * STUDY ENGINE — CUSTOM TASK CONSTANTS
 * ====================================
 * Sprint 27 — Study Engine & Today's Mission.
 *
 * Vocabulary for the *manual* task layer added this sprint: user-created
 * Today's Mission tasks (Add / Edit / Delete / Complete / Reorder /
 * Duplicate), stored through `services/TaskService.js`.
 *
 * This is deliberately a separate constants module from
 * `dailyStudyConstants.js` (Sprint 19A). That file's `TASK_TYPES` /
 * `TASK_STATUS` describe the *auto-generated* Planner tasks derived live
 * from syllabus status — untouched by this sprint. `CustomTask` records use
 * their own `type` vocabulary (the sprint spec's full list, including task
 * types the auto-generator doesn't produce, like Mock Test or Custom Task)
 * but reuse the same `TASK_STATUS` values from `dailyStudyConstants.js` so
 * a single `TaskStatusBadge` component already works for both.
 */

export const CUSTOM_TASK_TYPES = {
  BOOK_READING: 'Book Reading',
  NOTES: 'Notes',
  FORMULA_SHEET: 'Formula Sheet',
  MEMORY_SHEET: 'Memory Sheet',
  VIDEO: 'Video',
  RESEARCH_PAPER: 'Research Paper',
  PYQ_PRACTICE: 'PYQ Practice',
  REVISION: 'Revision',
  MOCK_TEST: 'Mock Test',
  CUSTOM: 'Custom Task',
}

export const CUSTOM_TASK_TYPE_ORDER = [
  CUSTOM_TASK_TYPES.BOOK_READING,
  CUSTOM_TASK_TYPES.NOTES,
  CUSTOM_TASK_TYPES.FORMULA_SHEET,
  CUSTOM_TASK_TYPES.MEMORY_SHEET,
  CUSTOM_TASK_TYPES.VIDEO,
  CUSTOM_TASK_TYPES.RESEARCH_PAPER,
  CUSTOM_TASK_TYPES.PYQ_PRACTICE,
  CUSTOM_TASK_TYPES.REVISION,
  CUSTOM_TASK_TYPES.MOCK_TEST,
  CUSTOM_TASK_TYPES.CUSTOM,
]

/** Icon key consumed by components/dailyStudy/TaskTypeIcon.jsx. */
export const CUSTOM_TASK_TYPE_ICON_KEY = {
  [CUSTOM_TASK_TYPES.BOOK_READING]: 'book',
  [CUSTOM_TASK_TYPES.NOTES]: 'notes',
  [CUSTOM_TASK_TYPES.FORMULA_SHEET]: 'formula',
  [CUSTOM_TASK_TYPES.MEMORY_SHEET]: 'memory',
  [CUSTOM_TASK_TYPES.VIDEO]: 'video',
  [CUSTOM_TASK_TYPES.RESEARCH_PAPER]: 'research',
  [CUSTOM_TASK_TYPES.PYQ_PRACTICE]: 'pyqs',
  [CUSTOM_TASK_TYPES.REVISION]: 'recall',
  [CUSTOM_TASK_TYPES.MOCK_TEST]: 'mock',
  [CUSTOM_TASK_TYPES.CUSTOM]: 'task',
}

export const TASK_PRIORITIES = ['Low', 'Medium', 'High']

export const DEFAULT_TASK_PRIORITY = 'Medium'

/** A brand new, unsaved task — the shape `TaskFormModal` starts from. */
export function createBlankTaskDraft(defaults = {}) {
  return {
    title: '',
    description: '',
    subject: defaults.subject ?? '',
    chapter: defaults.chapter ?? '',
    topic: defaults.topic ?? '',
    resourceId: null,
    resourceType: null,
    priority: DEFAULT_TASK_PRIORITY,
    estimatedDuration: 30,
    dueDate: defaults.dueDate ?? null,
    notes: '',
    type: CUSTOM_TASK_TYPES.CUSTOM,
  }
}
