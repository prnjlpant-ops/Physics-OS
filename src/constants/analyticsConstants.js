export const ANALYTICS_TABS = [
  { label: 'Dashboard', to: '.' },
  { label: 'Study Analytics', to: 'study' },
  { label: 'Subject Analytics', to: 'subjects' },
  { label: 'Revision Analytics', to: 'revision' },
  { label: 'Mock Analytics', to: 'mocks' },
  { label: 'Error Analytics', to: 'errors' },
  { label: 'Consistency', to: 'consistency' },
  { label: 'Goals', to: 'goals' },
]

export const DATE_RANGE_OPTIONS = [
  { key: 'all', label: 'All Time' },
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
]

// Mirrors the app's own navigation surface so the Module filter/search stays
// truthful about what actually exists, rather than inventing a new taxonomy.
export const MODULE_OPTIONS = [
  'Study Timer',
  'Calendar',
  'Subjects',
  'Resources',
  'Formula Sheets',
  'Memory Sheets',
  'Notes',
  'PYQs',
  'Active Recall',
  'Mock Tests',
  'Error Learning',
]

export const DAILY_GOAL_PRESETS_MINUTES = [30, 60, 90, 120, 150, 180, 240]
export const WEEKLY_GOAL_PRESETS_MINUTES = [300, 420, 600, 840, 1050, 1260]
export const MONTHLY_GOAL_PRESETS_MINUTES = [1200, 1800, 2400, 3000, 3600, 4800]

export const DEFAULT_GOALS_MINUTES = {
  daily: 120,
  weekly: 600,
  monthly: 2400,
}

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
