import { SOURCE_STYLES } from '../../constants/errorLearningConstants'

export default function ErrorSourceBadge({ source }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${SOURCE_STYLES[source]}`}>
      {source}
    </span>
  )
}
