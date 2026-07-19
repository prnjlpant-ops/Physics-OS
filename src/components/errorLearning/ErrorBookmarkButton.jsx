import { Bookmark } from 'lucide-react'

export default function ErrorBookmarkButton({ active, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={active ? 'Remove bookmark' : 'Bookmark this error'}
      aria-pressed={active}
      className={[
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors duration-150',
        active
          ? 'border-[#e2c08d]/40 bg-[#e2c08d]/10 text-[#e2c08d]'
          : 'border-[#3c3c3c] bg-transparent text-[#858585] hover:border-[#4a4a4a] hover:text-[#cccccc]',
      ].join(' ')}
    >
      <Bookmark size={14} strokeWidth={1.75} fill={active ? 'currentColor' : 'none'} />
    </button>
  )
}
