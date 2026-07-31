import StorageService from './StorageService'
import FileSystemService from './FileSystemService'
import EnvironmentService from './EnvironmentService'
import DialogService from './DialogService'

/**
 * IMPORT SERVICE
 * ==============
 * Sprint 28 — Desktop Readiness Layer.
 *
 * Restores data previously written by `ExportService`. Validates the
 * file's shape before touching anything — never throws, never applies a
 * malformed payload. Actually writing values back goes through
 * `StorageService`, so every restored key gets the same "physicsOS."
 * namespacing and change notifications a live write would get.
 *
 * Pages should confirm with the user (via `DialogService.confirmImport`)
 * before calling `applyPayload`, since it overwrites existing data.
 */

/** Reads and validates an exported JSON payload. Never throws. */
function parsePayload(jsonString) {
  try {
    const parsed = JSON.parse(jsonString)
    if (!parsed || typeof parsed !== 'object' || typeof parsed.data !== 'object' || parsed.data === null) {
      return { success: false, error: "That file doesn't look like a Physics OS export.", payload: null }
    }
    return { success: true, error: null, payload: parsed }
  } catch {
    return { success: false, error: 'That file is not valid JSON.', payload: null }
  }
}

/** Reads a `File` (e.g. from an `<input type="file">`) and validates it in one step. */
async function importFromFile(file) {
  try {
    const text = await FileSystemService.readAsText(file)
    return parsePayload(text)
  } catch {
    return { success: false, error: 'Could not read that file.', payload: null }
  }
}

async function importFromPath(path) {
  if (!path || typeof path !== 'string') {
    return { success: false, error: 'No file selected.', payload: null }
  }

  try {
    const text = await FileSystemService.readFile(path)
    return parsePayload(text)
  } catch {
    return { success: false, error: 'Could not read that file.', payload: null }
  }
}

async function importFromNative() {
  if (!EnvironmentService.isElectron()) {
    return {
      success: false,
      canceled: false,
      unsupported: true,
      error: 'Native import requires the desktop build.',
      payload: null,
    }
  }

  const result = await DialogService.openFileDialog({
    title: 'Import Physics OS Data',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    multiSelections: false,
  })

  if (result.canceled || !Array.isArray(result.paths) || result.paths.length === 0) {
    return { success: false, canceled: true, unsupported: false, error: null, payload: null }
  }

  return importFromPath(result.paths[0])
}

/** Writes every key/value from a validated payload back into StorageService. Returns how many keys were applied. */
function applyPayload(payload) {
  if (!payload || typeof payload.data !== 'object' || payload.data === null) return { applied: 0 }

  let applied = 0
  Object.entries(payload.data).forEach(([key, value]) => {
    if (StorageService.set(key, value)) applied += 1
  })

  return { applied }
}

export const ImportService = {
  parsePayload,
  importFromFile,
  importFromPath,
  importFromNative,
  applyPayload,
}

export default ImportService
