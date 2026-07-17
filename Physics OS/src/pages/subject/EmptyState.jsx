export default function EmptyState({ icon: Icon, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#3c3c3c] bg-[#252526] px-6 py-12 text-center transition-colors duration-150">
      <span className="flex h-11 w-11 items-center justify-center rounded-md border border-[#3c3c3c] bg-[#2d2d2d] text-[#858585]">
        <Icon size={20} strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-sm font-medium text-[#cccccc]">{title}</p>
        {description && (
          <p className="mt-1 text-xs text-[#858585]">{description}</p>
        )}
      </div>
    </div>
  )
}
