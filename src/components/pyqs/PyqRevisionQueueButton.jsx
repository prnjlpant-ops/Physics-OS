import { ListPlus, ListChecks } from 'lucide-react'

export default function PyqRevisionQueueButton({ active, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={active ? 'Remove from revision queue' : 'Add to revision queue'}
      aria-pressed={active}
      title={active ? 'In revision queue' : 'Add to revision queue'}
      className={[
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors duration-150',
        active
          ? 'border-[#0e639c]/40 bg-[#0e639c]/10 text-[#4fc1ff]'
          : 'border-[#3c3c3c] bg-transparent text-[#858585] hover:border-[#4a4a4a] hover:text-[#cccccc]',
      ].join(' ')}
    >
      {active ? <ListChecks size={14} strokeWidth={1.75} /> : <ListPlus size={14} strokeWidth={1.75} />}
    </button>
  )
}
