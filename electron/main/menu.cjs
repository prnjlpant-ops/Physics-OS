/**
 * APPLICATION MENU
 * ================
 * Sprint 29B — Native Desktop Integration.
 *
 * Builds the desktop menu bar (File / Edit / View / Study / Window /
 * Help). Where Electron already has the right built-in behavior (Copy,
 * Paste, Undo, Select All, Minimize, Close, Reload, Toggle Fullscreen,
 * Toggle DevTools) this uses a `role` instead of writing that logic
 * again — that's also what gives every accelerator the correct
 * platform-appropriate form (Cmd on macOS, Ctrl elsewhere) for free.
 *
 * Actions with no built-in role (Open Knowledge Base, Search, New Study
 * Session, Save/Export, Import) are connected to existing services
 * through the IPC channels already wired in ipc/handlers.cjs, then
 * broadcast to the renderer via `physicsOS:menu:action` — the renderer
 * owns the actual behavior (navigation, opening the export/import flow)
 * exactly the way `ResourceLauncherService`/`ExportService`/etc. already
 * work, so no renderer service needs an Electron-only code path added
 * just to react to a menu click.
 */

const { app, Menu, dialog } = require('electron')
const { isDev } = require('../utilities/isDev.cjs')
const { CHANNELS } = require('../ipc/channels.cjs')
const dialogService = require('../services/dialogService.cjs')
const windowService = require('../services/windowService.cjs')

/** Sends a menu action to the renderer. The renderer decides what each action means. */
function sendAction(win, action, payload) {
  if (!win || win.isDestroyed()) return
  win.webContents.send(CHANNELS.MENU_ACTION, { action, payload: payload ?? null })
}

function buildTemplate(getMainWindow) {
  const isMac = process.platform === 'darwin'

  const appMenu = isMac
    ? [
        {
          label: app.getName(),
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
          ],
        },
      ]
    : []

  const fileMenu = {
    label: 'File',
    submenu: [
      {
        label: 'Open Knowledge Base…',
        accelerator: 'CmdOrCtrl+O',
        click: async () => {
          const win = getMainWindow()
          const result = await dialogService.openFolder(win, { title: 'Choose your Knowledge Base folder' })
          if (!result.canceled) sendAction(win, 'openKnowledgeBaseFolder', { path: result.path })
        },
      },
      { type: 'separator' },
      {
        label: 'Save / Export Data…',
        accelerator: 'CmdOrCtrl+S',
        click: () => sendAction(getMainWindow(), 'export'),
      },
      {
        label: 'Import Data…',
        accelerator: 'CmdOrCtrl+Shift+I',
        click: () => sendAction(getMainWindow(), 'import'),
      },
      { type: 'separator' },
      {
        label: 'Print…',
        accelerator: 'CmdOrCtrl+P',
        click: () => windowService.print(getMainWindow()),
      },
      { type: 'separator' },
      isMac ? { role: 'close' } : { role: 'quit' },
    ],
  }

  const editMenu = {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'selectAll' },
    ],
  }

  const viewMenu = {
    label: 'View',
    submenu: [
      {
        label: 'Search',
        accelerator: 'CmdOrCtrl+F',
        click: () => sendAction(getMainWindow(), 'search'),
      },
      { type: 'separator' },
      { role: 'reload' },
      { role: 'forceReload' },
      ...(isDev() ? [{ role: 'toggleDevTools' }] : []),
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' },
    ],
  }

  const studyMenu = {
    label: 'Study',
    submenu: [
      {
        label: 'New Study Session',
        accelerator: 'CmdOrCtrl+N',
        click: () => sendAction(getMainWindow(), 'newStudySession'),
      },
      {
        label: "Today's Mission",
        click: () => sendAction(getMainWindow(), 'todaysMission'),
      },
      {
        label: 'Resources',
        click: () => sendAction(getMainWindow(), 'search'),
      },
    ],
  }

  const windowMenu = {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      ...(isMac ? [{ role: 'zoom' }, { type: 'separator' }, { role: 'front' }] : [{ role: 'close' }]),
    ],
  }

  const helpMenu = {
    label: 'Help',
    submenu: [
      {
        label: `Physics OS v${app.getVersion()}`,
        enabled: false,
      },
      {
        label: 'About Physics OS',
        click: () =>
          dialog.showMessageBox(getMainWindow() ?? undefined, {
            type: 'info',
            title: 'About Physics OS',
            message: 'Physics OS',
            detail: `Version ${app.getVersion()}\nA personal, offline-first study operating system.`,
          }),
      },
    ],
  }

  return [...appMenu, fileMenu, editMenu, viewMenu, studyMenu, windowMenu, helpMenu]
}

/** Builds and installs the application menu. Call once, after the main window exists. */
function installMenu(getMainWindow) {
  const menu = Menu.buildFromTemplate(buildTemplate(getMainWindow))
  Menu.setApplicationMenu(menu)
}

module.exports = { installMenu }
