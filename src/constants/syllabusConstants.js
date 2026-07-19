export const SYLLABUS_LEVELS = ['exam', 'subject', 'unit', 'chapter', 'topic', 'subtopic']

export const TOPIC_STATUS = {
  NOT_STARTED: 'Not Started',
  READING: 'Reading',
  PROBLEM_SOLVING: 'Problem Solving',
  REVISION: 'Revision',
  MASTERED: 'Mastered',
}

export const TOPIC_STATUS_ORDER = [
  TOPIC_STATUS.NOT_STARTED,
  TOPIC_STATUS.READING,
  TOPIC_STATUS.PROBLEM_SOLVING,
  TOPIC_STATUS.REVISION,
  TOPIC_STATUS.MASTERED,
]

export const TOPIC_STATUS_STYLES = {
  [TOPIC_STATUS.NOT_STARTED]: 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585]',
  [TOPIC_STATUS.READING]: 'border-[#4fc1ff]/30 bg-[#4fc1ff]/10 text-[#4fc1ff]',
  [TOPIC_STATUS.PROBLEM_SOLVING]: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  [TOPIC_STATUS.REVISION]: 'border-[#c586c0]/30 bg-[#c586c0]/10 text-[#c586c0]',
  [TOPIC_STATUS.MASTERED]: 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]',
}

// Completion weight used only for the placeholder Progress feature.
export const TOPIC_STATUS_WEIGHT = {
  [TOPIC_STATUS.NOT_STARTED]: 0,
  [TOPIC_STATUS.READING]: 0.25,
  [TOPIC_STATUS.PROBLEM_SOLVING]: 0.5,
  [TOPIC_STATUS.REVISION]: 0.75,
  [TOPIC_STATUS.MASTERED]: 1,
}

export const DIFFICULTY_LEVELS = ['Easy', 'Moderate', 'Hard']

export const DIFFICULTY_STYLES = {
  Easy: 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]',
  Moderate: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  Hard: 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]',
}

export const IMPORTANCE_LEVELS = ['Low', 'Medium', 'High', 'Critical']

export const IMPORTANCE_STYLES = {
  Low: 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585]',
  Medium: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  High: 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]',
  Critical: 'border-[#f48771]/50 bg-[#f48771]/20 text-[#f48771]',
}

export const PRIORITY_LEVELS = ['Low', 'Medium', 'High']

export const PRIORITY_STYLES = {
  Low: 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585]',
  Medium: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  High: 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]',
}

export const REVISION_STATUS_LEVELS = [
  'Not Revised',
  'Needs Revision',
  'Recently Revised',
  'Well Retained',
]

export const REVISION_STATUS_STYLES = {
  'Not Revised': 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585]',
  'Needs Revision': 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]',
  'Recently Revised': 'border-[#4fc1ff]/30 bg-[#4fc1ff]/10 text-[#4fc1ff]',
  'Well Retained': 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]',
}
