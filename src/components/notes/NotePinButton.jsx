import { Pin } from 'lucide-react'

export default function NotePinButton({ active, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={active ? 'Unpin note' : 'Pin note'}
      aria-pressed={active}
      className={[
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors duration-150',
        active
          ? 'border-[#0e639c]/40 bg-[#0e639c]/10 text-[#4fc1ff]'
          : 'border-[#3c3c3c] bg-transparent text-[#858585] hover:border-[#4a4a4a] hover:text-[#cccccc]',
      ].join(' ')}
    >
      <Pin size={14} strokeWidth={1.75} fill={active ? 'currentColor' : 'none'} />
    </button>
  )
}
