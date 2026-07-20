import { TASK_STATUS_STYLES } from '../../constants/dailyStudyConstants'

export default function TaskStatusBadge({ status }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${TASK_STATUS_STYLES[status] ?? TASK_STATUS_STYLES.Pending}`}
    >
      {status}
    </span>
  )
}
