import EnvironmentService from './EnvironmentService'
import SettingsService from './SettingsService'

/**
 * WINDOW SERVICE
 * ==============
 * Sprint 28 — Desktop Readiness Layer: browser-only (`window.open`,
 * `window.print`, `window.location`).
 * Sprint 29B — Native Desktop Integration: in Electron, external links
 * open via `shell.openExternal` (the OS default browser) instead of a new
 * BrowserWindow tab, printing/reload/fullscreen go through the real
 * window instead of the DOM, and minimize/maximize/close are exposed for
 * a future custom title bar. Browser mode keeps its exact original
 * behavior — every function here still degrades safely outside Electron.
 */

/** Opens an external URL. Electron: the OS default browser. Browser: a new tab. No-ops on a falsy URL. */
function openExternal(url) {
  if (!url) return false

  if (EnvironmentService.isElectron()) {
    const browser = SettingsService.getSetting('preferredBrowser')
    const opener = window.physicsOSDesktop.window.openExternalWithBrowser ?? window.physicsOSDesktop.window.openExternal
    opener(url, browser).catch(() => {
      // Falls back to the browser-style new tab below rather than losing the click entirely.
      if (typeof window !== 'undefined') window.open(url, '_blank', 'noopener,noreferrer')
    })
    return true
  }

  if (typeof window === 'undefined') return false
  try {
    window.open(url, '_blank', 'noopener,noreferrer')
    return true
  } catch {
    return false
  }
}

/** Triggers printing. Electron: native `webContents.print()`. Browser: the browser's print dialog. */
function print() {
  if (EnvironmentService.isElectron()) {
    window.physicsOSDesktop.window.print().catch(() => {})
    return true
  }
  if (typeof window === 'undefined') return false
  try {
    window.print()
    return true
  } catch {
    return false
  }
}

/** Reloads the current window. Electron: reloads the BrowserWindow's contents. Browser: a full page reload. */
function reload() {
  if (EnvironmentService.isElectron()) {
    window.physicsOSDesktop.window.reload().catch(() => {})
    return true
  }
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

/** Toggles fullscreen. Electron only — Browser mode has the Fullscreen API instead, used by pages directly (e.g. active recall study mode). Resolves the new state. */
function toggleFullscreen() {
  if (!EnvironmentService.isElectron()) return Promise.resolve(false)
  return window.physicsOSDesktop.window.toggleFullscreen()
}

function minimize() {
  if (!EnvironmentService.isElectron()) return false
  window.physicsOSDesktop.window.minimize().catch(() => {})
  return true
}

function maximize() {
  if (!EnvironmentService.isElectron()) return false
  window.physicsOSDesktop.window.maximize().catch(() => {})
  return true
}

function close() {
  if (!EnvironmentService.isElectron()) return false
  window.physicsOSDesktop.window.close().catch(() => {})
  return true
}

export const WindowService = {
  openExternal,
  print,
  reload,
  navigateTo,
  toggleFullscreen,
  minimize,
  maximize,
  close,
}

export default WindowService
