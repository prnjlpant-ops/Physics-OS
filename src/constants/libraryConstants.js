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
  FlaskConical,
} from 'lucide-react'

/**
 * LIBRARY CONSTANTS
 * =================
 * Sprint 24 — Knowledge Base & Resource Engine.
 *
 * Shared vocabulary for the new Library module (`engine/library/*`,
 * `hooks/useLibraryBookmarks.js`, `components/library/*`, `pages/library/*`).
 * Kept as its own file (rather than extending `constants/knowledgeBaseConstants.js`)
 * because that file already backs the Sprint 21/22 per-subject Knowledge Base
 * tab and Master Index — a different feature with its own category shape.
 * This module reuses the same category *labels* so the two stay visually
 * consistent, but owns its own key order/meta so neither feature has to
 * change when the other evolves.
 */

export const LIBRARY_CATEGORY_ORDER = [
  'books',
  'solutionManuals',
  'formulaSheets',
  'memorySheets',
  'notes',
  'videos',
  'researchPapers',
  'conceptualResources',
  'assets',
  'pyqs',
]

export const LIBRARY_CATEGORY_META = {
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
  // Sprint 24 explicitly scopes PYQs as a placeholder-only category here —
  // the real PYQ engine (progress, revision queue, notes) already lives at
  // /pyqs and is out of scope for this sprint.
  pyqs: { label: 'PYQs', singular: 'PYQ', icon: FlaskConical, placeholderOnly: true },
}

/** Category that is fully populated from books.json in this sprint. */
export const ACTIVE_LIBRARY_CATEGORY = 'books'

export const LIBRARY_PRIORITY_ORDER = ['Essential', 'High', 'Medium', 'Reference']
export const DEFAULT_LIBRARY_PRIORITY = 'Medium'

export const LIBRARY_SORT_OPTIONS = [
  { key: 'title-asc', label: 'Title (A–Z)' },
  { key: 'title-desc', label: 'Title (Z–A)' },
  { key: 'priority', label: 'Priority' },
  { key: 'subject', label: 'Subject' },
  { key: 'author', label: 'Author' },
]

export const DEFAULT_LIBRARY_SORT = 'title-asc'

/** Fallback bucket for resources whose subject didn't match any known Knowledge Base subject. */
export const UNASSIGNED_SUBJECT_ID = 'unassigned'
export const UNASSIGNED_SUBJECT_NAME = 'Unassigned'
