/**
 * SETTINGS MODEL
 * ==============
 * Sprint 0 — Foundation.
 *
 * Shared data-only shape for the app-level settings object persisted by
 * `services/SettingsService.js`. Kept in sync with `DEFAULT_SETTINGS` there.
 *
 * @typedef {Object} Settings
 * @property {string} theme
 * @property {string} knowledgeBaseRoot
 * @property {number} defaultStudyHours
 * @property {number} defaultSessionLength
 * @property {string} appVersion
 */

/** @returns {Settings} */
export function createSettings({
  theme = 'dark',
  knowledgeBaseRoot = '',
  defaultStudyHours = 6,
  defaultSessionLength = 50,
  appVersion = '0.0.0',
}) {
  return { theme, knowledgeBaseRoot, defaultStudyHours, defaultSessionLength, appVersion }
}
