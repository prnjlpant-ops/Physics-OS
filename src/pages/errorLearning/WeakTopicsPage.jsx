import { useMemo } from 'react'
import { getWeakTopics } from '../../data/errorLearningData'
import WeakTopicCard from '../../components/errorLearning/WeakTopicCard'
import ErrorBarRow from '../../components/errorLearning/ErrorBarRow'

export default function WeakTopicsPage() {
  const { weakSubjects, weakChapters, errorTypeFrequency, missedConcepts } = useMemo(getWeakTopics, [])
  const maxTypeCount = Math.max(1, ...errorTypeFrequency.map((item) => item.count))

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <section className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Weak Subjects</h3>
          <div className="flex flex-col gap-2">
            {weakSubjects.map((subject, index) => (
              <WeakTopicCard key={subject.id} rank={index + 1} name={subject.name} errorCount={subject.errorCount} />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-2.5">
          <h3 className="text-sm font-semibold text-[#e8e8e8]">Weak Chapters</h3>
          <div className="flex flex-col gap-2">
            {weakChapters.map((chapter, index) => (
              <WeakTopicCard
                key={chapter.id}
                rank={index + 1}
                name={chapter.name}
                sublabel={chapter.subjectName}
                errorCount={chapter.errorCount}
              />
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <h4 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Most Frequent Error Types</h4>
        <div className="flex flex-col gap-3">
          {errorTypeFrequency.map((item) => (
            <ErrorBarRow key={item.label} label={item.label} value={item.count} max={maxTypeCount} suffix=" errors" tone="warn" />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-2.5">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">Most Missed Concepts</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {missedConcepts.map((item) => (
            <div key={item.concept} className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5">
              <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">{item.label}</p>
              <p className="mt-1 text-sm text-[#cccccc]">{item.concept}</p>
              <p className="mt-2 text-[11px] text-[#858585]">{item.count} related errors</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
