import { Link } from 'react-router-dom'
import { AlertTriangle, FlaskConical } from 'lucide-react'
import { EXAM_META } from '../../constants/pyqLibraryConstants'

/**
 * Sprint 26 — the "Related PYQs" block on the Topic Details page.
 * `entry` is `StudyMappingService.buildStudyMap(...).pyqs`: `{ resolved,
 * broken }`, resolved against the existing Paper Library
 * (`engine/pyq/pyqService.js`). Kept as its own component (rather than
 * reusing `StudyMappingSection`) since papers link to `/pyqs/:id` and
 * display exam + year, not a Library category icon/title.
 */
export default function PyqMappingSection({ entry }) {
  if (!entry || (entry.resolved.length === 0 && entry.broken.length === 0)) return null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-[#6e6e6e]">
        <FlaskConical size={12} strokeWidth={1.75} />
        Related PYQs
      </div>

      {entry.resolved.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {entry.resolved.map((paper) => (
            <Link
              key={paper.id}
              to={`/pyqs/${paper.id}`}
              className="rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1 text-[11px] text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] hover:text-white"
            >
              {EXAM_META[paper.exam]?.label ?? paper.exam} {paper.year ?? ''}
            </Link>
          ))}
        </div>
      )}

      {entry.broken.length > 0 && (
        <div className="flex items-start gap-1.5 text-[11px] text-[#f48771]">
          <AlertTriangle size={12} strokeWidth={1.75} className="mt-0.5 shrink-0" />
          <span>
            {entry.broken.length} reference{entry.broken.length === 1 ? '' : 's'} to a paper not found in the Paper
            Library ({entry.broken.join(', ')})
          </span>
        </div>
      )}
    </div>
  )
}
