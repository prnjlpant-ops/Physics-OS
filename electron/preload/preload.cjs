/**
 * PRELOAD
 * =======
 * Sprint 29A — Electron Foundation.
 * Sprint 29B — Native Desktop Integration: exposes File System, Dialog,
 * Resource, full Workspace, and Menu-action APIs alongside the Sprint 29A
 * surface. Still the only file allowed to see both `electron`'s
 * `ipcRenderer` and the renderer's `window` object — everything below
 * still goes through the same `invoke()` envelope-unwrapper.
 *
 * `src/services/EnvironmentService.js` detects Electron by checking
 * `typeof window.physicsOSDesktop !== 'undefined'` — this file is what
 * makes that check start returning true.
 *
 * Security posture: contextIsolation is ON, nodeIntegration is OFF (see
 * electron/main/main.cjs). `sandbox` is deliberately left OFF for this
 * preload so it can `require()` the shared `channels.cjs`/`ipcTypes.cjs`
 * modules directly.
 */

const { contextBridge, ipcRenderer } = require('electron')
const { CHANNELS } = require('../ipc/channels.cjs')

/** Invokes a channel and unwraps the IpcResponse envelope, turning a failure into a rejected Promise. */
function invoke(channel, ...args) {
  return ipcRenderer.invoke(channel, ...args).then((response) => {
    if (!response || response.success !== true) {
      throw new Error(response?.error || `IPC call to "${channel}" failed.`)
    }
    return response.data
  })
}

// Best-effort synchronous flag so EnvironmentService's synchronous
// `detect()` has something reasonable to report immediately on boot.
// `environmentInfo()` below is the authoritative, IPC-verified source.
const isDev = process.env.NODE_ENV === 'development'

contextBridge.exposeInMainWorld('physicsOSDesktop', {
  ready: true,
  environment: 'electron',
  isDev,
  platform: process.platform,
  versions: {
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node,
  },

  environmentInfo: () => invoke(CHANNELS.ENVIRONMENT_GET),
  platformInfo: () => invoke(CHANNELS.PLATFORM_GET),

  window: {
    minimize: () => invoke(CHANNELS.WINDOW_MINIMIZE),
    maximize: () => invoke(CHANNELS.WINDOW_MAXIMIZE),
    unmaximize: () => invoke(CHANNELS.WINDOW_UNMAXIMIZE),
    close: () => invoke(CHANNELS.WINDOW_CLOSE),
    isMaximized: () => invoke(CHANNELS.WINDOW_IS_MAXIMIZED),
    reload: () => invoke(CHANNELS.WINDOW_RELOAD),
    print: () => invoke(CHANNELS.WINDOW_PRINT),
    toggleFullscreen: () => invoke(CHANNELS.WINDOW_TOGGLE_FULLSCREEN),
    isFullscreen: () => invoke(CHANNELS.WINDOW_IS_FULLSCREEN),
    openExternal: (url) => invoke(CHANNELS.WINDOW_OPEN_EXTERNAL, url),
    openDevTools: () => invoke(CHANNELS.WINDOW_OPEN_DEV_TOOLS),
  },

  clipboard: {
    readText: () => invoke(CHANNELS.CLIPBOARD_READ_TEXT),
    writeText: (text) => invoke(CHANNELS.CLIPBOARD_WRITE_TEXT, text),
  },

  dialog: {
    show: (options) => invoke(CHANNELS.DIALOG_SHOW, options),
    openFolder: (options) => invoke(CHANNELS.DIALOG_OPEN_FOLDER, options),
    openFile: (options) => invoke(CHANNELS.DIALOG_OPEN_FILE, options),
    saveFile: (options) => invoke(CHANNELS.DIALOG_SAVE_FILE, options),
  },

  notification: {
    show: (options) => invoke(CHANNELS.NOTIFICATION_SHOW, options),
  },

  fileSystem: {
    readFile: (path, encoding) => invoke(CHANNELS.FS_READ_FILE, path, encoding),
    writeFile: (path, contents, encoding) => invoke(CHANNELS.FS_WRITE_FILE, path, contents, encoding),
    exists: (path) => invoke(CHANNELS.FS_EXISTS, path),
    listDir: (path) => invoke(CHANNELS.FS_LIST_DIR, path),
    stat: (path) => invoke(CHANNELS.FS_STAT, path),
    validateDir: (path) => invoke(CHANNELS.FS_VALIDATE_DIR, path),
  },

  resource: {
    open: (path) => invoke(CHANNELS.RESOURCE_OPEN, path),
    reveal: (path) => invoke(CHANNELS.RESOURCE_REVEAL, path),
  },

  workspace: {
    getBounds: () => invoke(CHANNELS.WORKSPACE_GET_BOUNDS),
    setBounds: (bounds) => invoke(CHANNELS.WORKSPACE_SET_BOUNDS, bounds),
    getState: () => invoke(CHANNELS.WORKSPACE_GET_STATE),
    setState: (changes) => invoke(CHANNELS.WORKSPACE_SET_STATE, changes),
  },

  // Application menu -> renderer action broadcast (see electron/main/menu.cjs).
  // Returns an unsubscribe function, matching the pattern every renderer
  // pub-sub service (NotificationService.subscribe, DialogService.subscribe)
  // already uses.
  menu: {
    onAction: (callback) => {
      const handler = (_event, payload) => callback(payload)
      ipcRenderer.on(CHANNELS.MENU_ACTION, handler)
      return () => ipcRenderer.removeListener(CHANNELS.MENU_ACTION, handler)
    },
  },
})
