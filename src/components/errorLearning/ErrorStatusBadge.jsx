import { ERROR_STATUS_STYLES } from '../../constants/errorLearningConstants'

export default function ErrorStatusBadge({ status, onCycle }) {
  return (
    <button
      type="button"
      onClick={onCycle}
      title="Click to update status"
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors duration-150 ${ERROR_STATUS_STYLES[status]}`}
    >
      {status}
    </button>
  )
}
