/**
 * KNOWLEDGE BASE MODEL
 * ====================
 * Sprint 0 — Foundation.
 *
 * Shared data-only shape describing the Knowledge Base root — a local
 * folder the user maintains on disk (see PRD, `constants/knowledgeBaseConstants.js`).
 * The real category vocabulary and the Master Index engine
 * (`engine/masterIndexService.js`, `engine/masterIndexModel.js`) already
 * own the detailed resource-tracking shape for Sprint 21/22 — this is only
 * the minimal "where is it, is it configured" contract for other modules.
 *
 * @typedef {Object} KnowledgeBaseRoot
 * @property {string} rootPath Local folder path, empty string if unconfigured.
 * @property {boolean} isConfigured
 */

/** @returns {KnowledgeBaseRoot} */
export function createKnowledgeBaseRoot({ rootPath = '' }) {
  return { rootPath, isConfigured: rootPath.trim().length > 0 }
}
