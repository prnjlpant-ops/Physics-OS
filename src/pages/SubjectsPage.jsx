import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight } from 'lucide-react'
import { getSubjects } from '../data/subjects.js'

function priorityStyle(priority) {
  const label = String(priority ?? '').toLowerCase()
  if (label.includes('high')) return 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]'
  if (label.includes('medium')) return 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]'
  return 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585]'
}

function difficultyStyle(difficulty) {
  const label = String(difficulty ?? '').toLowerCase()
  if (label.includes('high')) return 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]'
  if (label.includes('medium')) return 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]'
  return 'border-[#89d185]/30 bg-[#89d185]/10 text-[#89d185]'
}

export default function SubjectsPage() {
  const subjects = useMemo(() => getSubjects(), [])

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <h2 className="text-lg font-semibold text-[#e8e8e8]">Subjects</h2>
        <p className="mt-1 text-sm text-[#858585]">
          The subject experience is now driven by the Excel blueprint and the chapter structure beneath each subject.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
        {subjects.map((subject) => {
          const Icon = subject.icon ?? BookOpen
          const priority = subject.priority ?? 'Medium'
          const difficulty = subject.difficultyOverall ?? 'Medium'

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
                  {subject.description ?? 'Blueprint-backed subject overview and chapter track.'}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-wide text-[#4fc1ff]">
                  <span>{subject.chapters?.length ?? 0} chapters</span>
                  <span className="text-[#858585]">•</span>
                  <span className={`rounded-full border px-2 py-0.5 font-medium normal-case ${priorityStyle(priority)}`}>
                    {priority} priority
                  </span>
                  <span className={`rounded-full border px-2 py-0.5 font-medium normal-case ${difficultyStyle(difficulty)}`}>
                    {difficulty} difficulty
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
