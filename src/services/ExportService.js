import { EXPORTABLE_DATA_CATEGORIES } from '../constants/desktopConstants'

/**
 * EXPORT SERVICE
 * ==============
 * Sprint 28 — Desktop Readiness Layer.
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

export const ExportService = {
  EXPORT_CATEGORIES,
  buildExportPayload,
  toJson,
  exportCategories,
}

export default ExportService
