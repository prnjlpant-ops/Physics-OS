/**
 * RESOURCE MODEL
 * ==============
 * Sprint 0 — Foundation.
 *
 * Shared data-only shape for a Resource attached to a Chapter/Topic — a
 * Book, Video, PDF, Solution Manual, Reference Material, or External Link.
 * `type` should be one of the keys in `RESOURCE_TYPE_META`
 * (`constants/resourceTypes.js`).
 *
 * @typedef {Object} Resource
 * @property {string} id
 * @property {string} title
 * @property {string} type
 * @property {string} subjectId
 * @property {string} chapterSlug
 * @property {string} [link]
 * @property {boolean} [offline] Whether this resource is a local/offline file (PRD: "Offline PDFs").
 */

/** @returns {Resource} */
export function createResource({
  id,
  title,
  type,
  subjectId,
  chapterSlug,
  link = null,
  offline = false,
}) {
  return { id, title, type, subjectId, chapterSlug, link, offline }
}
