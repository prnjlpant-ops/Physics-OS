/**
 * WINDOW SERVICE
 * ==============
 * Sprint 28 — Desktop Readiness Layer.
 *
 * The only place `window.open`, `window.print`, and `window.location` are
 * called directly. Pages/components should call this service instead of
 * touching `window` themselves, so a future Electron implementation only
 * has to replace these functions (real windows, native print, etc.)
 * instead of every call site across the app.
 */

/** Opens an external URL in a new tab. Browser-safe: no-ops on a falsy URL. */
function openExternal(url) {
  if (!url || typeof window === 'undefined') return false
  try {
    window.open(url, '_blank', 'noopener,noreferrer')
    return true
  } catch {
    return false
  }
}

/** Triggers the browser's print dialog. Future Electron implementation replaces this with native printing. */
function print() {
  if (typeof window === 'undefined') return false
  try {
    window.print()
    return true
  } catch {
    return false
  }
}

/** Reloads the current window. */
function reload() {
  if (typeof window === 'undefined') return false
  window.location.reload()
  return true
}

/** Navigates the whole window to an in-app path (full reload — not client-side routing). */
function navigateTo(path) {
  if (!path || typeof window === 'undefined') return false
  window.location.assign(path)
  return true
}

export const WindowService = {
  openExternal,
  print,
  reload,
  navigateTo,
}

export default WindowService
