import { DIALOG_TYPES } from '../constants/desktopConstants'
import EnvironmentService from './EnvironmentService'

/**
 * DIALOG SERVICE
 * ==============
 * Sprint 28 — Desktop Readiness Layer.
 *
 * Centralizes Confirm/Delete/Overwrite/Import/Export dialogs behind a
 * Promise-based API instead of scattering `window.confirm` calls across
 * components. This module holds no UI itself — it's a request/response
 * bus. `components/dialogs/DialogHost.jsx` (mounted once in AppLayout)
 * subscribes, renders the actual dialog using the existing `ui/Modal`
 * primitive, and calls `resolve()` with the user's choice.
 *
 * Sprint 29B — Native Desktop Integration adds `openFolderDialog`/
 * `openFileDialog`/`saveFileDialog` below: real Electron dialogs
 * (`dialog.showOpenDialog`/`showSaveDialog`) for Choose Knowledge Base
 * Folder, Import, and Export. These are a separate concern from
 * `confirm()`/`confirmDelete()`/etc. above — those stay in-app Modals by
 * design (Physics OS's own dark theme, not the OS's native look), while
 * these three are genuinely native filesystem pickers Browser mode has no
 * equivalent for. Callers check `DesktopService.isElectronReady()` (or
 * the `canceled`/`unsupported` result shape below) to decide whether to
 * fall back to a manual text field or `<input type="file">`.
 */

let listeners = new Set()
const pending = new Map()

function subscribe(callback) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function emit(request) {
  listeners.forEach((callback) => callback(request))
}

/** Resolves a pending dialog request. Called by DialogHost once the user responds. */
function resolve(id, result) {
  const resolver = pending.get(id)
  if (!resolver) return
  pending.delete(id)
  resolver(result)
}

function request(type, options = {}) {
  return new Promise((resolveRequest) => {
    const id = `dialog-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    pending.set(id, resolveRequest)
    emit({ id, type, ...options })
  })
}

/** Generic confirm — resolves `true`/`false`. */
function confirm({ title = 'Confirm', message = '', confirmLabel = 'Confirm', cancelLabel = 'Cancel', danger = false } = {}) {
  return request(DIALOG_TYPES.CONFIRM, { title, message, confirmLabel, cancelLabel, danger })
}

function confirmDelete(itemName = 'this item') {
  return request(DIALOG_TYPES.DELETE, {
    title: 'Delete',
    message: `Delete "${itemName}"? This cannot be undone.`,
    confirmLabel: 'Delete',
    cancelLabel: 'Cancel',
    danger: true,
  })
}

function confirmOverwrite(itemName = 'this item') {
  return request(DIALOG_TYPES.OVERWRITE, {
    title: 'Overwrite',
    message: `"${itemName}" already exists. Overwrite it?`,
    confirmLabel: 'Overwrite',
    cancelLabel: 'Cancel',
  })
}

function confirmImport(summary = 'Import this data? Existing data with the same keys will be overwritten.') {
  return request(DIALOG_TYPES.IMPORT, {
    title: 'Import Data',
    message: summary,
    confirmLabel: 'Import',
    cancelLabel: 'Cancel',
  })
}

function confirmExport(summary = 'Export the selected data as a JSON file?') {
  return request(DIALOG_TYPES.EXPORT, {
    title: 'Export Data',
    message: summary,
    confirmLabel: 'Export',
    cancelLabel: 'Cancel',
  })
}

/** Native "Choose Folder" picker (Knowledge Base root selection). Browser mode has no equivalent — resolves `{ canceled: true, path: null, unsupported: true }`. */
function openFolderDialog(options = {}) {
  if (!EnvironmentService.isElectron()) {
    return Promise.resolve({ canceled: true, path: null, unsupported: true })
  }
  return window.physicsOSDesktop.dialog.openFolder(options)
}

/** Native "Open File" picker (Import). Browser mode has no equivalent — resolves `{ canceled: true, paths: [], unsupported: true }`. */
function openFileDialog(options = {}) {
  if (!EnvironmentService.isElectron()) {
    return Promise.resolve({ canceled: true, paths: [], unsupported: true })
  }
  return window.physicsOSDesktop.dialog.openFile(options)
}

/** Native "Save As" picker (Export). Browser mode has no equivalent — resolves `{ canceled: true, path: null, unsupported: true }`. */
function saveFileDialog(options = {}) {
  if (!EnvironmentService.isElectron()) {
    return Promise.resolve({ canceled: true, path: null, unsupported: true })
  }
  return window.physicsOSDesktop.dialog.saveFile(options)
}

export const DialogService = {
  DIALOG_TYPES,
  subscribe,
  resolve,
  confirm,
  confirmDelete,
  confirmOverwrite,
  confirmImport,
  confirmExport,
  openFolderDialog,
  openFileDialog,
  saveFileDialog,
}

export default DialogService
