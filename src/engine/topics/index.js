import rawPyqIndex from '../../data/pyq/pyq_index.json'
import { libraryConfig } from '../library'
import { parseTopicIndex } from './topicIndexService'
import { buildTopicTree } from './topicNavigationService'

/**
 * TOPIC INDEX ENGINE — ENTRY POINT
 * =================================
 * Sprint 26 — Topic Index & Study Mapping.
 *
 * The one place that reads the bundled `pyq_index.json`'s `topics` array
 * (the same file Sprint 25 already loads for its per-paper `papers` map,
 * at `engine/pyq/index.js` — that import is untouched by this sprint).
 * Parsed once at module load — it's static JSON, not user input — and
 * validated through `TopicIndexService` against the Knowledge Base's
 * subject vocabulary (`libraryConfig`, from `engine/library/index.js`).
 * Every page/hook imports from here, never the raw JSON file directly, so
 * a future sprint that adds JSON import/export only has to change this one
 * file's data source.
 *
 * Works correctly even when `topics` is empty — that is this file's
 * default shipped state until the user populates it.
 */
const { topics, warnings } = parseTopicIndex(rawPyqIndex, libraryConfig)

export const topicRecords = topics
export const topicLoadWarnings = warnings
export const topicTree = buildTopicTree(topicRecords)
export const topicIndexMeta = {
  version: typeof rawPyqIndex?.version === 'string' ? rawPyqIndex.version : '1.0.0',
  lastUpdated: rawPyqIndex?.lastUpdated ?? null,
}
