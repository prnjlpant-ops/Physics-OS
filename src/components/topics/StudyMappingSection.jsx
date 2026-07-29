import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'
import { LIBRARY_CATEGORY_META } from '../../constants/libraryConstants'

/**
 * Sprint 26 — one category block inside the Topic Details page's Study
 * Mapping section (Books / Formula Sheets / Memory Sheets / Notes /
 * Videos / Research Papers). `entry` is one field of the object
 * `StudyMappingService.buildStudyMap` returns: `{ resolved, broken }`.
 * Resolved resources link straight to the existing
 * `pages/library/ResourceDetailsPage.jsx`; broken ids (referencing a
 * resource that isn't in the Master Index) are shown as a plain warning
 * rather than a link, satisfying this sprint's "broken links" VALIDATION
 * requirement without hiding the gap.
 */
export default function StudyMappingSection({ categoryKey, entry }) {
  const meta = LIBRARY_CATEGORY_META[categoryKey]
  if (!meta) return null

  const Icon = meta.icon
  const hasNothing = entry.resolved.length === 0 && entry.broken.length === 0
  if (hasNothing) return null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[#6e6e6e]">
        <Icon size={12} strokeWidth={1.75} />
        {meta.label}
      </div>

      {entry.resolved.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entry.resolved.map((resource) => (
            <Link
              key={resource.id}
              to={`/library/resource/${resource.id}`}
              className="rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1 text-[11px] text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-white"
            >
              {resource.title}
            </Link>
          ))}
        </div>
      )}

      {entry.broken.length > 0 && (
        <div className="flex items-start gap-1.5 text-[11px] text-[#f48771]">
          <AlertTriangle size={12} strokeWidth={1.75} className="mt-0.5 shrink-0" />
          <span>
            {entry.broken.length} reference{entry.broken.length === 1 ? '' : 's'} to a {meta.singular.toLowerCase()}{' '}
            not found in the Master Index ({entry.broken.join(', ')})
          </span>
        </div>
      )}
    </div>
  )
}
