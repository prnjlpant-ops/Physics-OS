import { TOPIC_STATUS_STYLES, TOPIC_STATUS } from '../../constants/topicConstants'

export default function TopicStatusBadge({ status }) {
  const classes = TOPIC_STATUS_STYLES[status] ?? TOPIC_STATUS_STYLES[TOPIC_STATUS.NOT_STARTED]
  return <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${classes}`}>{status}</span>
}
