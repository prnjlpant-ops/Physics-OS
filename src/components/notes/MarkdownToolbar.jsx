import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  CheckSquare,
  Code,
  Table,
  Quote,
  Minus,
  Sigma,
  Image,
} from 'lucide-react'
import { MARKDOWN_TOOLBAR_ACTIONS } from '../../constants/notesConstants'

const ICONS = {
  h1: Heading1,
  h2: Heading2,
  h3: Heading3,
  bold: Bold,
  italic: Italic,
  bulleted: List,
  numbered: ListOrdered,
  checklist: CheckSquare,
  code: Code,
  table: Table,
  quote: Quote,
  hr: Minus,
  math: Sigma,
  image: Image,
}

export default function MarkdownToolbar({ onAction, disabled = false }) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-[#3c3c3c] bg-[#1e1e1e] px-2 py-1.5 print:hidden">
      {MARKDOWN_TOOLBAR_ACTIONS.map((action) => {
        const Icon = ICONS[action.key]
        return (
          <button
            key={action.key}
            type="button"
            title={action.label}
            aria-label={action.label}
            disabled={disabled}
            onClick={() => onAction(action)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[#858585] transition-colors duration-150 hover:bg-[#2d2d2d] hover:text-[#cccccc] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon size={14} strokeWidth={1.75} />
          </button>
        )
      })}
    </div>
  )
}
