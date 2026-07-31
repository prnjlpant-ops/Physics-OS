/**
 * IPC HANDLERS
 * ============
 * Sprint 29A — Electron Foundation.
 * Sprint 29B — Native Desktop Integration: wires the File System, Dialog,
 * Resource, and full Workspace channels added in channels.cjs to their
 * now-real services.
 *
 * `safeHandle` is the one place error propagation happens: any thrown
 * error or rejected Promise from a service function is caught and turned
 * into the `IpcFailure` envelope (see types/ipcTypes.cjs) instead of
 * crashing the main process or leaving the renderer's Promise hanging.
 *
 * No renderer code calls these directly — only the preload bridge
 * (preload/preload.cjs) does, via `ipcRenderer.invoke`.
 */

const { ipcMain } = require('electron')
const { CHANNELS } = require('./channels.cjs')
const { ok, fail } = require('../types/ipcTypes.cjs')

const environmentService = require('../services/environmentService.cjs')
const platformService = require('../services/platformService.cjs')
const windowService = require('../services/windowService.cjs')
const clipboardService = require('../services/clipboardService.cjs')
const dialogService = require('../services/dialogService.cjs')
const notificationService = require('../services/notificationService.cjs')
const workspaceService = require('../services/workspaceService.cjs')
const fileSystemService = require('../services/fileSystemService.cjs')
const resourceService = require('../services/resourceService.cjs')

/** Registers one channel, wrapping the handler so it can never throw across the IPC boundary. */
function safeHandle(channel, handler) {
  ipcMain.handle(channel, async (event, ...args) => {
    try {
      const data = await handler(event, ...args)
      return ok(data)
    } catch (error) {
      return fail(error)
    }
  })
}

/**
 * Registers every IPC handler. `getMainWindow` is a function (not the
 * window itself) so handlers always operate on whatever window currently
 * exists, even if it's recreated (e.g. macOS dock-icon reactivation).
 */
function registerIpcHandlers(getMainWindow) {
  safeHandle(CHANNELS.ENVIRONMENT_GET, () => environmentService.getInfo())
  safeHandle(CHANNELS.PLATFORM_GET, () => platformService.detect())

  safeHandle(CHANNELS.WINDOW_MINIMIZE, () => windowService.minimize(getMainWindow()))
  safeHandle(CHANNELS.WINDOW_MAXIMIZE, () => windowService.maximize(getMainWindow()))
  safeHandle(CHANNELS.WINDOW_UNMAXIMIZE, () => windowService.unmaximize(getMainWindow()))
  safeHandle(CHANNELS.WINDOW_CLOSE, () => windowService.close(getMainWindow()))
  safeHandle(CHANNELS.WINDOW_IS_MAXIMIZED, () => windowService.isMaximized(getMainWindow()))
  safeHandle(CHANNELS.WINDOW_RELOAD, () => windowService.reload(getMainWindow()))
  safeHandle(CHANNELS.WINDOW_PRINT, () => windowService.print(getMainWindow()))
  safeHandle(CHANNELS.WINDOW_TOGGLE_FULLSCREEN, () => windowService.toggleFullscreen(getMainWindow()))
  safeHandle(CHANNELS.WINDOW_IS_FULLSCREEN, () => windowService.isFullscreen(getMainWindow()))
  safeHandle(CHANNELS.WINDOW_OPEN_EXTERNAL, (_event, url) => windowService.openExternal(url))
  safeHandle(CHANNELS.WINDOW_OPEN_DEV_TOOLS, () => windowService.openDevTools(getMainWindow()))

  safeHandle(CHANNELS.CLIPBOARD_READ_TEXT, () => clipboardService.readText())
  safeHandle(CHANNELS.CLIPBOARD_WRITE_TEXT, (_event, text) => clipboardService.writeText(text))

  safeHandle(CHANNELS.DIALOG_SHOW, (_event, options) => dialogService.show(getMainWindow(), options))
  safeHandle(CHANNELS.DIALOG_OPEN_FOLDER, (_event, options) => dialogService.openFolder(getMainWindow(), options))
  safeHandle(CHANNELS.DIALOG_OPEN_FILE, (_event, options) => dialogService.openFile(getMainWindow(), options))
  safeHandle(CHANNELS.DIALOG_SAVE_FILE, (_event, options) => dialogService.saveFile(getMainWindow(), options))

  safeHandle(CHANNELS.NOTIFICATION_SHOW, (_event, options) => notificationService.show(options))

  safeHandle(CHANNELS.WORKSPACE_GET_BOUNDS, () => workspaceService.getBounds(getMainWindow()))
  safeHandle(CHANNELS.WORKSPACE_SET_BOUNDS, (_event, bounds) => workspaceService.setBounds(getMainWindow(), bounds))
  safeHandle(CHANNELS.WORKSPACE_GET_STATE, () => workspaceService.getState())
  safeHandle(CHANNELS.WORKSPACE_SET_STATE, (_event, changes) => workspaceService.setState(changes))

  safeHandle(CHANNELS.FS_READ_FILE, (_event, path, encoding) => fileSystemService.readFile(path, encoding))
  safeHandle(CHANNELS.FS_WRITE_FILE, (_event, path, contents, encoding) =>
    fileSystemService.writeFile(path, contents, encoding),
  )
  safeHandle(CHANNELS.FS_EXISTS, (_event, path) => fileSystemService.exists(path))
  safeHandle(CHANNELS.FS_LIST_DIR, (_event, path) => fileSystemService.listDir(path))
  safeHandle(CHANNELS.FS_STAT, (_event, path) => fileSystemService.stat(path))
  safeHandle(CHANNELS.FS_VALIDATE_DIR, (_event, path) => fileSystemService.validateDir(path))

  safeHandle(CHANNELS.RESOURCE_OPEN, (_event, path) => resourceService.open(path))
  safeHandle(CHANNELS.RESOURCE_REVEAL, (_event, path) => resourceService.reveal(path))
}

/** Undoes `registerIpcHandlers` — called on `before-quit` so a relaunch (macOS) never double-registers. */
function unregisterIpcHandlers() {
  Object.values(CHANNELS).forEach((channel) => {
    // MENU_ACTION is a push-only (webContents.send) channel — it was never
    // registered with ipcMain.handle, so removing it would be a no-op that
    // still safely does nothing, but skip it for clarity.
    if (channel === CHANNELS.MENU_ACTION) return
    ipcMain.removeHandler(channel)
  })
}

module.exports = { registerIpcHandlers, unregisterIpcHandlers }
