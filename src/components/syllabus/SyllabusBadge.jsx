export default function SyllabusBadge({ label, styleClass }) {
  return (
    <span
      className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${styleClass ?? 'border-[#3c3c3c] bg-[#3c3c3c]/40 text-[#858585]'}`}
    >
      {label}
    </span>
  )
}
