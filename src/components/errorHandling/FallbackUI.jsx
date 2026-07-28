import { AlertTriangle, RotateCcw } from 'lucide-react'

/**
 * FALLBACK UI
 * ===========
 * Sprint 0 — Foundation.
 *
 * The default screen shown by `ErrorBoundary` when a render error is
 * caught. Kept visually consistent with the rest of the app (VS Code
 * inspired dark theme, same empty-state pattern used elsewhere) instead of
 * a raw browser error page.
 */
export default function FallbackUI({ onReset }) {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-[#1e1e1e] px-6 text-center">
      <div className="rounded-full border border-[#3c3c3c] bg-[#252526] p-4">
        <AlertTriangle size={28} className="text-[#f48771]" />
      </div>
      <div>
        <h1 className="text-lg font-medium text-[#e8e8e8]">Something went wrong</h1>
        <p className="mt-1 max-w-sm text-sm text-[#9d9d9d]">
          Physics OS ran into an unexpected error. Your locally saved study data is
          unaffected. Try reloading this section.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-2 rounded-md border border-[#3c3c3c] bg-[#2d2d2d] px-4 py-2 text-sm text-[#cccccc] transition-colors hover:bg-[#3c3c3c]"
      >
        <RotateCcw size={14} />
        Reload
      </button>
    </div>
  )
}
