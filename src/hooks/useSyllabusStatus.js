import { useCallback, useEffect, useState } from 'react'
import { TOPIC_STATUS } from '../constants/syllabusConstants'
import { getAllTopics } from '../data/syllabusData'

const STATUS_STORAGE_KEY = 'physicsOS.syllabusTopicStatus'
export const SYLLABUS_STATUS_EVENT = 'physicsOS.syllabusTopicStatusChanged'

function readStatusMap() {
  try {
    const raw = localStorage.getItem(STATUS_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeStatusMap(map) {
  try {
    localStorage.setItem(STATUS_STORAGE_KEY, JSON.stringify(map))
    window.dispatchEvent(new Event(SYLLABUS_STATUS_EVENT))
  } catch {
    // Local storage unavailable or full; status won't persist, fail silently.
  }
}

/**
 * Local-first status tracker for Syllabus Topics (Not Started / Reading /
 * Problem Solving / Revision / Mastered). A user-set status overrides the
 * topic's placeholder default until changed again. No backend, no
 * scheduling — purely a manual self-report used to drive the Progress
 * feature and Explorer filters.
 */
export function useSyllabusStatus() {
  const [overrides, setOverrides] = useState(readStatusMap)

  useEffect(() => {
    const sync = () => setOverrides(readStatusMap())
    window.addEventListener(SYLLABUS_STATUS_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(SYLLABUS_STATUS_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const getStatus = useCallback(
    (topic) => overrides[topic.id] ?? topic.metadata.status ?? TOPIC_STATUS.NOT_STARTED,
    [overrides],
  )

  const setStatus = useCallback((topicId, status) => {
    setOverrides((prev) => {
      const selected = getAllTopics().find((topic) => topic.id === topicId)
      const sameTopicIds = selected
        ? getAllTopics()
            .filter((topic) => topic.metadata.subjectId === selected.metadata.subjectId
              && topic.metadata.chapterSlug === selected.metadata.chapterSlug
              && (topic.metadata.resourceId || topic.name) === (selected.metadata.resourceId || selected.name))
            .map((topic) => topic.id)
        : [topicId]
      const next = { ...prev }
      sameTopicIds.forEach((id) => { next[id] = status })
      writeStatusMap(next)
      return next
    })
  }, [])

  return { overrides, getStatus, setStatus }
}
