import { useMemo } from 'react'
import { ListChecks, CheckCircle2, Clock3, Percent } from 'lucide-react'
import { getStatistics } from '../../data/errorLearningData'
import ErrorStatCard from '../../components/errorLearning/ErrorStatCard'
import ErrorBarRow from '../../components/errorLearning/ErrorBarRow'

export default function StatisticsPage() {
  const stats = useMemo(() => getStatistics(), [])
  const maxSourceCount = Math.max(1, ...stats.bySource.map((item) => item.count))
  const maxDifficultyCount = Math.max(1, ...stats.byDifficulty.map((item) => item.count))

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <ErrorStatCard icon={ListChecks} label="Total Errors" value={stats.totalErrors} accent />
        <ErrorStatCard icon={CheckCircle2} label="Resolved" value={stats.resolvedCount} />
        <ErrorStatCard icon={Clock3} label="Pending" value={stats.pendingCount} />
        <ErrorStatCard icon={Percent} label="Resolution Rate" value={`${stats.resolutionRate}%`} />
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
          <h4 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Errors by Source</h4>
          <div className="flex flex-col gap-3">
            {stats.bySource.map((item) => (
              <ErrorBarRow key={item.label} label={item.label} value={item.count} max={maxSourceCount} suffix=" errors" />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
          <h4 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Errors by Difficulty</h4>
          <div className="flex flex-col gap-3">
            {stats.byDifficulty.map((item) => (
              <ErrorBarRow
                key={item.label}
                label={item.label}
                value={item.count}
                max={maxDifficultyCount}
                suffix=" errors"
                tone={item.label === 'Easy' ? 'good' : item.label === 'Moderate' ? 'warn' : 'bad'}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
