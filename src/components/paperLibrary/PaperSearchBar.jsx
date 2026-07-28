import { Search } from 'lucide-react'

export default function PaperSearchBar({ value, onChange, placeholder = 'Search by exam, year, or subject...' }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 transition-colors duration-150 focus-within:border-[#0e639c]">
      <Search size={15} strokeWidth={1.75} className="shrink-0 text-[#858585]" />
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-[#e8e8e8] placeholder:text-[#6e6e6e] focus:outline-none"
      />
    </div>
  )
}
