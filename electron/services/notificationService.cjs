/**
 * NOTIFICATION SERVICE (Electron / main process)
 * =================================================
 * Sprint 29A — Electron Foundation — placeholder `show()`.
 * Sprint 29B — Native Desktop Integration — real native OS notifications.
 *
 * Uses Electron's `Notification` class, which wraps each OS's native
 * notification center (Windows Action Center, macOS Notification Center,
 * Linux notify-send/libnotify). `Notification.isSupported()` covers the
 * "gracefully fall back when unsupported" requirement — some Linux
 * environments have no notification daemon running.
 *
 * The renderer's existing `NotificationService` (in-app toasts) is
 * untouched and keeps working exactly as it does today; this is a
 * separate, native-OS-level notification path that the renderer service
 * additionally triggers when the window is unfocused (see
 * `src/services/NotificationService.js`).
 */

const { Notification } = require('electron')

const URGENCY_BY_TYPE = {
  error: 'critical',
  warning: 'normal',
  success: 'low',
  info: 'low',
}

function show(options = {}) {
  const { title = 'Physics OS', message = '', type = 'info' } = options ?? {}

  if (!Notification.isSupported()) {
    return Promise.resolve({ shown: false, reason: 'Native notifications are not supported on this system.' })
  }

  try {
    const notification = new Notification({
      title,
      body: message,
      urgency: URGENCY_BY_TYPE[type] ?? 'normal',
      silent: type === 'info' || type === 'success',
    })
    notification.show()
    return Promise.resolve({ shown: true, reason: null })
  } catch (error) {
    return Promise.resolve({ shown: false, reason: error instanceof Error ? error.message : String(error) })
  }
}

module.exports = { show }
