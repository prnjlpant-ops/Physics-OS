export default function GoalSelectRow({ label, description, value, onChange, options, formatOption }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-[#3c3c3c] bg-[#252526] p-3.5">
      <div className="min-w-0">
        <p className="text-sm font-medium text-[#e8e8e8]">{label}</p>
        {description && <p className="mt-0.5 text-xs text-[#858585]">{description}</p>}
      </div>
      <select
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={label}
        className="shrink-0 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-1.5 text-xs text-[#cccccc] transition-colors duration-150 hover:border-[#4a4a4a] focus:border-[#0e639c] focus:outline-none"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {formatOption ? formatOption(option) : option}
          </option>
        ))}
      </select>
    </div>
  )
}
