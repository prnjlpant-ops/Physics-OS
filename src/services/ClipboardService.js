import EnvironmentService from './EnvironmentService'

/**
 * CLIPBOARD SERVICE
 * =================
 * Sprint 28 — Desktop Readiness Layer: `navigator.clipboard` /
 * `execCommand` fallback only.
 * Sprint 29B — Native Desktop Integration: prefers Electron's native
 * clipboard (`window.physicsOSDesktop.clipboard`, see
 * electron/services/clipboardService.cjs) when running as a desktop app,
 * since it works regardless of focus/secure-context edge cases the
 * browser Clipboard API has. Falls back to the exact same
 * `navigator.clipboard` / `execCommand` chain otherwise — used for Copy
 * Notes, Copy Citations, Copy Resource Paths, Copy Topic Names.
 */

async function copy(text) {
  if (!text) return false

  if (EnvironmentService.isElectron()) {
    try {
      return await window.physicsOSDesktop.clipboard.writeText(text)
    } catch {
      // Fall through to the browser-style fallback below rather than failing outright.
    }
  }

  if (typeof window === 'undefined') return false

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
