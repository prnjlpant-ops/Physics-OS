import { TOPIC_STATUS_ORDER, TOPIC_STATUS_STYLES } from '../../constants/syllabusConstants'

export default function TopicStatusSelect({ status, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {TOPIC_STATUS_ORDER.map((level) => {
        const isActive = status === level
        return (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            aria-pressed={isActive}
            className={[
              'rounded-md border px-2.5 py-1 text-xs font-medium transition-colors duration-150',
              isActive
                ? TOPIC_STATUS_STYLES[level]
                : 'border-[#3c3c3c] bg-[#2d2d2d] text-[#cccccc] hover:border-[#4a4a4a]',
            ].join(' ')}
          >
            {level}
          </button>
        )
      })}
    </div>
  )
}
