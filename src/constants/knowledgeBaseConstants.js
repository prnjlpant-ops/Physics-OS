import {
  Library,
  BookMarked,
  FileText,
  Brain,
  StickyNote,
  Video,
  Newspaper,
  Lightbulb,
  Archive,
} from 'lucide-react'

/**
 * KNOWLEDGE BASE CONSTANTS
 * ========================
 * Sprint 21 — Knowledge Base Integration.
 * Sprint 22 — Master Index Engine (resource *content* now lives in the
 * Master Index; this file still owns the category vocabulary/hierarchy
 * both the Master Index and the Knowledge Base UI share).
 *
 * Shared vocabulary for the Knowledge Base engine, the Master Index
 * (engine/masterIndexService.js reuses this exact category list/labels)
 * and the Knowledge Base UI (components/knowledgeBase/*,
 * pages/subject/SubjectKnowledgeBasePage.jsx).
 *
 * Hierarchy (per PRD Sprint 21):
 *   Knowledge Base -> Subject -> Books -> Solution Manuals -> Formula Sheets ->
 *   Memory Sheets -> Notes -> Videos -> Research Papers -> Conceptual
 *   Resources -> Assets
 *
 * This is a *local folder structure* the user maintains on disk (e.g. under
 * "D:\Knowledge Base\<Subject>\<Category>"). Nothing here scans the disk —
 * the Master Index carries each resource's own `localPath` string.
 */

export const KNOWLEDGE_BASE_CATEGORY_ORDER = [
  'books',
  'solutionManuals',
  'formulaSheets',
  'memorySheets',
  'notes',
  'videos',
  'researchPapers',
  'conceptualResources',
  'assets',
]

export const KNOWLEDGE_BASE_CATEGORY_META = {
  books: { label: 'Books', singular: 'Book', icon: Library },
  solutionManuals: { label: 'Solution Manuals', singular: 'Solution Manual', icon: BookMarked },
  formulaSheets: { label: 'Formula Sheets', singular: 'Formula Sheet', icon: FileText },
  memorySheets: { label: 'Memory Sheets', singular: 'Memory Sheet', icon: Brain },
  notes: { label: 'Notes', singular: 'Note', icon: StickyNote },
  videos: { label: 'Videos', singular: 'Video', icon: Video },
  researchPapers: { label: 'Research Papers', singular: 'Research Paper', icon: Newspaper },
  conceptualResources: {
    label: 'Conceptual Resources',
    singular: 'Conceptual Resource',
    icon: Lightbulb,
  },
  assets: { label: 'Assets', singular: 'Asset', icon: Archive },
}

/** No default — the user must explicitly configure a root in Settings. */
export const DEFAULT_KNOWLEDGE_BASE_ROOT_PATH = ''

export const KNOWLEDGE_BASE_ROOT_PATH_PLACEHOLDER = 'D:\\Knowledge Base'
