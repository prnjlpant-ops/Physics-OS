/**
 * CLIPBOARD SERVICE
 * =================
 * Sprint 28 — Desktop Readiness Layer.
 *
 * Single place components call to copy text (Notes, Citations, Topic
 * Names, Resource Paths, ...) instead of calling `navigator.clipboard`
 * directly. Falls back to a hidden-textarea + `execCommand('copy')` trick
 * for insecure contexts / older browsers where the async Clipboard API
 * isn't available, and never throws into the caller.
 */

async function copy(text) {
  if (!text || typeof window === 'undefined') return false

  try {
    if (navigator?.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // Fall through to the legacy fallback below.
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    textarea.style.pointerEvents = 'none'
    document.body.appendChild(textarea)
    textarea.focus()
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}

export const ClipboardService = {
  copy,
}

export default ClipboardService
