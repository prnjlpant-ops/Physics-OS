import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { BookOpen, CheckCircle2, Clock } from 'lucide-react'
import { useSyllabusStatus } from '../../hooks/useSyllabusStatus'
import { getSyllabusProgress } from '../../data/syllabusData'

export default function SubjectOverviewPage() {
  const { subject } = useOutletContext()
  const { overrides } = useSyllabusStatus()
  const progressByChapter = useMemo(() => {
    const syllabusProgress = getSyllabusProgress(overrides)
    return syllabusProgress.byChapter.reduce((acc, chapter) => {
      acc[chapter.id] = chapter.completion
      return acc
    }, {})
  }, [overrides])

  const chapterStatusMap = useMemo(() => {
    return subject.chapters.reduce((acc, chapter) => {
      const completion = progressByChapter[`${subject.id}__${chapter.slug}`] ?? 0
      const status = completion === 100 ? 'Completed' : completion > 0 ? 'In Progress' : 'Not Started'
      acc[chapter.slug] = status
      return acc
    }, {})
  }, [progressByChapter, subject])

  const completed = Object.values(chapterStatusMap).filter((status) => status === 'Completed').length
  const inProgress = Object.values(chapterStatusMap).filter((status) => status === 'In Progress').length
  const notStarted = Object.values(chapterStatusMap).filter((status) => status === 'Not Started').length

  const stats = [
    { label: 'Total Chapters', value: subject.chapters.length, icon: BookOpen },
    { label: 'Completed', value: completed, icon: CheckCircle2 },
    { label: 'In Progress', value: inProgress, icon: Clock },
  ]

  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4 transition-colors duration-150">
        <h3 className="text-sm font-semibold text-[#e8e8e8]">About</h3>
        <p className="mt-2 text-sm leading-relaxed text-[#9d9d9d]">{subject.description}</p>
      </section>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3.5 transition-colors duration-150 hover:border-[#4a4a4a]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]">
              <Icon size={17} strokeWidth={1.75} />
            </span>
            <div>
              <p className="text-xs text-[#858585]">{label}</p>
              <p className="mt-0.5 text-lg font-semibold text-[#e8e8e8]">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <section>
        <h3 className="mb-3 text-sm font-semibold text-[#e8e8e8]">Chapter Snapshot</h3>
        <div className="flex flex-col gap-2 rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4">
          {subject.chapters.map((chapter) => (
            <div
              key={chapter.name}
              className="flex items-center justify-between border-b border-[#3c3c3c] py-2 text-sm last:border-b-0 last:pb-0"
            >
              <span className="text-[#cccccc]">{chapter.name}</span>
              <span className="text-xs text-[#858585]">{chapterStatusMap[chapter.slug]}</span>
            </div>
          ))}
        </div>
      </section>

      <p className="text-xs text-[#858585]">
        {notStarted} chapter{notStarted === 1 ? '' : 's'} not started yet.
      </p>
    </div>
  )
}
