import { TASK_PRIORITY_STYLES } from '../../constants/dailyStudyConstants'

export default function TaskPriorityBadge({ priority }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${TASK_PRIORITY_STYLES[priority] ?? TASK_PRIORITY_STYLES.Medium}`}
    >
      {priority}
    </span>
  )
}
