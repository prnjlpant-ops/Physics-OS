/**
 * MODAL
 * =====
 * Sprint 0 — Foundation.
 *
 * Reusable modal/dialog shell matching the overlay pattern already
 * hand-written in `components/timer/EndSessionModal.jsx`. That existing
 * modal is left as-is this sprint; future modals should use this instead
 * of re-implementing the overlay + panel markup.
 */
export default function Modal({ open, onClose, title, description, children, className = '' }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <div
        className={`relative flex max-h-full w-full max-w-lg flex-col overflow-y-auto rounded-lg border border-[#3c3c3c] bg-[#252526] p-6 shadow-2xl transition-all duration-150 ${className}`}
      >
        {title && <h2 className="text-lg font-semibold text-[#e8e8e8]">{title}</h2>}
        {description && <p className="mt-1 text-sm text-[#858585]">{description}</p>}
        {children}
      </div>
    </div>
  )
}
