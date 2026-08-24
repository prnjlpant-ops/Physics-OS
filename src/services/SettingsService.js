import StorageService from './StorageService'

/**
 * SETTINGS SERVICE
 * ================
 * Sprint 0 — Foundation.
 *
 * A single centralized store for app-level settings: Theme, Knowledge Base
 * Root (placeholder), Default Study Hours, Default Session Length, and the
 * Application Version. Built on top of StorageService.
 *
 * This is intentionally separate from the feature-specific settings hooks
 * that already exist (e.g. `useKnowledgeBaseSettings`, `usePlannerSettings`,
 * `useMockSettings`) — those own their own storage keys and are left
 * untouched by this sprint. This service is the foundation for *app-wide*
 * settings; a future sprint may choose to migrate a feature setting here,
 * but that migration is out of scope for Sprint 0.
 *
 * No business logic lives here — just reading, writing, and defaulting a
 * flat settings object.
 */

const SETTINGS_KEY = 'settings'

export const DEFAULT_SETTINGS = {
  theme: 'dark',
  knowledgeBaseRoot: '',
  defaultStudyHours: 6,
  defaultSessionLength: 50,
  appVersion: '0.0.0',
  // Sprint 27 — Study Engine & Today's Mission: Study Preferences.
  dailyStudyGoalMinutes: 240,
  autoSaveNotes: true,
  defaultSubject: '',
  rememberLastTopic: true,
  // Sprint 28 — Desktop Readiness Layer: Desktop Settings.
  // `defaultExportFolder` is a placeholder only — Browser mode has no
  // folder to remember (every export goes through the browser's own
  // download prompt); it exists so Sprint 29 (Electron) has a setting to
  // wire up without introducing a new key.
  defaultExportFolder: '',
  maxRecentItems: 10,
  restoreLastWorkspace: true,
  openResourcesInNewTab: true,
  preferredBrowser: 'system',
}

function readAll() {
  const stored = StorageService.get(SETTINGS_KEY, {})
  return { ...DEFAULT_SETTINGS, ...(stored && typeof stored === 'object' ? stored : {}) }
}

function writeAll(settings) {
  return StorageService.set(SETTINGS_KEY, settings)
}

/** Returns the full settings object, merged with defaults for any missing keys. */
function getSettings() {
  return readAll()
}

/** Returns a single setting by key, falling back to its default. */
function getSetting(key) {
  return readAll()[key]
}

/** Merges `changes` into the stored settings object. */
function updateSettings(changes) {
  const next = { ...readAll(), ...changes }
  writeAll(next)
  return next
}

/** Resets every setting back to its default value. */
function resetSettings() {
  writeAll(DEFAULT_SETTINGS)
  return { ...DEFAULT_SETTINGS }
}

/** Subscribes to any change in settings. Returns an unsubscribe function. */
function subscribe(callback) {
  return StorageService.subscribe(SETTINGS_KEY, callback)
}

export const SettingsService = {
  getSettings,
  getSetting,
  updateSettings,
  resetSettings,
  subscribe,
}

export default SettingsService
