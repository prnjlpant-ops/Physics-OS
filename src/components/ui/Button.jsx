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
  primary: 'border border-[var(--border-focus)] bg-[var(--accent)] text-[#0b1120] shadow-[0_0_0_1px_rgba(129,140,248,0.25)] hover:bg-[var(--accent-hover)]',
  secondary: 'border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] backdrop-blur-xl hover:bg-[rgba(24,28,42,0.9)]',
  ghost: 'border-transparent bg-transparent text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.04)]',
  danger: 'border border-[rgba(248,113,113,0.35)] bg-[rgba(248,113,113,0.08)] text-[#fca5a5] hover:bg-[rgba(248,113,113,0.16)]',
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
