import { useEffect } from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { getChapterBySlug } from '../../../constants/subjects'
import { getChapterResources } from '../../../data/resourcesData'
import { RESOURCE_TYPE_ORDER, RESOURCE_TYPE_META } from '../../../constants/resourceTypes'
import PageTitle from '../../../components/PageTitle'
import WorkspaceService from '../../../services/WorkspaceService'

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
  const found = getChapterBySlug(subjectId, chapterSlug)

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
        <p className="mt-0.5 text-xs text-[#858585]">Resources for this chapter</p>
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
