import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { EXAM_META } from '../../constants/pyqLibraryConstants'
import PaperBookmarkButton from './PaperBookmarkButton'
import PaperStatusBadge from './PaperStatusBadge'

export default function PaperCard({ paper, isBookmarked, onToggleBookmark }) {
  return (
    <div className="group flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#4a4a4a] hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <Link
            to={`/pyqs/${paper.id}`}
            className="block truncate text-sm font-medium text-[#e8e8e8] hover:text-white"
          >
            {EXAM_META[paper.exam]?.label ?? paper.exam} {paper.year ?? ''}
          </Link>
          <p className="mt-0.5 truncate text-[11px] text-[#858585]">{paper.subject}</p>
        </div>
        <PaperBookmarkButton active={isBookmarked} onToggle={() => onToggleBookmark(paper.id)} />
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-[#3c3c3c] pt-2.5 text-[11px]">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Year</p>
          <p className="mt-0.5 truncate text-[#cccccc]">{paper.year ?? '—'}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Questions</p>
          <p className="mt-0.5 truncate text-[#cccccc]">
            {paper.questionCount != null ? paper.questionCount : 'Not Indexed'}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <PaperStatusBadge status={paper.status} />
        <span className="text-[10px] text-[#6e6e6e]">{paper.path ? 'Path Added' : 'Not Added'}</span>
      </div>

      <Link
        to={`/pyqs/${paper.id}`}
        className="mt-auto flex items-center justify-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
      >
        <ExternalLink size={13} strokeWidth={1.75} />
        View Details
      </Link>
    </div>
  )
}
