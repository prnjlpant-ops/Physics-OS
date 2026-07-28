import SettingsService from './SettingsService'
import { THEME_TOKENS } from '../constants/themeTokens'

/**
 * THEME SERVICE
 * =============
 * Sprint 0 — Foundation.
 *
 * Physics OS ships with a single VS Code inspired dark theme by design
 * (see PRD.md — "Dark theme", "Do not redesign the application"), and
 * `index.html` already hardcodes `<html class="dark">`. This service does
 * not add a theme switcher UI — that would be a study/UI feature, out of
 * scope for this sprint. It exists so future modules have one place to:
 *
 * - read the active theme name (via SettingsService)
 * - read theme color tokens (via THEME_TOKENS) instead of hardcoding hex
 * - apply the theme's `dark` class to <html> consistently, if a future
 *   sprint ever introduces a second theme
 */

function getActiveTheme() {
  return SettingsService.getSetting('theme') ?? 'dark'
}

function getTokens() {
  return THEME_TOKENS
}

/** Applies the given theme's class to the document root. Currently only 'dark' is supported. */
function applyTheme(theme = getActiveTheme()) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  return theme
}

export const ThemeService = {
  getActiveTheme,
  getTokens,
  applyTheme,
}

export default ThemeService
