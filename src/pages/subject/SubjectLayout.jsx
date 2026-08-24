import { useEffect } from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen } from 'lucide-react'
import WorkspaceService from '../../services/WorkspaceService'
import { getSubjectById } from '../../engine/blueprintService'

const TABS = [
  { label: 'Overview', to: '.' },
  { label: 'Chapters', to: 'chapters' },
  { label: 'Books', to: 'books' },
  { label: 'Videos', to: 'videos' },
  { label: 'Progress', to: 'progress' },
  { label: 'Resources', to: 'resources' },
  { label: 'Knowledge Base', to: 'knowledge-base' },
  { label: 'Active Recall', to: 'active-recall' },
]

export default function SubjectLayout() {
  const { subjectId } = useParams()
  const subject = getSubjectById(subjectId)

  useEffect(() => {
    if (subject) {
      WorkspaceService.setCurrentSubject(subject.id)
    }
  }, [subject])

  if (!subject) {
    return (
      <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/subjects" className="inline-flex items-center gap-1.5 text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]">
          <ArrowLeft size={14} strokeWidth={1.75} />
          Subjects
        </Link>
        <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4 text-sm text-[#9d9d9d]">
          Subject not found.
        </div>
      </div>
    )
  }

  const Icon = subject.icon ?? BookOpen

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <Link
          to="/subjects"
          className="inline-flex items-center gap-1.5 text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
        >
          <ArrowLeft size={14} strokeWidth={1.75} />
          Subjects
        </Link>

        <div className="mt-3 flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#cccccc]">
            <Icon size={22} strokeWidth={1.75} />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-[#e8e8e8]">{subject.name}</h2>
            <p className="text-xs text-[#858585]">{subject.description ?? 'Blueprint-backed subject study flow.'}</p>
          </div>
        </div>
      </div>

      <nav className="-mx-1 flex gap-1 overflow-x-auto border-b border-[#3c3c3c] px-1 pb-px">
        {TABS.map((tab) => (
          <NavLink
            key={tab.label}
            to={tab.to}
            end={tab.to === '.'}
            className={({ isActive }) =>
              [
                'shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors duration-150',
                isActive
                  ? 'border-[#0e639c] text-[#e8e8e8]'
                  : 'border-transparent text-[#9d9d9d] hover:text-[#cccccc]',
              ].join(' ')
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet context={{ subject }} />
    </div>
  )
}
