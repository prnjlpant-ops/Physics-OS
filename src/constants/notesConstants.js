export const EDITOR_VIEW_MODES = {
  EDITOR: 'editor',
  SPLIT: 'split',
  PREVIEW: 'preview',
}

export const AUTOSAVE_DELAY_MS = 600

export const MARKDOWN_TOOLBAR_ACTIONS = [
  { key: 'h1', label: 'Heading 1', shortcut: '#', before: '# ', after: '', block: true },
  { key: 'h2', label: 'Heading 2', shortcut: '##', before: '## ', after: '', block: true },
  { key: 'h3', label: 'Heading 3', shortcut: '###', before: '### ', after: '', block: true },
  { key: 'bold', label: 'Bold', before: '**', after: '**' },
  { key: 'italic', label: 'Italic', before: '*', after: '*' },
  { key: 'bulleted', label: 'Bullet List', before: '- ', after: '', block: true },
  { key: 'numbered', label: 'Numbered List', before: '1. ', after: '', block: true },
  { key: 'checklist', label: 'Checklist', before: '- [ ] ', after: '', block: true },
  { key: 'code', label: 'Code Block', before: '```\n', after: '\n```', block: true },
  { key: 'table', label: 'Table', before: '| Col A | Col B |\n| --- | --- |\n| Value | Value |', after: '', block: true },
  { key: 'quote', label: 'Block Quote', before: '> ', after: '', block: true },
  { key: 'hr', label: 'Horizontal Line', before: '\n---\n', after: '', block: true },
  { key: 'math', label: 'Equation', before: '$', after: '$' },
  { key: 'image', label: 'Image', before: '![alt text](', after: ')' },
]

export const NOTES_FILTER_OPTIONS = {
  RECENTLY_EDITED: 'recentlyEdited',
  BOOKMARKED: 'bookmarked',
  ALL: 'all',
}

export const REVISION_STATUS = {
  NONE: 'No Notes',
  FRESH: 'Fresh',
  DUE: 'Due for Revision',
}

const REVISION_DUE_DAYS = 14

export function getRevisionStatus(lastEditedIso) {
  if (!lastEditedIso) return REVISION_STATUS.NONE
  const daysSince = (Date.now() - new Date(lastEditedIso).getTime()) / (1000 * 60 * 60 * 24)
  return daysSince > REVISION_DUE_DAYS ? REVISION_STATUS.DUE : REVISION_STATUS.FRESH
}
