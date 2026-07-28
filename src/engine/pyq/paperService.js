import { normalizeRootPath } from '../knowledgeBaseService'
import { EXAM_ORDER, PAPER_STATUS } from '../../constants/pyqLibraryConstants'
import { createPaperRecord } from './pyqModel'

/**
 * PAPER SERVICE
 * =============
 * Sprint 25 — PYQ Engine.
 *
 * Turns raw `pyqs.json` into normalized `PaperRecord`s. Papers are never
 * hardcoded — every paper shown anywhere in the app is loaded dynamically
 * through this service. Validation never throws: malformed entries are
 * fixed up with safe defaults (or skipped, for duplicates) and reported
 * back as human-readable warnings — the same contract
 * `engine/library/booksService.js` already uses for `books.json`.
 *
 * NO FILE SYSTEM ACCESS. NO FOLDER SCANNING. This only builds path
 * *strings* from the root pyqs.json declares, and validates JSON already
 * loaded into memory.
 */

/** Builds the full on-disk path for a paper, joining the configured root with its relative path. */
export function buildPaperPath(root, relativePath) {
  const normalizedRoot = normalizeRootPath(root)
  if (!normalizedRoot || !relativePath) return relativePath || null
  const cleanRelative = String(relativePath).trim().replace(/^[\\/]+/, '')
  return `${normalizedRoot}\\${cleanRelative.replace(/\//g, '\\')}`
}

/**
 * Normalizes one raw paper entry. Returns `{ paper, warnings }` — never
 * throws, never drops the fields the Paper Library needs to at least
 * display something (falls back to placeholder text instead). Handles
 * Sprint 25's VALIDATION requirements: broken/missing metadata never
 * crashes the page.
 */
function normalizePaper(raw, root, index) {
  const warnings = []

  if (!raw || typeof raw !== 'object') {
    warnings.push(`Paper at position ${index} was malformed and was skipped.`)
    return { paper: null, warnings }
  }

  const id =
    typeof raw.id === 'string' && raw.id.trim()
      ? raw.id.trim()
      : `paper-${index}-${Math.random().toString(36).slice(2, 8)}`
  if (!raw.id) warnings.push(`Paper at position ${index} is missing an "id" — one was generated.`)

  const exam = typeof raw.exam === 'string' && raw.exam.trim() ? raw.exam.trim() : 'Unknown Exam'
  if (!raw.exam) warnings.push(`Paper "${id}" is missing an "exam".`)
  if (raw.exam && !EXAM_ORDER.includes(exam)) {
    warnings.push(`Paper "${id}" references exam "${exam}", which isn't in the supported list yet.`)
  }

  const subject =
    typeof raw.subject === 'string' && raw.subject.trim() ? raw.subject.trim() : 'Unknown Subject'
  if (!raw.subject) warnings.push(`Paper "${id}" is missing a "subject".`)

  const year = Number.isFinite(raw.year) ? raw.year : null
  if (!Number.isFinite(raw.year)) warnings.push(`Paper "${id}" is missing a valid "year".`)

  const path = typeof raw.path === 'string' && raw.path.trim() ? raw.path.trim() : null
  if (!path) warnings.push(`Paper "${id}" is missing a "path" — it will show as Not Added.`)
  const fullPath = buildPaperPath(root, path)

  const paper = createPaperRecord({
    id,
    exam,
    subject,
    year,
    path,
    fullPath,
    status: PAPER_STATUS.NOT_STARTED,
    // Real question counts only ever come from pyq_index.json (Sprint 26).
    // Left null on purpose rather than a fabricated number — the UI shows
    // "Not Indexed" instead of guessing.
    questionCount: null,
  })

  return { paper, warnings }
}

/**
 * Validates and normalizes an entire pyqs.json payload. Never throws —
 * always returns a usable paper list plus warnings for anything dropped or
 * defaulted. Handles: invalid JSON shape, a missing paper array, duplicate
 * ids, and broken/missing metadata (Sprint 25's VALIDATION section).
 */
export function parsePapersJson(raw) {
  const warnings = []

  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.papers)) {
    return {
      root: '',
      papers: [],
      warnings: ['pyqs.json was empty, not valid JSON, or missing a "papers" array.'],
    }
  }

  const root = typeof raw.root === 'string' ? raw.root : ''
  if (!raw.root) warnings.push('pyqs.json is missing a "root" path.')

  const seenIds = new Set()
  const papers = []

  raw.papers.forEach((rawPaper, index) => {
    const { paper, warnings: paperWarnings } = normalizePaper(rawPaper, root, index)
    warnings.push(...paperWarnings)
    if (!paper) return

    if (seenIds.has(paper.id)) {
      warnings.push(`Duplicate paper id "${paper.id}" was skipped.`)
      return
    }
    seenIds.add(paper.id)
    papers.push(paper)
  })

  return { root, papers, warnings }
}

export const PaperService = {
  buildPaperPath,
  parsePapersJson,
}

export default PaperService
