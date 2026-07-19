import { Link, useParams } from 'react-router-dom'
import {
  Award,
  Percent,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Target,
  Clock3,
  Trophy,
  BarChart3,
  RefreshCw,
} from 'lucide-react'
import { getMockTestById, generateMockResult } from '../../data/mockTestsData'
import ResultStatCard from '../../components/mockTests/ResultStatCard'
import PageTitle from '../../components/PageTitle'

export default function ResultPage() {
  const { testId } = useParams()
  const test = getMockTestById(testId)

  if (!test) {
    return <PageTitle title="Mock Test Not Found" />
  }

  const result = generateMockResult(test)

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <p className="text-[11px] uppercase tracking-wide text-[#6e6e6e]">
          {test.exam} · {test.type}
        </p>
        <h2 className="text-lg font-semibold text-[#e8e8e8]">{test.title} — Result</h2>
      </div>

      <div className="flex flex-col items-center gap-1.5 rounded-lg border border-[#3c3c3c] bg-[#252526] p-6 text-center">
        <p className="text-xs uppercase tracking-wide text-[#858585]">Score</p>
        <p className="text-4xl font-semibold text-[#e8e8e8]">
          {result.score}
          <span className="text-lg text-[#858585]">/{result.totalMarks}</span>
        </p>
        <p className="text-sm text-[#4fc1ff]">{result.percentage}%</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <ResultStatCard icon={CheckCircle2} label="Correct" value={result.correct} tone="good" />
        <ResultStatCard icon={XCircle} label="Incorrect" value={result.incorrect} tone="bad" />
        <ResultStatCard icon={MinusCircle} label="Skipped" value={result.skipped} tone="muted" />
        <ResultStatCard icon={Percent} label="Accuracy" value={`${result.accuracy}%`} tone="accent" />
        <ResultStatCard
          icon={Clock3}
          label="Time Taken"
          value={`${result.timeTakenMinutes}/${result.totalDurationMinutes} min`}
        />
        <ResultStatCard icon={Target} label="Percentage" value={`${result.percentage}%`} />
        <ResultStatCard
          icon={Trophy}
          label="Rank"
          value={`${result.rank.toLocaleString()} / ${result.totalCandidates.toLocaleString()}`}
        />
        <ResultStatCard icon={Award} label="Total Marks" value={result.totalMarks} />
      </div>

      <section className="flex flex-col gap-2 rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Performance Summary</h3>
        <p className="text-xs leading-relaxed text-[#9d9d9d]">
          You scored {result.percentage}% with {result.accuracy}% accuracy across {test.questions}{' '}
          questions, finishing in {result.timeTakenMinutes} of the {result.totalDurationMinutes} minutes
          available. Rank and performance figures shown here are placeholders — real evaluation is not
          part of this sprint.
        </p>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/mock-tests/analysis"
          className="flex items-center gap-2 rounded-md bg-[#0e639c] px-4 py-2 text-sm font-medium text-white transition-colors duration-150 hover:bg-[#1177bb]"
        >
          <BarChart3 size={16} strokeWidth={1.75} />
          View Analysis
        </Link>
        <Link
          to="/mock-tests/revision-queue"
          className="flex items-center gap-2 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-4 py-2 text-sm font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
        >
          <RefreshCw size={16} strokeWidth={1.75} />
          Revision Queue
        </Link>
        <Link
          to="/mock-tests/library"
          className="flex items-center gap-2 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-4 py-2 text-sm font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
        >
          Back to Library
        </Link>
      </div>
    </div>
  )
}
