/**
 * BUTTON
 * ======
 * Sprint 0 — Foundation.
 *
 * Reusable button primitive matching the outline/ghost buttons already
 * hand-written across the app (e.g. `components/timer/EndSessionModal.jsx`,
 * `pages/SettingsPage.jsx`). Existing buttons are left as-is this sprint —
 * this is the shared primitive future modules should reach for instead of
 * re-typing the same Tailwind classes again.
 */

const VARIANT_CLASSES = {
  primary: 'border-[#0e639c] bg-[#0e639c] text-white hover:bg-[#1177bb]',
  secondary: 'border-[#3c3c3c] bg-[#2d2d2d] text-[#cccccc] hover:bg-[#3c3c3c]',
  ghost: 'border-transparent bg-transparent text-[#cccccc] hover:bg-[#2d2d2d]',
  danger: 'border-[#f48771]/40 bg-[#f48771]/10 text-[#f48771] hover:bg-[#f48771]/20',
}

export default function Button({
  children,
  variant = 'secondary',
  type = 'button',
  disabled = false,
  onClick,
  className = '',
  ...rest
}) {
  const variantClass = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.secondary

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${variantClass} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
