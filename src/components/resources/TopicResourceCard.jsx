import { ExternalLink } from 'lucide-react'
import { RESOURCE_TYPE_META } from '../../constants/resourceTypes'

const PRIORITY_STYLES = {
  High: 'border-[#f48771]/30 bg-[#f48771]/10 text-[#f48771]',
  Medium: 'border-[#e2c08d]/30 bg-[#e2c08d]/10 text-[#e2c08d]',
  Low: 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585]',
}

function Field({ label, value }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wide text-[#6e6e6e]">{label}</p>
      <p className="mt-0.5 truncate text-[#cccccc]">{value}</p>
    </div>
  )
}

/**
 * TopicResourceCard — Sprint 18A.
 * ================================
 * Every Topic's resource sections use this card instead of the general
 * `ResourceCard` (which intentionally varies its fields by resource type
 * for the main Resources module). Per the Sprint 18A brief, a Topic-level
 * resource card always shows the same seven things, regardless of type:
 * Title, Author, Resource Type, Pages, Status, Priority, Open.
 */
export default function TopicResourceCard({ resource }) {
  const meta = RESOURCE_TYPE_META[resource.resourceType]
  const Icon = meta.icon

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#1e1e1e] p-3.5 transition-colors duration-150 hover:border-[#4a4a4a]">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-9 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]">
          <Icon size={16} strokeWidth={1.5} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-[#e8e8e8]">{resource.title}</p>
          <p className="mt-0.5 truncate text-[10px] text-[#858585]">{resource.author}</p>
        </div>
        <span
          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-medium ${
            PRIORITY_STYLES[resource.priority] ?? PRIORITY_STYLES.Low
          }`}
        >
          {resource.priority}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-x-3 gap-y-1.5 border-t border-[#3c3c3c] pt-2.5 text-[11px]">
        <Field label="Type" value={resource.resourceTypeLabel} />
        <Field label="Pages" value={resource.pages} />
        <Field label="Status" value={resource.status} />
      </div>

      <button
        type="button"
        disabled
        title="Content not added yet"
        className="mt-auto flex items-center justify-center gap-1.5 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] py-1.5 text-xs font-medium text-[#6e6e6e]"
      >
        <ExternalLink size={13} strokeWidth={1.75} />
        Open
      </button>
    </div>
  )
}
