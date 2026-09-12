/**
 * MAIN PROCESS
 * ============
 * Sprint 29A — Electron Foundation: single BrowserWindow, no menu, no
 * dialogs/notifications, no window-state persistence.
 * Sprint 29B — Native Desktop Integration: installs the application menu,
 * restores the window's last size/position/maximized/fullscreen state on
 * launch and persists it on resize/move/close (see
 * electron/services/workspaceService.cjs).
 */

const path = require('node:path')
const { app, BrowserWindow, shell } = require('electron')
const { isDev } = require('../utilities/isDev.cjs')
const { DEV_SERVER_URL, getPreloadPath, getProdIndexPath } = require('../utilities/paths.cjs')
const { registerIpcHandlers, unregisterIpcHandlers } = require('../ipc/handlers.cjs')
const { installMenu } = require('./menu.cjs')
const workspaceService = require('../services/workspaceService.cjs')

/** @type {import('electron').BrowserWindow | null} */
let mainWindow = null

function getMainWindow() {
  return mainWindow
}

/** Debounces workspace persistence so a window drag/resize doesn't write to disk on every pixel. */
function debounce(fn, waitMs) {
  let timeout = null
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), waitMs)
  }
}

function createWindow() {
  const savedState = workspaceService.getState()
  const savedBounds = savedState.bounds

  mainWindow = new BrowserWindow({
    width: savedBounds?.width ?? 1280,
    height: savedBounds?.height ?? 800,
    x: savedBounds?.x,
    y: savedBounds?.y,
    minWidth: 1100,
    minHeight: 720,
    // Matches the app's dark theme so there's no white flash before React mounts.
    backgroundColor: '#0a0b10',
    show: false,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false, // see preload.cjs's header comment for why
    },
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:') || url.startsWith('zotero:')) {
      shell.openExternal(url)
      return { action: 'deny' }
    }
    return { action: 'allow' }
  })

  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      event.preventDefault()
      shell.openExternal(url)
    }
  })

  installMenu(getMainWindow)

  mainWindow.once('ready-to-show', () => {
    if (savedState.isMaximized) mainWindow?.maximize()
    if (savedState.isFullscreen) mainWindow?.setFullScreen(true)
    mainWindow?.show()
  })

  if (isDev()) {
    mainWindow.loadURL(`${DEV_SERVER_URL}#/`)
    mainWindow.webContents.openDevTools({ mode: 'detach' })
  } else {
    const prodIndexPath = path.join(__dirname, '..', '..', 'dist', 'index.html')
    mainWindow.loadFile(prodIndexPath, { hash: '/' })
  }

  const persistWindowState = debounce(() => workspaceService.captureWindow(mainWindow), 500)
  mainWindow.on('resize', persistWindowState)
  mainWindow.on('move', persistWindowState)
  mainWindow.on('maximize', persistWindowState)
  mainWindow.on('unmaximize', persistWindowState)
  mainWindow.on('enter-full-screen', persistWindowState)
  mainWindow.on('leave-full-screen', persistWindowState)

  mainWindow.webContents.on('did-fail-load', (_event, code, description) => {
    console.error(`[Physics OS] Renderer failed to load (${code}): ${description}`)
  })

  mainWindow.webContents.on('render-process-gone', (_event, details) => {
    console.error('[Physics OS] Renderer process gone:', details.reason)
  })

  mainWindow.on('unresponsive', () => {
    console.error('[Physics OS] Renderer became unresponsive.')
  })

  mainWindow.on('close', () => {
    // Final, non-debounced save so a quit mid-drag isn't lost.
    if (mainWindow) workspaceService.captureWindow(mainWindow)
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app
  .whenReady()
  .then(() => {
    registerIpcHandlers(getMainWindow)
    createWindow()

    // macOS convention: clicking the dock icon with no windows open should
    // recreate one rather than requiring the user to relaunch the app.
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
  .catch((error) => {
    console.error('[Physics OS] Failed to start:', error)
    app.quit()
  })

app.on('window-all-closed', () => {
  // Windows/Linux convention: quit when the last window closes.
  // macOS convention: stay running until the user quits explicitly (Cmd+Q).
  if (process.platform !== 'darwin') app.quit()
})

app.on('before-quit', () => {
  unregisterIpcHandlers()
})

process.on('uncaughtException', (error) => {
  console.error('[Physics OS] Uncaught exception in main process:', error)
})
