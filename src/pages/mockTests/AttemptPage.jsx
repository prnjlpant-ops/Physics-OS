import { useMemo, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Flag, Eraser, Send, X } from 'lucide-react'
import { getMockTestById, generateQuestionsForTest } from '../../data/mockTestsData'
import { QUESTION_STATE } from '../../constants/mockTestConstants'
import AttemptTimer from '../../components/mockTests/AttemptTimer'
import AttemptProgressBar from '../../components/mockTests/AttemptProgressBar'
import QuestionPalette from '../../components/mockTests/QuestionPalette'
import PageTitle from '../../components/PageTitle'

export default function AttemptPage() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const test = getMockTestById(testId)
  const questions = useMemo(() => (test ? generateQuestionsForTest(test) : []), [test])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [states, setStates] = useState({})
  const [answers, setAnswers] = useState({})
  const [confirmSubmit, setConfirmSubmit] = useState(false)

  if (!test) {
    return <PageTitle title="Mock Test Not Found" />
  }

  const question = questions[currentIndex]
  const answeredCount = Object.values(states).filter(
    (s) => s === QUESTION_STATE.ANSWERED || s === QUESTION_STATE.ANSWERED_MARKED,
  ).length

  function visit(index) {
    setCurrentIndex(index)
    setStates((prev) => {
      const id = questions[index].id
      if (prev[id]) return prev
      return { ...prev, [id]: QUESTION_STATE.NOT_ANSWERED }
    })
  }

  function selectOption(optionIndex) {
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }))
    setStates((prev) => {
      const current = prev[question.id]
      const next =
        current === QUESTION_STATE.MARKED || current === QUESTION_STATE.ANSWERED_MARKED
          ? QUESTION_STATE.ANSWERED_MARKED
          : QUESTION_STATE.ANSWERED
      return { ...prev, [question.id]: next }
    })
  }

  function clearResponse() {
    setAnswers((prev) => {
      const next = { ...prev }
      delete next[question.id]
      return next
    })
    setStates((prev) => {
      const current = prev[question.id]
      const next = current === QUESTION_STATE.ANSWERED_MARKED ? QUESTION_STATE.MARKED : QUESTION_STATE.NOT_ANSWERED
      return { ...prev, [question.id]: next }
    })
  }

  function markForReview() {
    setStates((prev) => {
      const hasAnswer = answers[question.id] !== undefined
      return { ...prev, [question.id]: hasAnswer ? QUESTION_STATE.ANSWERED_MARKED : QUESTION_STATE.MARKED }
    })
  }

  function goTo(delta) {
    const nextIndex = currentIndex + delta
    if (nextIndex < 0 || nextIndex >= questions.length) return
    visit(nextIndex)
  }

  function submit() {
    navigate(`/mock-tests/${test.id}/result`)
  }

  const selectedOption = answers[question.id]

  return (
    <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-[#6e6e6e]">
            {test.exam} · {test.type}
          </p>
          <h2 className="text-base font-semibold text-[#e8e8e8]">{test.title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <AttemptTimer durationMinutes={test.duration} />
          <button
            type="button"
            onClick={() => setConfirmSubmit(true)}
            className="flex items-center gap-1.5 rounded-md bg-[#0e639c] px-3 py-1.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-[#1177bb]"
          >
            <Send size={13} strokeWidth={1.75} />
            Submit
          </button>
        </div>
      </div>

      <AttemptProgressBar answered={answeredCount} total={questions.length} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_260px]">
        <div className="flex flex-col gap-4 rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[#858585]">
              Question {question.number} of {questions.length}
            </p>
            <span className="rounded-full border border-[#3c3c3c] px-2 py-0.5 text-[10px] text-[#9d9d9d]">
              {question.marks} marks · {question.difficulty}
            </span>
          </div>

          <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">
            {question.subjectName} · {question.chapterName}
          </p>

          <p className="text-sm leading-relaxed text-[#e8e8e8]">{question.prompt}</p>

          <div className="flex flex-col gap-2">
            {question.options.map((option, index) => (
              <button
                key={option}
                type="button"
                onClick={() => selectOption(index)}
                className={[
                  'flex items-center gap-3 rounded-md border px-3 py-2.5 text-left text-sm transition-colors duration-150',
                  selectedOption === index
                    ? 'border-[#0e639c] bg-[#0e639c]/10 text-[#e8e8e8]'
                    : 'border-[#3c3c3c] bg-[#1e1e1e] text-[#cccccc] hover:border-[#4a4a4a]',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[10px]',
                    selectedOption === index
                      ? 'border-[#4fc1ff] text-[#4fc1ff]'
                      : 'border-[#3c3c3c] text-[#858585]',
                  ].join(' ')}
                >
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-[#3c3c3c] pt-3.5">
            <button
              type="button"
              onClick={() => goTo(-1)}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={14} strokeWidth={1.75} />
              Previous
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              disabled={currentIndex === questions.length - 1}
              className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight size={14} strokeWidth={1.75} />
            </button>
            <button
              type="button"
              onClick={markForReview}
              className="flex items-center gap-1.5 rounded-md border border-[#c586c0]/40 bg-[#c586c0]/10 px-3 py-1.5 text-xs font-medium text-[#c586c0] transition-colors duration-150 hover:bg-[#c586c0]/20"
            >
              <Flag size={13} strokeWidth={1.75} />
              Mark For Review
            </button>
            <button
              type="button"
              onClick={clearResponse}
              className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#9d9d9d] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-[#cccccc]"
            >
              <Eraser size={13} strokeWidth={1.75} />
              Clear Response
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
          <p className="mb-3 text-xs font-medium text-[#858585]">Question Navigator</p>
          <QuestionPalette
            questions={questions}
            states={states}
            currentIndex={currentIndex}
            onSelect={visit}
          />
        </div>
      </div>

      {confirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-sm rounded-lg border border-[#3c3c3c] bg-[#252526] p-5">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-semibold text-[#e8e8e8]">Submit test?</h3>
              <button
                type="button"
                onClick={() => setConfirmSubmit(false)}
                className="text-[#858585] hover:text-[#cccccc]"
              >
                <X size={16} strokeWidth={1.75} />
              </button>
            </div>
            <p className="mt-2 text-xs text-[#9d9d9d]">
              You have answered {answeredCount} of {questions.length} questions. This cannot be undone.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={submit}
                className="flex-1 rounded-md bg-[#0e639c] px-3 py-2 text-xs font-medium text-white transition-colors duration-150 hover:bg-[#1177bb]"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => setConfirmSubmit(false)}
                className="flex-1 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-2 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Link
        to={`/mock-tests/${test.id}`}
        className="w-fit text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
      >
        Exit to test details
      </Link>
    </div>
  )
}
