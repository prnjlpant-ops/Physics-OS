/**
 * INPUT
 * =====
 * Sprint 0 — Foundation.
 *
 * Reusable text input matching the dark-themed inputs already
 * hand-written across the app (e.g. `components/timer/EndSessionModal.jsx`
 * textarea styling). Supports an optional label, following the
 * `<label><span>...</span><input/></label>` pattern already in use.
 */
export default function Input({ label, className = '', id, ...rest }) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  const input = (
    <input
      id={inputId}
      className={`rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-sm text-[#e8e8e8] outline-none transition-colors duration-150 focus:border-[#0e639c] ${className}`}
      {...rest}
    />
  )

  if (!label) return input

  return (
    <label htmlFor={inputId} className="flex flex-col gap-1.5">
      <span className="text-xs font-medium uppercase tracking-wide text-[#858585]">{label}</span>
      {input}
    </label>
  )
}
