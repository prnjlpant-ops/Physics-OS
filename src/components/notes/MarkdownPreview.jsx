import { useMemo } from 'react'
import { renderMarkdown } from '../../utils/markdownRenderer'

export default function MarkdownPreview({ content }) {
  const html = useMemo(() => renderMarkdown(content), [content])

  return (
    <div
      className="md-preview h-full overflow-y-auto px-4 py-3 text-sm leading-relaxed text-[#cccccc]"
      dangerouslySetInnerHTML={{ __html: html || '<p class="text-[#6e6e6e]">Nothing to preview yet.</p>' }}
    />
  )
}
