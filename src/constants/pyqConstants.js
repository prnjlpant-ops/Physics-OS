export const EXAMS = ['JEST', 'IIT JAM', 'GATE', 'TIFR']

export const DIFFICULTY_LEVELS = ['Easy', 'Moderate', 'Hard']

export const DIFFICULTY_STYLES = {
  Easy: 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]',
  Moderate: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  Hard: 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]',
}

export const PYQ_STATUS = {
  UNSOLVED: 'Unsolved',
  ATTEMPTED: 'Attempted',
  SOLVED: 'Solved',
}

export const PYQ_STATUS_ORDER = [PYQ_STATUS.UNSOLVED, PYQ_STATUS.ATTEMPTED, PYQ_STATUS.SOLVED]

export const PYQ_STATUS_STYLES = {
  [PYQ_STATUS.UNSOLVED]: 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585]',
  [PYQ_STATUS.ATTEMPTED]: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  [PYQ_STATUS.SOLVED]: 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]',
}

export const MARKS_OPTIONS = [1, 2, 4, 5]

export const PYQ_TABS = [
  { key: 'question', label: 'Question' },
  { key: 'solution', label: 'Solution' },
  { key: 'notes', label: 'Notes' },
  { key: 'relatedFormulaSheet', label: 'Related Formula Sheet' },
  { key: 'relatedMemorySheet', label: 'Related Memory Sheet' },
]

export const PYQ_TAG_POOL = [
  'Conceptual',
  'Numerical',
  'Derivation',
  'Graph-Based',
  'Multiple Correct',
  'Assertion-Reason',
  'Previous Year Favorite',
]
