/**
 * LOGGER SERVICE
 * ==============
 * Sprint 0 — Foundation.
 *
 * A single place for app-level logging. Today this only wraps `console`,
 * but routing every log through here means a future sprint can add
 * something else (e.g. writing recent errors to storage for a diagnostics
 * page) without touching every call site.
 *
 * Not for business logic — this module has no idea what a Task or a
 * Subject is, it just records what it's told.
 */

const PREFIX = '[Physics OS]'

function info(message, ...details) {
  console.info(PREFIX, message, ...details)
}

function warn(message, ...details) {
  console.warn(PREFIX, message, ...details)
}

function error(message, ...details) {
  console.error(PREFIX, message, ...details)
}

/**
 * Intended for the Error Boundary and other top-level catch points.
 * Accepts the raw Error object plus any extra context (e.g. React's
 * componentStack from `errorInfo`).
 */
function captureException(err, context = {}) {
  console.error(PREFIX, 'Unhandled error captured', err, context)
}

export const LoggerService = {
  info,
  warn,
  error,
  captureException,
}

export default LoggerService
