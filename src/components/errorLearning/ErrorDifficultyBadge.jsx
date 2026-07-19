import { DIFFICULTY_STYLES } from '../../constants/errorLearningConstants'

export default function ErrorDifficultyBadge({ difficulty }) {
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${DIFFICULTY_STYLES[difficulty]}`}>
      {difficulty}
    </span>
  )
}
