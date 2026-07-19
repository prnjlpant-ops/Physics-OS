export const EXAMS = ['IIT JAM', 'JEST', 'GATE', 'TIFR']

export const TEST_TYPES = {
  FULL_LENGTH: 'Full Length',
  SUBJECT: 'Subject Test',
  CHAPTER: 'Chapter Test',
  PYQ: 'Previous Year Paper',
}

export const TEST_TYPE_ORDER = [
  TEST_TYPES.FULL_LENGTH,
  TEST_TYPES.SUBJECT,
  TEST_TYPES.CHAPTER,
  TEST_TYPES.PYQ,
]

export const DIFFICULTY_LEVELS = ['Easy', 'Moderate', 'Hard']

export const DIFFICULTY_STYLES = {
  Easy: 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]',
  Moderate: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  Hard: 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]',
}

export const TEST_STATUS = {
  NOT_ATTEMPTED: 'Not Attempted',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
}

export const TEST_STATUS_STYLES = {
  [TEST_STATUS.NOT_ATTEMPTED]: 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585]',
  [TEST_STATUS.IN_PROGRESS]: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  [TEST_STATUS.COMPLETED]: 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]',
}

export const STATUS_OPTIONS = ['All', TEST_STATUS.NOT_ATTEMPTED, TEST_STATUS.IN_PROGRESS, TEST_STATUS.COMPLETED]

// Question palette states used in the Attempt Interface.
export const QUESTION_STATE = {
  NOT_VISITED: 'Not Visited',
  NOT_ANSWERED: 'Not Answered',
  ANSWERED: 'Answered',
  MARKED: 'Marked for Review',
  ANSWERED_MARKED: 'Answered & Marked',
}

export const QUESTION_STATE_STYLES = {
  [QUESTION_STATE.NOT_VISITED]: 'border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]',
  [QUESTION_STATE.NOT_ANSWERED]: 'border-[#f48771]/50 bg-[#f48771]/15 text-[#f48771]',
  [QUESTION_STATE.ANSWERED]: 'border-[#89d185]/50 bg-[#89d185]/15 text-[#89d185]',
  [QUESTION_STATE.MARKED]: 'border-[#c586c0]/50 bg-[#c586c0]/15 text-[#c586c0]',
  [QUESTION_STATE.ANSWERED_MARKED]: 'border-[#4fc1ff]/50 bg-[#4fc1ff]/15 text-[#4fc1ff]',
}

export const QUESTION_PALETTE_STYLES = [
  { key: 'notVisited', label: 'Not Visited', dot: 'bg-[#858585]' },
  { key: 'notAnswered', label: 'Not Answered', dot: 'bg-[#f48771]' },
  { key: 'answered', label: 'Answered', dot: 'bg-[#89d185]' },
  { key: 'marked', label: 'Marked for Review', dot: 'bg-[#c586c0]' },
  { key: 'answeredMarked', label: 'Answered & Marked', dot: 'bg-[#4fc1ff]' },
]

export const PALETTE_STYLE_OPTIONS = ['Grid', 'List', 'Compact Grid']

export const DEFAULT_DURATION_OPTIONS = [30, 60, 90, 120, 180]

export const ANALYSIS_TABS = [
  { key: 'overall', label: 'Overall' },
  { key: 'subjectWise', label: 'Subject-wise' },
  { key: 'chapterWise', label: 'Chapter-wise' },
  { key: 'difficultyWise', label: 'Difficulty-wise' },
  { key: 'timeAnalysis', label: 'Time Analysis' },
  { key: 'weakStrong', label: 'Weak / Strong Areas' },
  { key: 'mistakes', label: 'Mistake Distribution' },
]

export const REVISION_STATUS = {
  PENDING: 'For Revision',
  REVIEWED: 'Reviewed',
}
