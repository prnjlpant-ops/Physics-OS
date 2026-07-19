import { QUESTION_STATE, QUESTION_STATE_STYLES } from '../../constants/mockTestConstants'

export default function QuestionPalette({ questions, states, currentIndex, onSelect }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
        {questions.map((question, index) => {
          const state = states[question.id] ?? QUESTION_STATE.NOT_VISITED
          const isCurrent = index === currentIndex
          return (
            <button
              key={question.id}
              type="button"
              onClick={() => onSelect(index)}
              className={[
                'flex h-8 w-8 items-center justify-center rounded-md border text-[11px] font-medium transition-colors duration-150',
                QUESTION_STATE_STYLES[state],
                isCurrent ? 'ring-1 ring-[#4fc1ff]' : '',
              ].join(' ')}
              title={state}
            >
              {question.number}
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-1.5 border-t border-[#3c3c3c] pt-3 text-[11px] text-[#9d9d9d]">
        {Object.entries(QUESTION_STATE).map(([key, label]) => (
          <div key={key} className="flex items-center gap-2">
            <span className={`h-3 w-3 shrink-0 rounded border ${QUESTION_STATE_STYLES[label]}`} />
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
