/**
 * SUBJECT MODEL
 * =============
 * Sprint 0 — Foundation.
 *
 * Shared data-only shape for a Subject, the top level of the syllabus tree
 * (Subject -> Chapter -> Topic -> Resources, see PRD.md). The live app
 * currently builds subjects from the JEST blueprint
 * (`constants/subjects.js` + `engine/blueprintMappingLayer.js`) with a
 * richer, blueprint-specific shape — that pipeline is unchanged by this
 * sprint. This factory is the plain, source-agnostic contract any future
 * module can rely on without depending on the blueprint pipeline.
 *
 * @typedef {Object} Subject
 * @property {string} id
 * @property {string} name
 * @property {string} [description]
 * @property {string} [icon]
 * @property {Array<import('./Chapter').Chapter>} chapters
 */

/** @returns {Subject} */
export function createSubject({ id, name, description = '', icon = null, chapters = [] }) {
  return { id, name, description, icon, chapters }
}
