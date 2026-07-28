/**
 * ANALYTICS MODEL
 * ===============
 * Sprint 0 — Foundation.
 *
 * Shared data-only shape for an Analytics snapshot/metric. The Analytics
 * module's own pages (`pages/analytics/*`) compute their own view-specific
 * aggregates today — this is the minimal common contract a future
 * cross-cutting analytics feature (e.g. a unified dashboard export) can
 * build on without depending on any single page's internals.
 *
 * @typedef {Object} AnalyticsSnapshot
 * @property {string} id
 * @property {string} label
 * @property {number} value
 * @property {string} [unit]
 * @property {string} [periodStart] ISO date
 * @property {string} [periodEnd] ISO date
 */

/** @returns {AnalyticsSnapshot} */
export function createAnalyticsSnapshot({
  id,
  label,
  value,
  unit = null,
  periodStart = null,
  periodEnd = null,
}) {
  return { id, label, value, unit, periodStart, periodEnd }
}
