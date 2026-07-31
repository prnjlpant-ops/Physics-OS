/**
 * WINDOW SERVICE (Electron / main process)
 * ===========================================
 * Sprint 29A — Electron Foundation — minimize/maximize/unmaximize/close/
 * isMaximized only.
 * Sprint 29B — Native Desktop Integration — adds reload, print,
 * fullscreen toggle, "open external URL" (via `shell.openExternal`
 * instead of the renderer's `window.open`), and opening DevTools
 * (development only, enforced here rather than trusting the renderer).
 *
 * Every function takes the window instance explicitly rather than
 * importing one, so this stays a pure, testable module and main.cjs
 * remains the only place that owns `mainWindow`.
 */

const { shell } = require('electron')
const { isDev } = require('../utilities/isDev.cjs')

function minimize(win) {
  win?.minimize()
  return true
}

function maximize(win) {
  win?.maximize()
  return true
}

function unmaximize(win) {
  win?.unmaximize()
  return true
}

function close(win) {
  win?.close()
  return true
}

function isMaximized(win) {
  return Boolean(win?.isMaximized())
}

function reload(win) {
  win?.webContents.reload()
  return true
}

function print(win) {
  win?.webContents.print()
  return true
}

function toggleFullscreen(win) {
  if (!win) return false
  win.setFullScreen(!win.isFullScreen())
  return win.isFullScreen()
}

function isFullscreen(win) {
  return Boolean(win?.isFullScreen())
}

/** Opens a URL in the OS default browser — never inside Physics OS's own BrowserWindow. */
async function openExternal(url) {
  if (!url || typeof url !== 'string') return false
  if (!/^https?:\/\//i.test(url)) {
    throw new Error('Only http(s) links can be opened externally.')
  }
  await shell.openExternal(url)
  return true
}

/** Development-only, regardless of what the renderer asks — matches main.cjs's own dev-only auto-open behavior. */
function openDevTools(win) {
  if (!isDev()) return false
  win?.webContents.openDevTools({ mode: 'detach' })
  return true
}

module.exports = {
  minimize,
  maximize,
  unmaximize,
  close,
  isMaximized,
  reload,
  print,
  toggleFullscreen,
  isFullscreen,
  openExternal,
  openDevTools,
}
