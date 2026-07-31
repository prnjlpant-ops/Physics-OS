/**
 * DIALOG SERVICE (Electron / main process)
 * ===========================================
 * Sprint 29A — Electron Foundation — placeholder `show()`.
 * Sprint 29B — Native Desktop Integration — real Electron dialogs.
 *
 * `show()` is kept (same signature, same channel) so nothing that already
 * called `window.physicsOSDesktop.dialog.show(...)` needs to change — it
 * now opens a real `dialog.showMessageBox`. The three new functions below
 * cover the sprint's actual asks: Open Folder (Knowledge Base selection),
 * Open File (Import), Save File (Export).
 *
 * Every function takes the window instance explicitly (attaches the
 * dialog to it, making it modal on that window) rather than importing
 * one — same pattern as windowService.cjs.
 */

const { dialog } = require('electron')

function show(win, options = {}) {
  const { title = 'Physics OS', message = '', type = 'info', buttons = ['OK'] } = options ?? {}
  return dialog.showMessageBox(win ?? undefined, { title, message, type, buttons }).then((result) => ({
    response: result.response,
  }))
}

/** "Choose Knowledge Base Folder" and any other single-folder picker. */
async function openFolder(win, options = {}) {
  const { title = 'Choose a folder', defaultPath } = options ?? {}
  const result = await dialog.showOpenDialog(win ?? undefined, {
    title,
    defaultPath,
    properties: ['openDirectory', 'createDirectory'],
  })
  if (result.canceled || result.filePaths.length === 0) return { canceled: true, path: null }
  return { canceled: false, path: result.filePaths[0] }
}

/** "Import" — a single file picker, optionally filtered by extension. */
async function openFile(win, options = {}) {
  const { title = 'Open File', filters, defaultPath, multiSelections = false } = options ?? {}
  const result = await dialog.showOpenDialog(win ?? undefined, {
    title,
    defaultPath,
    filters: Array.isArray(filters) && filters.length ? filters : [{ name: 'All Files', extensions: ['*'] }],
    properties: multiSelections ? ['openFile', 'multiSelections'] : ['openFile'],
  })
  if (result.canceled || result.filePaths.length === 0) return { canceled: true, paths: [] }
  return { canceled: false, paths: result.filePaths }
}

/** "Export" — a single Save As dialog. */
async function saveFile(win, options = {}) {
  const { title = 'Save File', defaultPath, filters } = options ?? {}
  const result = await dialog.showSaveDialog(win ?? undefined, {
    title,
    defaultPath,
    filters: Array.isArray(filters) && filters.length ? filters : [{ name: 'All Files', extensions: ['*'] }],
  })
  if (result.canceled || !result.filePath) return { canceled: true, path: null }
  return { canceled: false, path: result.filePath }
}

module.exports = { show, openFolder, openFile, saveFile }
