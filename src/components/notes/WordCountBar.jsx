import { useMemo } from 'react'
import { getWordStats } from '../../utils/markdownRenderer'

export default function WordCountBar({ content }) {
  const stats = useMemo(() => getWordStats(content), [content])

  return (
    <div className="flex items-center gap-3 text-[10px] text-[#6e6e6e]">
      <span>{stats.words} words</span>
      <span>{stats.characters} characters</span>
      <span>{stats.readingTime} read</span>
    </div>
  )
}
