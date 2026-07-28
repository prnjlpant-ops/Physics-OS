const PRIORITY_CLASSES = {
  Essential: 'border-[#f48771]/40 bg-[#f48771]/10 text-[#f48771]',
  High: 'border-[#e2c08d]/40 bg-[#e2c08d]/10 text-[#e2c08d]',
  Medium: 'border-[#3c3c3c] bg-[#2d2d2d] text-[#9d9d9d]',
  Reference: 'border-[#4a90d9]/40 bg-[#4a90d9]/10 text-[#4a90d9]',
}

export default function PriorityBadge({ priority }) {
  const classes = PRIORITY_CLASSES[priority] ?? PRIORITY_CLASSES.Medium
  return (
    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${classes}`}>{priority}</span>
  )
}
