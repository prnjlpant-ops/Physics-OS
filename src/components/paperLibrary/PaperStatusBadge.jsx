import { PAPER_STATUS_STYLES, PAPER_STATUS } from '../../constants/pyqLibraryConstants'

export default function PaperStatusBadge({ status }) {
  const classes = PAPER_STATUS_STYLES[status] ?? PAPER_STATUS_STYLES[PAPER_STATUS.NOT_STARTED]
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${classes}`}>
      {status}
    </span>
  )
}
