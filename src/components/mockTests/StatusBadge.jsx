import { TEST_STATUS_STYLES } from '../../constants/mockTestConstants'

export default function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${TEST_STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  )
}
