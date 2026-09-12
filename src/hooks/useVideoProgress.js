import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  buildYouTubeEmbedUrl,
  getVideoCompletionThreshold,
  readVideoProgress,
  writeVideoProgress,
} from '../utils/videoProgress'

const DEFAULT_PROGRESS = {
  videoId: null,
  watchedSeconds: 0,
  completed: false,
  lastUpdatedAt: 0,
}

export function useVideoProgress({ subject, chapter, url, videoId, durationSeconds = null }) {
  const resolvedVideoId = videoId || (url ? url.match(/[?&]v=([A-Za-z0-9_-]{11})|youtu\.be\/([A-Za-z0-9_-]{11})/) : null)
  const finalVideoId = Array.isArray(resolvedVideoId) ? resolvedVideoId.find(Boolean) : resolvedVideoId

  const [progress, setProgress] = useState(() => {
    if (!subject || !chapter || !finalVideoId) return DEFAULT_PROGRESS
    return readVideoProgress(subject, chapter, finalVideoId) ?? DEFAULT_PROGRESS
  })

  const progressRef = useRef(progress)
  const completionThreshold = useMemo(() => getVideoCompletionThreshold(Number(durationSeconds) || 0), [durationSeconds])

  useEffect(() => {
    progressRef.current = progress
  }, [progress])

  useEffect(() => {
    if (!subject || !chapter || !finalVideoId) {
      setProgress(DEFAULT_PROGRESS)
      return
    }

    const stored = readVideoProgress(subject, chapter, finalVideoId)
    setProgress(stored ?? DEFAULT_PROGRESS)
  }, [subject, chapter, finalVideoId])

  const updateProgress = useCallback((nextSeconds) => {
    if (!subject || !chapter || !finalVideoId) return null
    const safeNextSeconds = Math.max(0, Number(nextSeconds) || 0)
    const stored = readVideoProgress(subject, chapter, finalVideoId) ?? DEFAULT_PROGRESS
    const nextProgress = {
      ...stored,
      videoId: finalVideoId,
      subject,
      chapter,
      watchedSeconds: Math.max(stored.watchedSeconds ?? 0, safeNextSeconds),
      completed: (Number(stored.watchedSeconds ?? 0) >= (Number(durationSeconds) || 0) * completionThreshold) || Boolean(stored.completed),
      lastUpdatedAt: Date.now(),
    }

    if (safeNextSeconds > 0 && !stored.videoId) {
      nextProgress.completed = false
    }

    setProgress(nextProgress)
    writeVideoProgress(subject, chapter, finalVideoId, nextProgress)
    return nextProgress
  }, [subject, chapter, finalVideoId, durationSeconds, completionThreshold])

  const markCompleted = useCallback(() => {
    if (!subject || !chapter || !finalVideoId) return null
    const nextProgress = {
      videoId: finalVideoId,
      subject,
      chapter,
      watchedSeconds: Number(durationSeconds) || progressRef.current.watchedSeconds || 0,
      completed: true,
      lastUpdatedAt: Date.now(),
    }
    setProgress(nextProgress)
    writeVideoProgress(subject, chapter, finalVideoId, nextProgress)
    return nextProgress
  }, [subject, chapter, finalVideoId, durationSeconds])

  const embedUrl = useMemo(() => {
    if (!url) return ''
    return buildYouTubeEmbedUrl(url)
  }, [url])

  return {
    videoId: finalVideoId,
    progress,
    embedUrl,
    completionThreshold,
    updateProgress,
    markCompleted,
  }
}

export default useVideoProgress
