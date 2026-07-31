/**
 * DESKTOP CONSTANTS
 * =================
 * Sprint 28 — Desktop Readiness Layer.
 *
 * Shared vocabulary for the new services/*.js desktop abstraction layer
 * (EnvironmentService, ResourceLauncherService, NotificationService,
 * RecentFilesService, etc). Kept in one file so every service and any
 * future Electron implementation agrees on the same set of names instead
 * of each inventing its own strings.
 */

/** Runtimes Physics OS can detect itself running in (see EnvironmentService). */
export const ENVIRONMENT = {
  BROWSER: 'browser',
  ELECTRON: 'electron',
  UNKNOWN: 'unknown',
}

/** Operating systems PlatformService can detect (best-effort, browser-only signals). */
export const PLATFORM = {
  WINDOWS: 'windows',
  MAC: 'mac',
  LINUX: 'linux',
  UNKNOWN: 'unknown',
}

/** Resource kinds ResourceLauncherService knows how to open, per PRD's Resource Philosophy. */
export const LAUNCHABLE_RESOURCE_TYPES = {
  BOOK: 'book',
  NOTE: 'note',
  FORMULA_SHEET: 'formulaSheet',
  MEMORY_SHEET: 'memorySheet',
  VIDEO: 'video',
  RESEARCH_PAPER: 'researchPaper',
  PYQ: 'pyq',
}

/** NotificationService severities. */
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info',
}

/** DialogService dialog kinds. */
export const DIALOG_TYPES = {
  CONFIRM: 'confirm',
  DELETE: 'delete',
  OVERWRITE: 'overwrite',
  IMPORT: 'import',
  EXPORT: 'export',
}

/** RecentFilesService list names. */
export const RECENT_LIST_NAMES = {
  RESOURCES: 'resources',
  TOPICS: 'topics',
  BOOKS: 'books',
  PAPERS: 'papers',
  // Sprint 29B — Native Desktop Integration: previously-chosen Knowledge
  // Base roots, so switching back to one doesn't require retyping/re-browsing it.
  WORKSPACES: 'workspaces',
}

/**
 * Action names sent from the native application menu (Sprint 29B —
 * electron/main/menu.cjs) over `window.physicsOSDesktop.menu.onAction`.
 * Kept here, not in the Electron-only main process, so the renderer side
 * (useDesktopMenu.js) has one place to match strings against instead of
 * hardcoding them loosely.
 */
export const MENU_ACTIONS = {
  OPEN_KNOWLEDGE_BASE_FOLDER: 'openKnowledgeBaseFolder',
  EXPORT: 'export',
  IMPORT: 'import',
  SEARCH: 'search',
  NEW_STUDY_SESSION: 'newStudySession',
  TODAYS_MISSION: 'todaysMission',
}

/** ExportService / ImportService data categories. */
export const EXPORTABLE_DATA_CATEGORIES = {
  STUDY_SESSIONS: 'studySessions',
  TASKS: 'tasks',
  BOOKMARKS: 'bookmarks',
  PROGRESS: 'progress',
  SETTINGS: 'settings',
}

export const DEFAULT_MAX_RECENT_ITEMS = 10
