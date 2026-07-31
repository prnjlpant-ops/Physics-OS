import { ExternalLink } from 'lucide-react'
import FavoriteButton from './FavoriteButton'
import { RESOURCE_TYPE_META } from '../../constants/resourceTypes'
import ResourceLauncherService, { LAUNCHABLE_RESOURCE_TYPES } from '../../services/ResourceLauncherService'

// resourcesData.js's own `type` values ('books', 'videos', ...) don't match
// LAUNCHABLE_RESOURCE_TYPES ('book', 'video', ...) — map the ones that are
// actually launchable. pdfs/referenceMaterial/externalLinks have no url or
// path today (placeholder-only), so they're intentionally left unmapped.
const LAUNCH_TYPE_BY_RESOURCE_TYPE = {
  books: LAUNCHABLE_RESOURCE_TYPES.BOOK,
  solutionManuals: LAUNCHABLE_RESOURCE_TYPES.BOOK,
  videos: LAUNCHABLE_RESOURCE_TYPES.VIDEO,
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">{label}</p>
      <p className="mt-0.5 truncate text-[#cccccc]">{value}</p>
    </div>
  )
}

function ResourceFields({ resource }) {
  switch (resource.type) {
    case 'books':
    case 'solutionManuals':
      return (
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-[#3c3c3c] pt-2.5 text-[11px]">
          <Field label="Author" value={resource.author} />
          <Field label="Edition" value={resource.edition} />
          <Field label="Status" value={resource.status} />
        </div>
      )
    case 'videos':
      return (
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 border-t border-[#3c3c3c] pt-2.5 text-[11px]">
          <Field label="Duration" value={resource.duration} />
          <Field label="Source" value={resource.source} />
        </div>
      )
    case 'pdfs':
      return (
        <div className="border-t border-[#3c3c3c] pt-2.5 text-[11px]">
          <Field label="Size" value={resource.size} />
        </div>
      )
    case 'referenceMaterial':
      return (
        <p className="border-t border-[#3c3c3c] pt-2.5 text-[11px] leading-relaxed text-[#9d9d9d]">
          {resource.description}
        </p>
      )
    case 'externalLinks':
      return (
        <div className="border-t border-[#3c3c3c] pt-2.5 text-[11px]">
          <Field label="Source" value={resource.source} />
        </div>
      )
    default:
      return null
  }
}

export default function ResourceCard({ resource, isFavorite, onToggleFavorite, showChapter = false }) {
  const meta = RESOURCE_TYPE_META[resource.type]
  const Icon = meta.icon
  const launchType = LAUNCH_TYPE_BY_RESOURCE_TYPE[resource.type]
  const canOpen = Boolean(launchType && (resource.url || resource.path))

  return (
    <div className="group flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#4a4a4a] hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
      <div className="flex items-start gap-3">
        <span className="flex h-12 w-10 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]">
          <Icon size={18} strokeWidth={1.5} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[#e8e8e8]">{resource.title}</p>
          <p className="mt-0.5 truncate text-[11px] text-[#858585]">
            {showChapter ? `${resource.subjectName} · ${resource.chapterName}` : meta.label}
          </p>
        </div>
        <FavoriteButton active={isFavorite} onToggle={() => onToggleFavorite(resource.id)} />
      </div>

      <ResourceFields resource={resource} />

      <button
        type="button"
        disabled={!canOpen}
        title={canOpen ? 'Open this resource' : 'Content not added yet'}
        onClick={canOpen ? () => ResourceLauncherService.open({ ...resource, type: launchType }) : undefined}
        className={
          canOpen
            ? 'mt-auto flex items-center justify-center gap-1.5 rounded-md border border-[#0e639c] bg-[#0e639c] py-1.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-[#1177bb]'
            : 'mt-auto flex items-center justify-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] py-1.5 text-xs font-medium text-[#6e6e6e]'
        }
      >
        <ExternalLink size={13} strokeWidth={1.75} />
        Open
      </button>
    </div>
  )
}
