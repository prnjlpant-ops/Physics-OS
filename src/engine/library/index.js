import rawKnowledgeBaseConfig from '../../data/library/knowledgeBaseConfig.json'
import rawBooks from '../../data/library/books.json'
import { parseKnowledgeBaseConfig } from './knowledgeBaseService'
import { parseBooksJson } from './booksService'
import { buildMasterIndex } from './masterIndexService'

/**
 * LIBRARY ENGINE — ENTRY POINT
 * ============================
 * Sprint 24 — Knowledge Base & Resource Engine.
 *
 * The one place that reads the bundled `knowledgeBaseConfig.json` and
 * `books.json`. Parsed once at module load (they're static JSON, not user
 * input), validated through KnowledgeBaseService + BooksService, and
 * merged into the Master Index through MasterIndexService. Every page/hook
 * imports from here — never the raw JSON files directly — so a future
 * sprint that adds JSON import/export (mirroring the existing Master Index
 * Settings page) only has to change this one file's data source.
 */
const { config, warnings: configWarnings } = parseKnowledgeBaseConfig(rawKnowledgeBaseConfig)
const { books, warnings: bookWarnings } = parseBooksJson(rawBooks, config)

export const libraryMasterIndex = buildMasterIndex({ config, books })
export const libraryConfig = config
export const libraryLoadWarnings = [...configWarnings, ...bookWarnings]
