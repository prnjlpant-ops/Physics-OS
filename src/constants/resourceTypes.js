import { Library, Video, FileText, BookMarked, FileStack, Link2 } from 'lucide-react'

export const RESOURCE_TYPE_ORDER = [
  'books',
  'videos',
]

export const RESOURCE_TYPE_META = {
  books: { label: 'Books', singular: 'Book', icon: Library },
  videos: { label: 'Videos', singular: 'Video', icon: Video },
  pdfs: { label: 'PDFs', singular: 'PDF', icon: FileText },
  solutionManuals: { label: 'Solution Manuals', singular: 'Solution Manual', icon: BookMarked },
  referenceMaterial: { label: 'Reference Material', singular: 'Reference', icon: FileStack },
  externalLinks: { label: 'External Links', singular: 'External Link', icon: Link2 },
}
