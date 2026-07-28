import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { LIBRARY_CATEGORY_META } from '../../constants/libraryConstants'
import BookmarkButton from './BookmarkButton'
import PriorityBadge from './PriorityBadge'

export default function BookCard({ resource, isBookmarked, onToggleBookmark }) {
  const meta = LIBRARY_CATEGORY_META[resource.categoryKey] ?? LIBRARY_CATEGORY_META.books
  const Icon = meta.icon

  return (
    <div className="group flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#4a4a4a] hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-10 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]">
          <Icon size={18} strokeWidth={1.5} />
        </span>
        <div className="min-w-0 flex-1">
          <Link to={`/library/resource/${resource.id}`} className="block truncate text-sm font-medium text-[#e8e8e8] hover:text-white">
            {resource.title}
          </Link>
          <p className="mt-0.5 truncate text-[11px] text-[#858585]">{resource.subjectName}</p>
        </div>
        <BookmarkButton active={isBookmarked} onToggle={() => onToggleBookmark(resource.id)} />
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-[#3c3c3c] pt-2.5 text-[11px]">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Author</p>
          <p className="mt-0.5 truncate text-[#cccccc]">{resource.author}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Edition</p>
          <p className="mt-0.5 truncate text-[#cccccc]">{resource.edition ?? '—'}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <PriorityBadge priority={resource.priority} />
        <span className="text-[10px] text-[#6e6e6e]">{resource.status}</span>
      </div>

      <Link
        to={`/library/resource/${resource.id}`}
        className="mt-auto flex items-center justify-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
      >
        <ExternalLink size={13} strokeWidth={1.75} />
        View Details
      </Link>
    </div>
  )
}
