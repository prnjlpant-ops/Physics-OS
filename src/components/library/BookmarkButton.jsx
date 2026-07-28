import { Bookmark } from 'lucide-react'

/**
 * Sprint 24 — matches `components/resources/FavoriteButton.jsx`'s visual
 * language so bookmarking feels the same everywhere in the app, backed
 * here by `hooks/useLibraryBookmarks.js` (StorageService) instead of that
 * component's plain-localStorage favorites.
 */
export default function BookmarkButton({ active, onToggle, size = 14 }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={active ? 'Remove bookmark' : 'Add bookmark'}
      aria-pressed={active}
      className={[
        'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border transition-colors duration-150',
        active
          ? 'border-[#e2c08d]/40 bg-[#e2c08d]/10 text-[#e2c08d]'
          : 'border-[#3c3c3c] bg-transparent text-[#858585] hover:border-[#4a4a4a] hover:text-[#cccccc]',
      ].join(' ')}
    >
      <Bookmark size={size} strokeWidth={1.75} fill={active ? 'currentColor' : 'none'} />
    </button>
  )
}
