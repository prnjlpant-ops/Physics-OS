import { TOPIC_STATUS_ORDER, TOPIC_STATUS_STYLES } from '../../constants/topicConstants'

export default function TopicProgressControl({ status, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Progress</p>
      <div className="flex flex-wrap gap-1.5">
        {TOPIC_STATUS_ORDER.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={[
              'rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors duration-150',
              option === status
                ? TOPIC_STATUS_STYLES[option]
                : 'border-[#3c3c3c] bg-transparent text-[#6e6e6e] hover:border-[#4a4a4a] hover:text-[#9d9d9d]',
            ].join(' ')}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
