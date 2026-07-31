/**
 * WORKSPACE SERVICE (Electron / main process)
 * ==============================================
 * Sprint 29A — Electron Foundation — `getBounds`/`setBounds` only,
 * nothing persisted.
 * Sprint 29B — Native Desktop Integration — adds disk persistence
 * (`app.getPath('userData')/workspace.json`) and the full OS-level
 * workspace: window bounds, maximized/fullscreen flags, sidebar collapsed
 * state, and last-opened files. Restored by `main.cjs` on startup and
 * saved on resize/move/close.
 *
 * Not to be confused with the renderer's `WorkspaceService.js` (current
 * subject/chapter/topic/resource — persisted in localStorage, a separate,
 * app-level concept). This one is purely about the native window/shell.
 */

const fs = require('fs')
const path = require('path')
const { app } = require('electron')

function getStorePath() {
  return path.join(app.getPath('userData'), 'workspace.json')
}

const DEFAULT_STATE = {
  bounds: null, // { x, y, width, height } — null means "use main.cjs's default size"
  isMaximized: false,
  isFullscreen: false,
  sidebarCollapsed: false,
  lastOpenedFiles: [],
}

/** Reads the persisted workspace file. Never throws — a missing/corrupt file just means "first launch". */
function readState() {
  try {
    const raw = fs.readFileSync(getStorePath(), 'utf-8')
    const parsed = JSON.parse(raw)
    return { ...DEFAULT_STATE, ...(parsed && typeof parsed === 'object' ? parsed : {}) }
  } catch {
    return { ...DEFAULT_STATE }
  }
}

/** Writes the workspace file. Never throws into the caller — losing this write only costs one restore-on-next-launch. */
function writeState(state) {
  try {
    fs.mkdirSync(path.dirname(getStorePath()), { recursive: true })
    fs.writeFileSync(getStorePath(), JSON.stringify(state, null, 2), 'utf-8')
    return true
  } catch (error) {
    console.error('[Physics OS] Failed to persist workspace state:', error)
    return false
  }
}

function getState() {
  return readState()
}

function setState(changes) {
  const next = { ...readState(), ...(changes && typeof changes === 'object' ? changes : {}) }
  writeState(next)
  return next
}

/** Captures a window's current bounds/maximized/fullscreen into the persisted state. Call before quitting. */
function captureWindow(win) {
  if (!win || win.isDestroyed()) return readState()
  const isMaximized = win.isMaximized()
  const isFullscreen = win.isFullScreen()
  // getBounds() while maximized/fullscreen returns the maximized size, not
  // the restorable one — skip saving bounds in that case so relaunching
  // un-maximized restores the last *normal* size instead of the full screen.
  const bounds = isMaximized || isFullscreen ? readState().bounds : win.getBounds()
  return setState({ bounds, isMaximized, isFullscreen })
}

// --- Foundation-level (Sprint 29A) API kept for backward compatibility ---

function getBounds(win) {
  if (!win) return null
  return win.getBounds()
}

function setBounds(win, bounds) {
  if (!win || !bounds) return false
  win.setBounds(bounds)
  return true
}

module.exports = { getState, setState, captureWindow, getBounds, setBounds, DEFAULT_STATE }
