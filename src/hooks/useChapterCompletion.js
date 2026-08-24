import { useCallback, useEffect, useState } from 'react'

const KEY = 'physicsOS.chapterCompletion'
const EVENT = 'physicsOS.chapterCompletionChanged'

function read() {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}

export default function useChapterCompletion(chapterId) {
  const [completed, setCompleted] = useState(() => Boolean(read()[chapterId]))

  useEffect(() => {
    const sync = () => setCompleted(Boolean(read()[chapterId]))
    window.addEventListener(EVENT, sync)
    window.addEventListener('storage', sync)
    return () => { window.removeEventListener(EVENT, sync); window.removeEventListener('storage', sync) }
  }, [chapterId])

  const toggle = useCallback(() => {
    const next = !completed
    const all = read()
    all[chapterId] = next
    localStorage.setItem(KEY, JSON.stringify(all))
    window.dispatchEvent(new Event(EVENT))
    setCompleted(next)
  }, [chapterId, completed])

  return { completed, toggle }
}
