/**
 * IPC CHANNELS
 * ============
 * Sprint 29A — Electron Foundation.
 * Sprint 29B — Native Desktop Integration: adds File System, Dialog,
 * Resource, Workspace (persisted), and Menu channels. Every channel a
 * Sprint 29A placeholder service already claimed (DIALOG_SHOW,
 * NOTIFICATION_SHOW, WORKSPACE_GET_BOUNDS/SET_BOUNDS) is kept as-is so no
 * existing caller breaks — their handlers just do real work now.
 *
 * The single source of truth for every IPC channel name. Main-process
 * handlers (ipc/handlers.cjs) and the preload bridge (preload/preload.cjs)
 * both require this file so a channel name is never typed twice — renaming
 * or adding a channel only ever happens here.
 *
 * Naming convention: "physicsOS:<domain>:<action>".
 */

const CHANNELS = Object.freeze({
  // Environment / platform detection
  ENVIRONMENT_GET: 'physicsOS:environment:get',
  PLATFORM_GET: 'physicsOS:platform:get',

  // Window lifecycle
  WINDOW_MINIMIZE: 'physicsOS:window:minimize',
  WINDOW_MAXIMIZE: 'physicsOS:window:maximize',
  WINDOW_UNMAXIMIZE: 'physicsOS:window:unmaximize',
  WINDOW_CLOSE: 'physicsOS:window:close',
  WINDOW_IS_MAXIMIZED: 'physicsOS:window:isMaximized',
  WINDOW_RELOAD: 'physicsOS:window:reload',
  WINDOW_PRINT: 'physicsOS:window:print',
  WINDOW_TOGGLE_FULLSCREEN: 'physicsOS:window:toggleFullscreen',
  WINDOW_IS_FULLSCREEN: 'physicsOS:window:isFullscreen',
  WINDOW_OPEN_EXTERNAL: 'physicsOS:window:openExternal',
  WINDOW_OPEN_DEV_TOOLS: 'physicsOS:window:openDevTools',

  // Clipboard
  CLIPBOARD_READ_TEXT: 'physicsOS:clipboard:readText',
  CLIPBOARD_WRITE_TEXT: 'physicsOS:clipboard:writeText',

  // Dialogs (Sprint 29B — real Electron dialogs)
  DIALOG_SHOW: 'physicsOS:dialog:show',
  DIALOG_OPEN_FOLDER: 'physicsOS:dialog:openFolder',
  DIALOG_OPEN_FILE: 'physicsOS:dialog:openFile',
  DIALOG_SAVE_FILE: 'physicsOS:dialog:saveFile',

  // Notifications (Sprint 29B — real native notifications)
  NOTIFICATION_SHOW: 'physicsOS:notification:show',

  // File System (Sprint 29B)
  FS_READ_FILE: 'physicsOS:fs:readFile',
  FS_WRITE_FILE: 'physicsOS:fs:writeFile',
  FS_EXISTS: 'physicsOS:fs:exists',
  FS_LIST_DIR: 'physicsOS:fs:listDir',
  FS_STAT: 'physicsOS:fs:stat',
  FS_VALIDATE_DIR: 'physicsOS:fs:validateDir',

  // Resource launching (Sprint 29B)
  RESOURCE_OPEN: 'physicsOS:resource:open',
  RESOURCE_REVEAL: 'physicsOS:resource:reveal',

  // Workspace — OS-level: window bounds/fullscreen, sidebar collapsed,
  // last-opened files. Persisted to disk (see services/workspaceService.cjs).
  // Not to be confused with the renderer's own `WorkspaceService.js`
  // (current subject/chapter/topic — stored in localStorage).
  WORKSPACE_GET_BOUNDS: 'physicsOS:workspace:getBounds',
  WORKSPACE_SET_BOUNDS: 'physicsOS:workspace:setBounds',
  WORKSPACE_GET_STATE: 'physicsOS:workspace:getState',
  WORKSPACE_SET_STATE: 'physicsOS:workspace:setState',

  // Menu action broadcast — main -> renderer only (webContents.send), not
  // invoked from the renderer, so it has no ipcMain.handle entry.
  MENU_ACTION: 'physicsOS:menu:action',
})

module.exports = { CHANNELS }
