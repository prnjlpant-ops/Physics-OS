/**
 * THEME TOKENS
 * ============
 * Sprint 0 — Foundation.
 *
 * Named constants for the VS Code inspired dark palette already used
 * throughout the app as inline hex values (Tailwind arbitrary values like
 * `bg-[#1e1e1e]` or raw hex in style constants such as
 * `syllabusConstants.TOPIC_STATUS_STYLES`). This file does not change any
 * existing usage — the hardcoded hex values across ~180 existing files are
 * intentionally left as-is per this sprint's "keep the current design, do
 * not redesign" rule. It exists so that every NEW component built from
 * this sprint onward can reference `THEME_TOKENS.surface` instead of
 * typing another raw hex value, and so a future sprint has a single place
 * to point a real theming system at.
 *
 * These values mirror the CSS custom properties in `src/styles/index.css`
 * (`@theme` block) plus the wider VS Code palette already in use.
 */

export const THEME_TOKENS = {
  // Core surfaces (also defined as CSS vars in styles/index.css)
  background: '#0a0a0a',
  foreground: '#fafafa',
  muted: '#a1a1aa',
  border: '#27272a',
  surface: '#18181b',

  // Wider VS Code inspired palette already used across feature pages
  editorBackground: '#1e1e1e',
  panelBackground: '#252526',
  panelBackgroundAlt: '#2d2d2d',
  borderSubtle: '#3c3c3c',
  borderStrong: '#4a4a4a',
  textPrimary: '#e8e8e8',
  textSecondary: '#cccccc',
  textMuted: '#9d9d9d',
  textFaint: '#858585',
  textDisabled: '#6e6e6e',

  // Status / accent colors
  accentBlue: '#4fc1ff',
  accentBlueStrong: '#0e639c',
  accentBlueHover: '#1177bb',
  accentAmber: '#e2c08d',
  accentPurple: '#c586c0',
  accentGreen: '#89d185',
  accentRed: '#f48771',
}

export default THEME_TOKENS
