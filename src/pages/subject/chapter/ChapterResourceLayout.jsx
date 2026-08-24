import { useEffect } from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getChapter } from '../../../engine/blueprintService'
import { getChapterResources } from '../../../data/resourcesData'
import { RESOURCE_TYPE_ORDER, RESOURCE_TYPE_META } from '../../../constants/resourceTypes'
import PageTitle from '../../../components/PageTitle'
import WorkspaceService from '../../../services/WorkspaceService'
import useChapterCompletion from '../../../hooks/useChapterCompletion'

const TAB_PATHS = {
  books: 'books',
  videos: 'videos',
  pdfs: 'pdfs',
  solutionManuals: 'solution-manuals',
  referenceMaterial: 'reference-material',
  externalLinks: 'external-links',
}

export default function ChapterResourceLayout() {
  const { subjectId, chapterSlug } = useParams()
  const found = getChapter(subjectId, chapterSlug)

  // Sprint 28 — Desktop Readiness Layer: records "where the user is" so
  // ContinueStudyingCard (and future consumers) can restore it after a
  // refresh. Purely additive — nothing here changes what's rendered.
  useEffect(() => {
    if (found) {
      WorkspaceService.setCurrentSubject(found.subject.id)
      WorkspaceService.setCurrentChapter(found.chapter.slug)
    }
  }, [found])

  if (!found) {
    return <PageTitle title="Chapter Not Found" />
  }

  const { subject, chapter } = found
  const resources = getChapterResources(subject, chapter)
  const { completed, toggle } = useChapterCompletion(`${subject.id}__${chapter.slug}`)

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <div>
        <Link
          to={`/subjects/${subject.id}/chapters`}
          className="inline-flex items-center gap-1.5 text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]"
        >
          <ArrowLeft size={14} strokeWidth={1.75} />
          {subject.name}
        </Link>

        <h2 className="mt-3 text-lg font-semibold text-[#e8e8e8]">{chapter.name}</h2>
        <div className="mt-1 flex items-center gap-3"><p className="text-xs text-[#858585]">One primary book and video are shown first; expand cards for the full study plan.</p><label className="flex shrink-0 items-center gap-1.5 text-xs text-[#9d9d9d]"><input type="checkbox" checked={completed} onChange={toggle} className="accent-[#0e639c]" />Chapter complete</label></div>
      </div>

      <nav className="-mx-1 flex gap-1 overflow-x-auto border-b border-[#3c3c3c] px-1 pb-px">
        {RESOURCE_TYPE_ORDER.map((typeKey) => (
          <NavLink
            key={typeKey}
            to={TAB_PATHS[typeKey]}
            className={({ isActive }) =>
              [
                'shrink-0 whitespace-nowrap border-b-2 px-3 py-2 text-sm transition-colors duration-150',
                isActive
                  ? 'border-[#0e639c] text-[#e8e8e8]'
                  : 'border-transparent text-[#9d9d9d] hover:text-[#cccccc]',
              ].join(' ')
            }
          >
            {RESOURCE_TYPE_META[typeKey].label}
            <span className="ml-1.5 text-[10px] text-[#6e6e6e]">{resources[typeKey].length}</span>
          </NavLink>
        ))}
      </nav>

      <Outlet context={{ subject, chapter, resources }} />
    </div>
  )
}
