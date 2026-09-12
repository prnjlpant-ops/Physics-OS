import { useMemo, useState } from 'react'
import BookDetailDrawer from './BookDetailDrawer'

const SPINE_COLORS = {
  Boas: 'linear-gradient(180deg, #7a1f2a 0%, #4a0d15 100%)',
  Kleppner: 'linear-gradient(180deg, #1d3557 0%, #0d1b2a 100%)',
  Griffiths: 'linear-gradient(180deg, #1d4d3f 0%, #12352c 100%)',
  Zettili: 'linear-gradient(180deg, #4c2d6a 0%, #2b153d 100%)',
  Kittel: 'linear-gradient(180deg, #9a6a17 0%, #533d0b 100%)',
  default: 'linear-gradient(180deg, #3a3f4d 0%, #1e2430 100%)',
}

function shelfColorFor(book) {
  const title = String(book?.title ?? '')
  const author = String(book?.author ?? '')
  const haystack = `${title} ${author}`.toLowerCase()
  if (haystack.includes('boas')) return SPINE_COLORS.Boas
  if (haystack.includes('kleppner')) return SPINE_COLORS.Kleppner
  if (haystack.includes('griffiths')) return SPINE_COLORS.Griffiths
  if (haystack.includes('zettili')) return SPINE_COLORS.Zettili
  if (haystack.includes('kittel')) return SPINE_COLORS.Kittel
  return SPINE_COLORS.default
}

export default function BookShelf({ books = [] }) {
  const [selectedBook, setSelectedBook] = useState(null)

  const safeBooks = useMemo(() => books.filter(Boolean), [books])

  return (
    <div className="rounded-xl border border-[#3a3a3a] bg-[#151821] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.14em] text-[#7dd3fc]">LIBRARY BOOKSHELF</p>
        <span className="text-[10px] text-[#94a3b8]">{safeBooks.length} titles</span>
      </div>

      <div className="relative overflow-x-auto rounded-lg border border-[#2b2f3b] bg-[linear-gradient(180deg,#2a261b_0%,#201d18_28%,#151821_29%,#111827_100%)] px-3 pb-2 pt-4">
        <div className="flex min-h-[150px] items-end gap-3 border-b border-[#d4af37]/40 pb-3">
          {safeBooks.length ? (
            safeBooks.map((book, index) => (
              <button
                key={book.id ?? `${book.title}-${index}`}
                type="button"
                onClick={() => setSelectedBook(book)}
                className="group relative flex h-[140px] w-[36px] shrink-0 cursor-pointer items-center justify-center rounded-t-[6px] border border-white/10 shadow-[0_10px_20px_rgba(0,0,0,0.35)] transition duration-200 hover:-translate-y-2 hover:shadow-[0_18px_28px_rgba(0,0,0,0.42)]"
                style={{ background: shelfColorFor(book) }}
                aria-label={`Open details for ${book.title}`}
              >
                <span
                  className="absolute inset-0 rounded-t-[6px] border border-white/10"
                  style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07)' }}
                />
                <span
                  className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#f8e7a1]"
                  style={{
                    writingMode: 'vertical-rl',
                    transform: 'rotate(180deg)',
                    textShadow: '0 0 8px rgba(248,231,161,0.5)',
                  }}
                >
                  {book.title}
                </span>
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[6px] uppercase tracking-[0.08em] text-[#f8e7a1]/80">
                  {book.author?.split(' ')?.[0] ?? 'Ref'}
                </span>
              </button>
            ))
          ) : (
            <p className="py-8 text-sm text-[#a3b4c9]">No books mapped to this chapter yet.</p>
          )}
        </div>
      </div>

      {selectedBook && <BookDetailDrawer book={selectedBook} onClose={() => setSelectedBook(null)} />}
    </div>
  )
}
