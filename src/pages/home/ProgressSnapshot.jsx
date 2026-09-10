import { useMemo } from 'react'
import { useProgress } from '../../hooks/useProgress'
import { useSyllabusStatus } from '../../hooks/useSyllabusStatus'
import { getSyllabusProgress } from '../../data/syllabusData'
import { formatDuration } from '../../utils/formatDuration'

export default function ProgressSnapshot() {
  const progress = useProgress()
  const { overrides } = useSyllabusStatus()
  const syllabus = useMemo(() => getSyllabusProgress(overrides), [overrides])
  const uniqueChapters = Array.from(new Map(syllabus.byChapter.map((chapter) => [`${chapter.subjectName}::${chapter.name}`, chapter])).values())
  const uniqueSubjects = Array.from(new Map(syllabus.bySubject.map((subject) => [subject.name, subject])).values())
  const completedChapters = uniqueChapters.filter((chapter) => chapter.completion === 100).length
  const completedSubjects = uniqueSubjects.filter((subject) => subject.completion === 100).length
  const stats = [
    { label: 'Study Time Today', value: formatDuration(progress.todayStudyTimeMs) },
    { label: 'Current Streak', value: `${progress.currentStreak} Days` },
    { label: 'Completed Chapters', value: `${completedChapters} / ${uniqueChapters.length}` },
    { label: 'Subjects Completed', value: `${completedSubjects} / ${uniqueSubjects.length}` },
  ]
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Progress Snapshot</h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3.5 transition-colors duration-150 hover:border-[#4a4a4a]"
          >
            <p className="text-xs text-[#858585]">{label}</p>
            <p className="mt-1.5 text-lg font-semibold text-[#e8e8e8]">{value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
