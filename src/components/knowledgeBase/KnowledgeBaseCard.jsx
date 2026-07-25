import { FolderOpen } from 'lucide-react'
import { RESOURCE_STATUS } from '../../constants/masterIndexConstants'

const STATUS_STYLES = {
  [RESOURCE_STATUS.NOT_ADDED]: 'border-[#4a4a4a] bg-[#2d2d2d] text-[#858585]',
  [RESOURCE_STATUS.PENDING]: 'border-[#5a4a3c] bg-[#2b241e] text-[#d2b48c]',
  [RESOURCE_STATUS.IN_PROGRESS]: 'border-[#3c4a5a] bg-[#1e2530] text-[#8fb3d9]',
  [RESOURCE_STATUS.COMPLETED]: 'border-[#3c5a3c] bg-[#1e2b1e] text-[#8fbc8f]',
}

function StatusPill({ status }) {
  return (
    <span
      className={[
        'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium',
        STATUS_STYLES[status] ?? STATUS_STYLES[RESOURCE_STATUS.NOT_ADDED],
      ].join(' ')}
    >
      {status}
    </span>
  )
}

function Field({ label, value }) {
  if (!value) return null
  return (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">{label}</p>
      <p className="mt-0.5 truncate text-[11px] text-[#9d9d9d]">{value}</p>
    </div>
  )
}

export default function KnowledgeBaseCard({ resource, icon: Icon }) {
  const hasPath = Boolean(resource.localPath)
  const hasMeta = resource.author || resource.edition || resource.priority
  const hasTags = Array.isArray(resource.tags) && resource.tags.length > 0

  return (
    <div className="group flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#4a4a4a] hover:shadow-[0_4px_16px_rgba(0,0,0,0.35)]">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]">
          <Icon size={17} strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-[#e8e8e8]">{resource.title}</p>
          <p className="mt-0.5 truncate text-[11px] text-[#858585]">{resource.category}</p>
        </div>
        <StatusPill status={resource.status} />
      </div>

      {hasMeta && (
        <div className="grid grid-cols-3 gap-x-3 gap-y-1.5 border-t border-[#3c3c3c] pt-2.5">
          <Field label="Author" value={resource.author} />
          <Field label="Edition" value={resource.edition} />
          <Field label="Priority" value={resource.priority} />
        </div>
      )}

      {hasTags && (
        <div className="flex flex-wrap gap-1">
          {resource.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#3c3c3c] bg-[#2d2d2d] px-2 py-0.5 text-[10px] text-[#858585]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="border-t border-[#3c3c3c] pt-2.5">
        <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">Local Path</p>
        <p
          className={[
            'mt-0.5 truncate font-mono text-[11px]',
            hasPath ? 'text-[#9d9d9d]' : 'text-[#6e6e6e] italic',
          ].join(' ')}
          title={resource.localPath ?? undefined}
        >
          {resource.localPath ?? 'Not Added'}
        </p>
      </div>

      <button
        type="button"
        disabled={!hasPath}
        title={
          hasPath
            ? 'Local file opening not yet implemented'
            : 'No local path set for this resource yet'
        }
        className={[
          'mt-auto flex items-center justify-center gap-1.5 rounded-md border py-1.5 text-xs font-medium transition-colors duration-150',
          hasPath
            ? 'border-[#3c3c3c] bg-[#2d2d2d] text-[#9d9d9d] hover:border-[#4a4a4a] hover:text-[#cccccc]'
            : 'border-[#3c3c3c] bg-[#2d2d2d] text-[#6e6e6e]',
        ].join(' ')}
      >
        <FolderOpen size={13} strokeWidth={1.75} />
        Open
      </button>
    </div>
  )
}
