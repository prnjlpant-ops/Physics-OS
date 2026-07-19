export const ERROR_SOURCES = ['JEST', 'JAM', 'GATE', 'Mock', 'PYQ']

export const ERROR_TYPES = [
  'Conceptual Error',
  'Calculation Error',
  'Interpretation Error',
  'Silly Mistake',
  'Time Management',
  'Guessing',
  'Formula Recall',
]

export const DIFFICULTY_LEVELS = ['Easy', 'Moderate', 'Hard']

export const DIFFICULTY_STYLES = {
  Easy: 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]',
  Moderate: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  Hard: 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]',
}

export const ERROR_STATUS = {
  PENDING: 'Pending',
  RESOLVED: 'Resolved',
}

export const ERROR_STATUS_ORDER = [ERROR_STATUS.PENDING, ERROR_STATUS.RESOLVED]

export const ERROR_STATUS_STYLES = {
  [ERROR_STATUS.PENDING]: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  [ERROR_STATUS.RESOLVED]: 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]',
}

export const STATUS_OPTIONS = ['All', ERROR_STATUS.PENDING, ERROR_STATUS.RESOLVED]

export const PRIORITY_LEVELS = ['Low', 'Medium', 'High']

export const PRIORITY_STYLES = {
  Low: 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585]',
  Medium: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  High: 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]',
}

export const SOURCE_STYLES = {
  JEST: 'border-[#4fc1ff]/30 bg-[#4fc1ff]/10 text-[#4fc1ff]',
  JAM: 'border-[#c586c0]/30 bg-[#c586c0]/10 text-[#c586c0]',
  GATE: 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]',
  Mock: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  PYQ: 'border-[#0e639c]/30 bg-[#0e639c]/10 text-[#4fc1ff]',
}

export const ERROR_TAG_POOL = [
  'Sign Convention',
  'Boundary Condition',
  'Unit Conversion',
  'Graph Reading',
  'Limiting Case',
  'Approximation',
  'Exam Trap',
]
