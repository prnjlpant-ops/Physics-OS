import { PLATFORM } from '../constants/desktopConstants'

/**
 * PLATFORM SERVICE
 * ================
 * Sprint 28 — Desktop Readiness Layer.
 *
 * Best-effort operating system detection from browser-available signals
 * only (`navigator.userAgent`). This exists so path-separator choices and
 * OS-specific display strings (e.g. "Reveal in Finder" vs "Reveal in
 * Explorer") have one place to ask "what OS is this?" instead of every
 * component sniffing `navigator` directly.
 *
 * Never accesses the file system and never assumes Electron/native APIs
 * exist — see EnvironmentService for runtime (Browser/Electron) detection.
 */

function detect() {
  if (typeof navigator === 'undefined' || typeof navigator.userAgent !== 'string') {
    return PLATFORM.UNKNOWN
  }

  const ua = navigator.userAgent

  if (/Win/i.test(ua)) return PLATFORM.WINDOWS
  if (/Mac/i.test(ua)) return PLATFORM.MAC
  if (/Linux|X11/i.test(ua)) return PLATFORM.LINUX

  return PLATFORM.UNKNOWN
}

function isWindows() {
  return detect() === PLATFORM.WINDOWS
}

function isMac() {
  return detect() === PLATFORM.MAC
}

function isLinux() {
  return detect() === PLATFORM.LINUX
}

/** The path separator this platform's absolute paths would use. Defaults to '/' when unknown. */
function pathSeparator() {
  return detect() === PLATFORM.WINDOWS ? '\\' : '/'
}

/** Display label for "reveal in file manager" actions — future Electron use, browser mode never shows this. */
function fileManagerLabel() {
  if (isMac()) return 'Reveal in Finder'
  if (isWindows()) return 'Reveal in Explorer'
  if (isLinux()) return 'Reveal in File Manager'
  return 'Reveal in File Manager'
}

export const PlatformService = {
  PLATFORM,
  detect,
  isWindows,
  isMac,
  isLinux,
  pathSeparator,
  fileManagerLabel,
}

export default PlatformService
