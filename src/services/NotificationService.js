import { NOTIFICATION_TYPES } from '../constants/desktopConstants'
import EnvironmentService from './EnvironmentService'

/**
 * NOTIFICATION SERVICE
 * ====================
 * Sprint 28 — Desktop Readiness Layer: in-app toasts only, rendered by
 * `components/notifications/NotificationHost.jsx`.
 * Sprint 29B — Native Desktop Integration: additionally fires a real OS
 * notification (see electron/services/notificationService.cjs) when
 * running as a desktop app AND the window is unfocused/hidden — e.g. a
 * long Study Session ends while Physics OS is in the background. When the
 * window is focused, the in-app toast alone is enough; a duplicate native
 * popup on top of a toast the user is already looking at would just be
 * noise. Every existing call site (ResourceLauncherService,
 * ImportService, ExportService, ...) is unaffected — this is additive.
 */

let listeners = new Set()

function subscribe(callback) {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

function emit(notification) {
  listeners.forEach((callback) => callback(notification))
}

/** Best-effort native notification — never blocks or throws into the caller. */
function notifyNative(type, message) {
  if (!EnvironmentService.isElectron()) return
  if (typeof document !== 'undefined' && !document.hidden) return
  window.physicsOSDesktop.notification
    .show({ title: 'Physics OS', message, type })
    .catch(() => {
      // Native notifications are a nice-to-have — the in-app toast already covered it.
    })
}

function notify(type, message, options = {}) {
  const notification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    message,
    duration: options.duration ?? 4000,
  }
  emit(notification)
  notifyNative(type, message)
  return notification.id
}

function success(message, options) {
  return notify(NOTIFICATION_TYPES.SUCCESS, message, options)
}

function warning(message, options) {
  return notify(NOTIFICATION_TYPES.WARNING, message, options)
}

function error(message, options) {
  return notify(NOTIFICATION_TYPES.ERROR, message, options)
}

function info(message, options) {
  return notify(NOTIFICATION_TYPES.INFO, message, options)
}

export const NotificationService = {
  NOTIFICATION_TYPES,
  subscribe,
  notify,
  success,
  warning,
  error,
  info,
}

export default NotificationService
