import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight } from 'lucide-react'
import { getSubjects } from '../engine/blueprintService'
import roadmapTopics from '../data/roadmap.json' with { type: 'json' }
import pyqIndexRaw from '../data/pyq/pyq_index.json'

function getHighestPriority(subjectId) {
  const topicIds = pyqIndexRaw.topics.filter(t => t.subjectId === subjectId).map(t => t.id)
  const roadmapItems = roadmapTopics.filter(r => topicIds.includes(r.id) && r.priority)
  
  if (roadmapItems.length === 0) return 'Medium'
  
  const priorities = roadmapItems.map(r => r.priority)
  if (priorities.includes('High')) return 'High'
  if (priorities.includes('Medium')) return 'Medium'
  return 'Low'
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
                <div className="mt-3 flex items-center gap-2 text-[11px] uppercase tracking-wide text-[#4fc1ff]">
                  <span>{subject.chapters?.length ?? 0} chapters</span>
                  <span className="text-[#858585]">•</span>
                  <span>{getHighestPriority(subject.id)} priority</span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
