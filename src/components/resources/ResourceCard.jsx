import { useState } from 'react'
import { ChevronDown, ExternalLink } from 'lucide-react'
import FavoriteButton from './FavoriteButton'
import { RESOURCE_TYPE_META } from '../../constants/resourceTypes'
import ResourceLauncherService, { LAUNCHABLE_RESOURCE_TYPES } from '../../services/ResourceLauncherService'

const LAUNCH_TYPE_BY_RESOURCE_TYPE = { books: LAUNCHABLE_RESOURCE_TYPES.BOOK, videos: LAUNCHABLE_RESOURCE_TYPES.VIDEO }

export default function ResourceCard({ resource, isFavorite, onToggleFavorite, showChapter = false }) {
  const [expanded, setExpanded] = useState(false)
  const meta = RESOURCE_TYPE_META[resource.type] ?? RESOURCE_TYPE_META.books
  const Icon = meta.icon
  const launchType = LAUNCH_TYPE_BY_RESOURCE_TYPE[resource.type]
  const canOpen = Boolean(launchType && (resource.url || resource.path))
  const fields = resource.type === 'books'
    ? [['Author', resource.author || 'Add details'], ['Pages', resource.pages ?? 'Add details'], ['Status', resource.status || 'Add details']]
    : [['Source', resource.source || resource.author || 'Add details'], ...(resource.duration ? [['Duration', resource.duration]] : []), ['Status', resource.status || 'Add details']]

  return <article className="group flex min-h-56 flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-4 transition-all duration-150 hover:border-[#4a4a4a] hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
    <div className="flex items-start gap-3">
      <span className="flex h-12 w-10 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]"><Icon size={18} strokeWidth={1.5} /></span>
      <div className="min-w-0 flex-1"><p className="text-sm font-medium text-[#e8e8e8]">{resource.title}</p><p className="mt-0.5 text-[11px] text-[#858585]">{showChapter && resource.subjectName && resource.chapterName ? `${resource.subjectName} · ${resource.chapterName}` : meta.label}</p></div>
      {onToggleFavorite && <FavoriteButton active={isFavorite} onToggle={() => onToggleFavorite(resource.id)} />}
    </div>
    <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-[#3c3c3c] pt-2.5 text-[11px]">
      {fields.map(([label, value]) => <div key={label}><p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">{label}</p><p className="mt-0.5 text-[#cccccc]">{value}</p></div>)}
    </div>
    {expanded && <div className="border-t border-[#3c3c3c] pt-2.5 text-xs leading-relaxed text-[#9d9d9d]">
      {resource.description && <p><span className="font-medium text-[#cccccc]">Study details: </span>{resource.description}</p>}
      {resource.syllabus && <p className="mt-2"><span className="font-medium text-[#cccccc]">JEST syllabus coverage: </span>{resource.syllabus}</p>}
      <p className="mt-2"><span className="font-medium text-[#cccccc]">Used in: </span>{resource.usedIn?.length ? resource.usedIn.map((topic) => topic.name ?? topic).join(', ') : 'Not yet linked to a topic'}</p>
      {resource.type === 'books' && (!resource.author || resource.pages == null) && <p className="mt-2 text-[#e2c08d]">Add details: {!resource.author ? 'author' : ''}{!resource.author && resource.pages == null ? ' and ' : ''}{resource.pages == null ? 'page count' : ''}.</p>}
    </div>}
    <button type="button" onClick={() => setExpanded((value) => !value)} className="flex items-center gap-1 self-start text-xs text-[#9d9d9d] hover:text-[#cccccc]"><ChevronDown size={14} className={expanded ? 'rotate-180' : ''} />{expanded ? 'Show less' : 'Study details & metadata'}</button>
    <button type="button" disabled={!canOpen} title={canOpen ? 'Open this resource' : 'No file or link is configured yet'} onClick={canOpen ? () => ResourceLauncherService.open({ ...resource, type: launchType }) : undefined} className={canOpen ? 'mt-auto flex items-center justify-center gap-1.5 rounded-md border border-[#0e639c] bg-[#0e639c] py-1.5 text-xs font-medium text-white hover:bg-[#1177bb]' : 'mt-auto flex items-center justify-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] py-1.5 text-xs font-medium text-[#6e6e6e]'}><ExternalLink size={13} />Open</button>
  </article>
}
