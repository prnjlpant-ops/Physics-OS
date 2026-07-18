function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function renderInline(text) {
  let result = escapeHtml(text)

  // Math placeholder: $$...$$ or $...$
  result = result.replace(/\$\$(.+?)\$\$/g, '<span class="md-math">∑ $1</span>')
  result = result.replace(/\$(.+?)\$/g, '<span class="md-math">∑ $1</span>')

  // Image placeholder: ![alt](url)
  result = result.replace(
    /!\[([^\]]*)\]\(([^)]*)\)/g,
    '<span class="md-image-placeholder">🖼 Image: $1</span>',
  )

  // Inline code
  result = result.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Bold + italic
  result = result.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  result = result.replace(/\*(.+?)\*/g, '<em>$1</em>')

  return result
}

/**
 * Minimal, dependency-free markdown renderer covering the Notes editor
 * feature set: headings, bold/italic, lists, checklists, code blocks,
 * tables, block quotes, horizontal rules, and math/image placeholders.
 */
export function renderMarkdown(source) {
  if (!source) return ''

  const lines = source.replace(/\r\n/g, '\n').split('\n')
  const html = []

  let inCodeBlock = false
  let codeBuffer = []
  let listBuffer = []
  let listType = null
  let tableBuffer = []

  const flushList = () => {
    if (listBuffer.length === 0) return
    const tag = listType === 'ol' ? 'ol' : 'ul'
    html.push(`<${tag} class="md-list">${listBuffer.join('')}</${tag}>`)
    listBuffer = []
    listType = null
  }

  const flushTable = () => {
    if (tableBuffer.length === 0) return
    const [headerLine, alignLine, ...rows] = tableBuffer
    if (!alignLine || !/^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/.test(alignLine)) {
      tableBuffer.forEach((line) => html.push(`<p>${renderInline(line)}</p>`))
      tableBuffer = []
      return
    }
    const cells = (row) =>
      row
        .trim()
        .replace(/^\||\|$/g, '')
        .split('|')
        .map((cell) => cell.trim())

    const headerCells = cells(headerLine)
    html.push('<table class="md-table"><thead><tr>')
    headerCells.forEach((cell) => html.push(`<th>${renderInline(cell)}</th>`))
    html.push('</tr></thead><tbody>')
    rows.forEach((row) => {
      html.push('<tr>')
      cells(row).forEach((cell) => html.push(`<td>${renderInline(cell)}</td>`))
      html.push('</tr>')
    })
    html.push('</tbody></table>')
    tableBuffer = []
  }

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]

    if (/^\s*```/.test(line)) {
      if (inCodeBlock) {
        html.push(`<pre class="md-code"><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`)
        codeBuffer = []
        inCodeBlock = false
      } else {
        flushList()
        flushTable()
        inCodeBlock = true
      }
      continue
    }

    if (inCodeBlock) {
      codeBuffer.push(line)
      continue
    }

    if (/^\s*\|.*\|\s*$/.test(line)) {
      tableBuffer.push(line)
      continue
    }
    if (tableBuffer.length > 0) flushTable()

    if (/^\s*$/.test(line)) {
      flushList()
      continue
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/)
    if (heading) {
      flushList()
      const level = heading[1].length
      html.push(`<h${level} class="md-heading">${renderInline(heading[2])}</h${level}>`)
      continue
    }

    if (/^\s*(---|\*\*\*|___)\s*$/.test(line)) {
      flushList()
      html.push('<hr class="md-hr" />')
      continue
    }

    const blockquote = line.match(/^\s*>\s?(.*)$/)
    if (blockquote) {
      flushList()
      html.push(`<blockquote class="md-quote">${renderInline(blockquote[1])}</blockquote>`)
      continue
    }

    const checklist = line.match(/^\s*[-*]\s+\[( |x|X)\]\s+(.*)$/)
    if (checklist) {
      if (listType !== 'ul') flushList()
      listType = 'ul'
      const checked = checklist[1].toLowerCase() === 'x'
      listBuffer.push(
        `<li class="md-checklist-item"><input type="checkbox" disabled ${
          checked ? 'checked' : ''
        } /> <span>${renderInline(checklist[2])}</span></li>`,
      )
      continue
    }

    const ordered = line.match(/^\s*\d+[.)]\s+(.*)$/)
    if (ordered) {
      if (listType !== 'ol') flushList()
      listType = 'ol'
      listBuffer.push(`<li>${renderInline(ordered[1])}</li>`)
      continue
    }

    const bullet = line.match(/^\s*[-*]\s+(.*)$/)
    if (bullet) {
      if (listType !== 'ul') flushList()
      listType = 'ul'
      listBuffer.push(`<li>${renderInline(bullet[1])}</li>`)
      continue
    }

    flushList()
    html.push(`<p class="md-paragraph">${renderInline(line)}</p>`)
  }

  flushList()
  flushTable()
  if (inCodeBlock && codeBuffer.length > 0) {
    html.push(`<pre class="md-code"><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`)
  }

  return html.join('\n')
}

export function getWordStats(source) {
  const text = (source ?? '').trim()
  if (!text) return { words: 0, characters: 0, readingTime: '0 min' }

  const words = text.split(/\s+/).filter(Boolean).length
  const characters = source.length
  const minutes = Math.max(1, Math.round(words / 200))

  return { words, characters, readingTime: `${minutes} min` }
}
