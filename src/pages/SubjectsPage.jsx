import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { getSubjects } from '../engine/blueprintService'
import { useSyllabusStatus } from '../hooks/useSyllabusStatus'
import { getSyllabusProgress } from '../data/syllabusData'

function chapterCompletion(subject, chapter, progressByChapter) {
  const chapterId = `${subject.id}__${chapter.slug}`
  return progressByChapter[chapterId] ?? 0
}

function subjectCompletion(subject, progressByChapter) {
  const total = subject.chapters.reduce(
    (sum, chapter) => sum + chapterCompletion(subject, chapter, progressByChapter),
    0,
  )
  return subject.chapters.length === 0 ? 0 : Math.round(total / subject.chapters.length)
}

export default function SubjectsPage() {
  const { overrides } = useSyllabusStatus()
  const progress = useMemo(() => {
    const syllabusProgress = getSyllabusProgress(overrides)
    return syllabusProgress.byChapter.reduce((acc, chapter) => {
      acc[chapter.id] = chapter.completion
      return acc
    }, {})
  }, [overrides])

  const subjects = useMemo(() => getSubjects(), [])

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-lg font-semibold text-[#e8e8e8]">Subjects</h2>
        <p className="mt-1 text-sm text-[#858585]">
          Organized by syllabus. Pick a subject to open its dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {subjects.map((subject) => {
          const Icon = subject.icon
          const completion = subjectCompletion(subject, progress)

          return (
            <Link
              key={subject.id}
              to={`/subjects/${subject.id}`}
              className="group flex flex-col gap-4 rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4 transition-colors duration-150 hover:border-[#4a4a4a] hover:bg-[#2d2d2d]"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#cccccc] transition-colors duration-150 group-hover:border-[#4a4a4a]">
                  <Icon size={20} strokeWidth={1.75} />
                </span>
                <ChevronRight
                  size={18}
                  strokeWidth={1.75}
                  className="mt-1 shrink-0 text-[#858585] transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-[#cccccc]"
                />
              </div>

              <div>
                <h3 className="text-sm font-semibold text-[#e8e8e8]">{subject.name}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-[#858585]">
                  {subject.description}
                </p>
              </div>

              <div className="mt-auto flex items-center gap-3">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#3c3c3c]">
                  <div
                    className="h-full rounded-full bg-[#0e639c]"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <span className="shrink-0 text-xs font-medium text-[#9d9d9d]">
                  {completion}%
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-[#3c3c3c] pt-3 text-xs text-[#858585]">
                <span>{subject.chapters.length} Chapters</span>
                <span>
                  {subject.chapters.filter((chapter) => chapterCompletion(subject, chapter, progress) === 100).length} Completed
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
