/**
 * FILE SYSTEM SERVICE
 * ===================
 * Sprint 28 — Desktop Readiness Layer.
 *
 * Browser mode has no real file system access — this service only wraps
 * reading `File`/`Blob` objects the user has explicitly picked (e.g. via
 * an `<input type="file">`, used by ImportService). `readFile`/`writeFile`
 * are placeholders for Sprint 29 (Electron), which will resolve them via
 * IPC to the main process instead of rejecting.
 *
 * NO NATIVE FILE ACCESS. NO DISK SCANNING. See Sprint 28's DO NOT
 * IMPLEMENT list.
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

/** Placeholder — reading an absolute path off disk requires the desktop (Electron) build. */
function readFile() {
  return Promise.reject(
    new Error('Reading files by path requires the desktop build of Physics OS — not available in Browser mode.'),
  )
}

/** Placeholder — writing an absolute path to disk requires the desktop (Electron) build. */
function writeFile() {
  return Promise.reject(
    new Error('Writing files by path requires the desktop build of Physics OS — not available in Browser mode.'),
  )
}

export const FileSystemService = {
  readAsText,
  readAsDataURL,
  readFile,
  writeFile,
}

export default FileSystemService
