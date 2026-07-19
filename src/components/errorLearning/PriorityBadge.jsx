import { PRIORITY_LEVELS, PRIORITY_STYLES } from '../../constants/errorLearningConstants'

export default function PriorityBadge({ priority, onCycle }) {
  return (
    <button
      type="button"
      onClick={onCycle}
      title="Click to change priority"
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors duration-150 ${PRIORITY_STYLES[priority]}`}
    >
      {priority} Priority
    </button>
  )
}

export function nextPriority(current) {
  const index = PRIORITY_LEVELS.indexOf(current)
  return PRIORITY_LEVELS[(index + 1) % PRIORITY_LEVELS.length]
}
