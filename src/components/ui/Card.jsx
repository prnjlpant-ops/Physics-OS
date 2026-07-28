/**
 * CARD
 * ====
 * Sprint 0 — Foundation.
 *
 * Reusable card container matching the bordered panel style already used
 * everywhere (border-[#3c3c3c], bg-[#252526]/bg-[#2d2d2d], rounded-lg).
 * Existing feature-specific cards (e.g. `pages/subject/ChapterCard.jsx`)
 * are left as-is this sprint.
 */
export default function Card({ children, className = '', as: Component = 'div', ...rest }) {
  return (
    <Component
      className={`rounded-lg border border-[#3c3c3c] bg-[#252526] p-4 ${className}`}
      {...rest}
    >
      {children}
    </Component>
  )
}
