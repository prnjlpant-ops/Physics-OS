import rawPyqs from '../../data/pyq/pyqs.json'
import rawPyqIndex from '../../data/pyq/pyq_index.json'
import { parsePapersJson } from './paperService'
import { createPyqLibraryIndex } from './pyqModel'

/**
 * PYQ ENGINE — ENTRY POINT
 * ========================
 * Sprint 25 — PYQ Engine.
 *
 * The one place that reads the bundled `pyqs.json` (and, in preparation
 * for Sprint 26, `pyq_index.json`). Parsed once at module load — they're
 * static JSON, not user input — and validated through `PaperService`.
 * Every page/hook imports from here, never the raw JSON files directly, so
 * a future sprint that adds JSON import/export (mirroring the existing
 * Master Index Settings page) only has to change this one file's data
 * source.
 *
 * `pyq_index.json` is intentionally loaded but unused beyond being handed
 * to `PYQService.getTopicIndexForPaper` — see that function and
 * `pyqModel.js`'s `createTopicIndexEntry` for the interface Sprint 26 will
 * populate. Nothing here requires it to contain anything.
 */
const { root, papers, warnings } = parsePapersJson(rawPyqs)

export const pyqLibraryIndex = createPyqLibraryIndex({ root, papers })
export const pyqLoadWarnings = warnings

/** Passed straight through to PYQService.getTopicIndexForPaper — always empty until Sprint 26. */
export const pyqTopicIndex = rawPyqIndex && typeof rawPyqIndex === 'object' ? rawPyqIndex : { papers: {} }
