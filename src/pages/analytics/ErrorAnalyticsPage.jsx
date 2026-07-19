import { useMemo } from 'react'
import { AlertOctagon, CheckCircle2, Clock3, TrendingDown, BookX } from 'lucide-react'
import { getErrorAnalyticsSummary } from '../../data/analyticsData'
import AnalyticsStatCard from '../../components/analytics/AnalyticsStatCard'
import AnalyticsBarRow from '../../components/analytics/AnalyticsBarRow'

export default function ErrorAnalyticsPage() {
  const { dashboard, weakTopics } = useMemo(() => getErrorAnalyticsSummary(), [])
  const maxTypeCount = Math.max(...weakTopics.errorTypeFrequency.map((t) => t.count), 1)

  return (
    <div className="flex flex-col gap-6">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <AnalyticsStatCard icon={AlertOctagon} label="Total Errors" value={dashboard.totalErrors} accent />
        <AnalyticsStatCard icon={CheckCircle2} label="Resolved" value={dashboard.resolvedErrors} />
        <AnalyticsStatCard icon={Clock3} label="Pending" value={dashboard.pendingRevision} />
      </section>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-[#f48771]/30 bg-[#252526] p-4">
          <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-[#f48771]">
            <TrendingDown size={15} strokeWidth={1.75} />
            Weak Subjects
          </h3>
          <div className="flex flex-col gap-3">
            {weakTopics.weakSubjects.map((subject) => (
              <AnalyticsBarRow
                key={subject.id}
                label={subject.name}
                value={subject.errorCount}
                max={Math.max(...weakTopics.weakSubjects.map((s) => s.errorCount), 1)}
                suffix=" errors"
                tone="bad"
              />
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
          <h3 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-[#e8e8e8]">
            <BookX size={15} strokeWidth={1.75} className="text-[#858585]" />
            Weak Chapters
          </h3>
          <div className="flex flex-col gap-3">
            {weakTopics.weakChapters.map((chapter) => (
              <AnalyticsBarRow
                key={chapter.id}
                label={chapter.name}
                sublabel={chapter.subjectName}
                value={chapter.errorCount}
                max={Math.max(...weakTopics.weakChapters.map((c) => c.errorCount), 1)}
                suffix=" errors"
                tone="warn"
              />
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <h3 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Most Frequent Error Types</h3>
        <div className="flex flex-col gap-3">
          {weakTopics.errorTypeFrequency.map((type) => (
            <AnalyticsBarRow
              key={type.label}
              label={type.label}
              value={type.count}
              max={maxTypeCount}
              suffix=" occurrences"
              tone="accent"
            />
          ))}
        </div>
      </section>
    </div>
  )
}
