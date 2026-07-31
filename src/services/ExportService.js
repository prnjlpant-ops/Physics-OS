import { EXPORTABLE_DATA_CATEGORIES } from '../constants/desktopConstants'
import EnvironmentService from './EnvironmentService'
import DialogService from './DialogService'
import FileSystemService from './FileSystemService'

/**
 * EXPORT SERVICE
 * ==============
 * Sprint 28 — Desktop Readiness Layer: Browser-only, via a Blob download
 * anchor.
 * Sprint 29B — Native Desktop Integration: `exportCategoriesNative` opens
 * a real "Save As" dialog and writes the file directly to the chosen path
 * (see electron/services/dialogService.cjs + fileSystemService.cjs) —
 * used instead of the Blob download when running as a desktop app, so the
 * export lands wherever the user picks rather than always in Downloads.
 * `exportCategories` (Blob download) is untouched and still works
 * identically in both Browser and Electron, so nothing that already calls
 * it needs to change.
 *
 * Exports Study Sessions, Tasks, Bookmarks, Progress, and Settings as one
 * JSON file. Rather than hardcoding every individual localStorage key
 * these already live under (there are a couple dozen, spread across many
 * existing hooks — Formula/Memory/PYQ/Mock/Error bookmarks, syllabus and
 * mission status, analytics goals, ...), this scans every key already
 * namespaced under "physicsOS." and buckets each one into a category by
 * name pattern. New keys future sprints add are picked up automatically
 * as long as they follow the existing naming conventions — no hook needs
 * to change, and no key list needs to be maintained by hand here.
 *
 * This is the only service that touches `document`/`Blob`/`localStorage`
 * directly for export purposes — pages call `exportCategories(...)` and
 * never build a download link themselves.
 */

const NAMESPACE_PREFIX = 'physicsOS.'

const CATEGORY_PATTERNS = {
  [EXPORTABLE_DATA_CATEGORIES.STUDY_SESSIONS]: [/studysession/i],
  [EXPORTABLE_DATA_CATEGORIES.TASKS]: [/^studyengine\.tasks$/i, /mission/i, /planner/i, /dailyplan/i],
  [EXPORTABLE_DATA_CATEGORIES.BOOKMARKS]: [/bookmark/i, /favorite/i],
  [EXPORTABLE_DATA_CATEGORIES.PROGRESS]: [/progress/i, /status/i, /revisionqueue/i, /goals/i, /consistency/i],
  [EXPORTABLE_DATA_CATEGORIES.SETTINGS]: [/^settings$/i, /knowledgebasesettings/i, /librarysettings/i, /mocksettings/i, /plannersettings/i],
}

export const EXPORT_CATEGORIES = Object.values(EXPORTABLE_DATA_CATEGORIES)

function categorize(shortKey) {
  const match = Object.entries(CATEGORY_PATTERNS).find(([, patterns]) =>
    patterns.some((pattern) => pattern.test(shortKey)),
  )
  return match ? match[0] : 'other'
}

/** Reads every "physicsOS.*" localStorage entry, tagged with its inferred category. Never throws. */
function collectNamespacedEntries() {
  const entries = []
  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const fullKey = localStorage.key(i)
      if (!fullKey || !fullKey.startsWith(NAMESPACE_PREFIX)) continue

      const shortKey = fullKey.slice(NAMESPACE_PREFIX.length)
      try {
        entries.push({
          key: shortKey,
          category: categorize(shortKey),
          value: JSON.parse(localStorage.getItem(fullKey)),
        })
      } catch {
        // Skip unreadable/non-JSON entries rather than failing the whole export.
      }
    }
  } catch {
    // localStorage unavailable — return whatever was gathered (likely nothing).
  }
  return entries
}

/** Builds the export payload for the requested categories (defaults to everything supported). */
function buildExportPayload(categories = EXPORT_CATEGORIES) {
  const entries = collectNamespacedEntries().filter((entry) => categories.includes(entry.category))
  const data = Object.fromEntries(entries.map((entry) => [entry.key, entry.value]))

  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    categories,
    data,
  }
}

function toJson(categories) {
  return JSON.stringify(buildExportPayload(categories), null, 2)
}

/** Triggers a browser download of a JSON string. The only place this service touches the DOM. */
function downloadJson(filename, jsonString) {
  try {
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename.endsWith('.json') ? filename : `${filename}.json`
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)
    return true
  } catch {
    return false
  }
}

function exportCategories(categories, filename = 'physics-os-export.json') {
  const json = toJson(categories)
  const success = downloadJson(filename, json)
  return { success, json }
}

/**
 * Native export: opens the OS "Save As" dialog and writes the JSON file
 * directly to the chosen path. Electron only — callers should check
 * `EnvironmentService.isElectron()` (or just call `exportCategories` in
 * Browser mode) rather than call this unconditionally.
 */
async function exportCategoriesNative(categories, defaultFilename = 'physics-os-export.json') {
  if (!EnvironmentService.isElectron()) {
    return { success: false, canceled: false, path: null, unsupported: true }
  }

  const { canceled, path } = await DialogService.saveFileDialog({
    title: 'Export Physics OS Data',
    defaultPath: defaultFilename,
    filters: [{ name: 'JSON', extensions: ['json'] }],
  })
  if (canceled || !path) return { success: false, canceled: true, path: null, unsupported: false }

  try {
    await FileSystemService.writeFile(path, toJson(categories))
    return { success: true, canceled: false, path, unsupported: false }
  } catch (error) {
    return { success: false, canceled: false, path, unsupported: false, error: error?.message }
  }
}

export const ExportService = {
  EXPORT_CATEGORIES,
  buildExportPayload,
  toJson,
  exportCategories,
  exportCategoriesNative,
}

export default ExportService
