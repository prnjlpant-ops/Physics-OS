import { useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { useSyllabusStatus } from '../../hooks/useSyllabusStatus'
import { getSyllabusProgress } from '../../data/syllabusData'

function average(values) {
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

function statusToValue(status, doneLabel) {
  if (status === doneLabel) return 100
  if (status === 'In Progress') return 55
  return 0
}

function ProgressBar({ label, value }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#cccccc]">{label}</p>
        <p className="text-sm font-medium text-[#e8e8e8]">{value}%</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#3c3c3c]">
        <div className="h-full rounded-full bg-[#0e639c]" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function SubjectProgressPage() {
  const { subject } = useOutletContext()
  const { overrides } = useSyllabusStatus()
  const progress = useMemo(() => getSyllabusProgress(overrides), [overrides])
  const chapters = progress.byChapter.filter((chapter) => chapter.subjectName === subject.name)
  const overall = chapters.length ? average(chapters.map((chapter) => chapter.completion)) : 0
  const completed = chapters.filter((chapter) => chapter.completion === 100).length
  const inProgress = chapters.filter((chapter) => chapter.completion > 0 && chapter.completion < 100).length

  return (
    <section className="flex flex-col gap-6 rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-5">
      <ProgressBar label="Overall Completion" value={overall} />
      <ProgressBar label="Completed Chapters" value={chapters.length ? Math.round((completed / chapters.length) * 100) : 0} />
      <ProgressBar label="In-progress Chapters" value={chapters.length ? Math.round((inProgress / chapters.length) * 100) : 0} />
      <p className="text-xs text-[#858585]">{completed} complete · {inProgress} in progress · {Math.max(0, chapters.length - completed - inProgress)} remaining</p>
    </section>
  )
}
