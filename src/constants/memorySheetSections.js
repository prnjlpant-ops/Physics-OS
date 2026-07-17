export const MEMORY_SECTIONS = [
  { key: 'keyConcepts', label: 'Key Concepts', cardCount: 3 },
  { key: 'physicalIntuition', label: 'Physical Intuition', cardCount: 2 },
  { key: 'mentalModels', label: 'Mental Models', cardCount: 2 },
  { key: 'commonTraps', label: 'Common Traps', cardCount: 2 },
  { key: 'frequentlyConfused', label: 'Frequently Confused Ideas', cardCount: 2 },
  { key: 'examMistakes', label: 'Typical Exam Mistakes', cardCount: 2 },
  { key: 'mustRemember', label: 'Must Remember Results', cardCount: 2 },
  { key: 'graphicalIntuition', label: 'Graphical Intuition', cardCount: 1 },
  { key: 'quickChecklist', label: 'Quick Revision Checklist', cardCount: 1 },
  { key: 'oneLineSummary', label: 'One-Line Summary', cardCount: 1 },
]

export const IMPORTANCE_LEVELS = ['Low', 'Medium', 'High']

export const IMPORTANCE_STYLES = {
  Low: 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]',
  Medium: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  High: 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]',
}

export const REVISION_STATUS_STYLES = {
  Done: 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]',
  'In Progress': 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  Pending: 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585]',
}
