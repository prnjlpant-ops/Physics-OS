import EnvironmentService from './EnvironmentService'

/**
 * FILE SYSTEM SERVICE
 * ===================
 * Sprint 28 — Desktop Readiness Layer: browser-only `File`/`Blob` reads;
 * `readFile`/`writeFile` were placeholders rejecting with "requires the
 * desktop build".
 * Sprint 29B — Native Desktop Integration: `readFile`/`writeFile`/
 * `exists`/`listDir`/`stat`/`validateDirectory` now resolve for real in
 * Electron, routed through `window.physicsOSDesktop.fileSystem` (see
 * electron/services/fileSystemService.cjs). Browser mode keeps the exact
 * same rejections as before — nothing that already handles that rejection
 * needs to change.
 */

function readAsText(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided.'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error ?? new Error('Could not read that file.'))
    reader.readAsText(file)
  })
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided.'))
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error ?? new Error('Could not read that file.'))
    reader.readAsDataURL(file)
  })
}

/** Reads an absolute path off disk. Requires the desktop (Electron) build. */
function readFile(path, encoding = 'utf-8') {
  if (!EnvironmentService.isElectron()) {
    return Promise.reject(
      new Error('Reading files by path requires the desktop build of Physics OS — not available in Browser mode.'),
    )
  }
  return window.physicsOSDesktop.fileSystem.readFile(path, encoding)
}

/** Writes an absolute path to disk. Requires the desktop (Electron) build. */
function writeFile(path, contents, encoding = 'utf-8') {
  if (!EnvironmentService.isElectron()) {
    return Promise.reject(
      new Error('Writing files by path requires the desktop build of Physics OS — not available in Browser mode.'),
    )
  }
  return window.physicsOSDesktop.fileSystem.writeFile(path, contents, encoding)
}

/** Whether a path exists on disk. Always resolves `false` in Browser mode rather than rejecting. */
function exists(path) {
  if (!EnvironmentService.isElectron()) return Promise.resolve(false)
  return window.physicsOSDesktop.fileSystem.exists(path)
}

/** Directory listing (`{ name, isDirectory, isFile }[]`). Requires the desktop build. */
function listDir(path) {
  if (!EnvironmentService.isElectron()) {
    return Promise.reject(
      new Error('Browsing folders requires the desktop build of Physics OS — not available in Browser mode.'),
    )
  }
  return window.physicsOSDesktop.fileSystem.listDir(path)
}

/** File/folder metadata (size, timestamps, kind). Requires the desktop build. */
function stat(path) {
  if (!EnvironmentService.isElectron()) {
    return Promise.reject(
      new Error('Reading file metadata requires the desktop build of Physics OS — not available in Browser mode.'),
    )
  }
  return window.physicsOSDesktop.fileSystem.stat(path)
}

/**
 * Validates a candidate folder (e.g. a Knowledge Base root) — exists, is a
 * directory, is readable. Never rejects: Browser mode resolves `{ valid:
 * false, reason }` rather than throwing, since the Knowledge Base settings
 * flow needs an inline reason either way.
 */
function validateDirectory(path) {
  if (!EnvironmentService.isElectron()) {
    return Promise.resolve({
      valid: false,
      reason: 'Folder validation requires the desktop build of Physics OS — not available in Browser mode.',
    })
  }
  return window.physicsOSDesktop.fileSystem.validateDir(path)
}

export const FileSystemService = {
  readAsText,
  readAsDataURL,
  readFile,
  writeFile,
  exists,
  listDir,
  stat,
  validateDirectory,
}

export default FileSystemService
