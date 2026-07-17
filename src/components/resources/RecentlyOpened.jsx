import { RESOURCE_TYPE_META } from '../../constants/resourceTypes'

export default function RecentlyOpened({ items }) {
  if (items.length === 0) return null

  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {items.map((resource) => {
        const Icon = RESOURCE_TYPE_META[resource.type].icon
        return (
          <div
            key={resource.id}
            className="flex w-56 shrink-0 items-center gap-2.5 rounded-lg border border-[#3c3c3c] bg-[#252526] px-3 py-2.5 transition-colors duration-150 hover:border-[#4a4a4a]"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]">
              <Icon size={15} strokeWidth={1.75} />
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-[#e8e8e8]">{resource.title}</p>
              <p className="truncate text-[10px] text-[#858585]">
                {resource.subjectName} · {resource.chapterName}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
