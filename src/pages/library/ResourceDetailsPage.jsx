import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, FolderOpen } from 'lucide-react'
import { useLibrary } from '../../hooks/useLibrary'
import { useLibraryBookmarks } from '../../hooks/useLibraryBookmarks'
import { LIBRARY_CATEGORY_META } from '../../constants/libraryConstants'
import BookmarkButton from '../../components/library/BookmarkButton'
import PriorityBadge from '../../components/library/PriorityBadge'
import ResourceLauncherService from '../../services/ResourceLauncherService'

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">{label}</p>
      <p className="mt-0.5 text-sm text-[#e8e8e8]">{value || '—'}</p>
    </div>
  )
}

/**
 * Sprint 24 — a reusable details page for any Master Index resource, not
 * just Books, so future categories (Solution Manuals, Formula Sheets, ...)
 * can route here too once they're populated.
 *
 * Sprint 28 — Desktop Readiness Layer: "Open" now goes through
 * ResourceLauncherService for every resource, not only ones with a `url`.
 * A `url` resource still opens in a new browser tab; a `path`-only
 * resource degrades gracefully with a NotificationService message instead
 * of a permanently disabled button (no real desktop file integration
 * exists yet — out of scope, see Sprint 28's DO NOT IMPLEMENT list).
 */
export default function ResourceDetailsPage() {
  const { resourceId } = useParams()
  const { getResourceById } = useLibrary()
  const { bookmarkIds, toggleBookmark } = useLibraryBookmarks()

  const resource = getResourceById(resourceId)

  if (!resource) {
    return (
      <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
        <Link to="/library" className="inline-flex items-center gap-1.5 text-xs text-[#858585] hover:text-[#cccccc]">
          <ArrowLeft size={14} strokeWidth={1.75} />
          Library
        </Link>
        <p className="text-sm text-[#9d9d9d]">That resource couldn&apos;t be found in the Master Index.</p>
      </div>
    )
  }

  const meta = LIBRARY_CATEGORY_META[resource.categoryKey] ?? LIBRARY_CATEGORY_META.books
  const Icon = meta.icon
  const isBookmarked = bookmarkIds.includes(resource.id)

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <Link to="/library" className="inline-flex w-fit items-center gap-1.5 text-xs text-[#858585] transition-colors duration-150 hover:text-[#cccccc]">
        <ArrowLeft size={14} strokeWidth={1.75} />
        Library
      </Link>

      <div className="flex items-start gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#cccccc]">
          <Icon size={22} strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-semibold text-[#e8e8e8]">{resource.title}</h2>
          <p className="mt-0.5 text-xs text-[#858585]">
            {resource.subjectName} · {meta.label}
          </p>
        </div>
        <BookmarkButton active={isBookmarked} onToggle={() => toggleBookmark(resource.id)} size={16} />
      </div>

      <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Author" value={resource.author} />
          <Field label="Edition" value={resource.edition} />
          <Field label="Subject" value={resource.subjectName} />
          <div>
            <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Priority</p>
            <div className="mt-1">
              <PriorityBadge priority={resource.priority} />
            </div>
          </div>
          <Field label="Status" value={resource.status} />
          <Field label="Category" value={meta.label} />
        </div>

        {resource.description && (
          <div className="mt-4 border-t border-[#3c3c3c] pt-3">
            <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Description</p>
            <p className="mt-1 text-sm leading-relaxed text-[#cccccc]">{resource.description}</p>
          </div>
        )}

        {resource.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[#3c3c3c] pt-3">
            {resource.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-[#3c3c3c] bg-[#2d2d2d] px-2.5 py-1 text-[10px] text-[#9d9d9d]">
                {tag}
              </span>
            ))}
          </div>
        )}

        {resource.path && (
          <div className="mt-4 border-t border-[#3c3c3c] pt-3">
            <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Local Path</p>
            <p className="mt-1 truncate font-mono text-[11px] text-[#9d9d9d]">{resource.path}</p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {resource.url ? (
          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-md border border-[#0e639c] bg-[#0e639c] px-3 py-1.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-[#1177bb]"
          >
            <ExternalLink size={13} strokeWidth={1.75} />
            Open in Browser
          </a>
        ) : (
          <button
            type="button"
            onClick={() => ResourceLauncherService.openLibraryResource(resource)}
            title={resource.path ? 'Open this resource' : 'No path is set for this resource yet'}
            className="flex items-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-3 py-1.5 text-xs font-medium text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a]"
          >
            <FolderOpen size={13} strokeWidth={1.75} />
            Open
          </button>
        )}
      </div>
    </div>
  )
}
