export function normalizeVideoUrl(url) {
  if (typeof url !== 'string') return ''
  const trimmed = url.trim()
  if (!trimmed) return ''
  return trimmed
}

export function parseYouTubeUrl(url) {
  if (typeof url !== 'string') return null

  const trimmed = normalizeVideoUrl(url)
  if (!trimmed) return null

  try {
    const parsedUrl = new URL(trimmed)
    const videoId =
      parsedUrl.searchParams.get('v') ||
      parsedUrl.searchParams.get('vi') ||
      parsedUrl.pathname.match(/\/embed\/([A-Za-z0-9_-]{11})/)?.[1] ||
      parsedUrl.pathname.match(/\/shorts\/([A-Za-z0-9_-]{11})/)?.[1] ||
      parsedUrl.pathname.match(/\/([A-Za-z0-9_-]{11})/)?.[1] ||
      trimmed.match(/(?:youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{11})/)?.[1] ||
      null

    if (!videoId) return null

    const playlistId = parsedUrl.searchParams.get('list') || trimmed.match(/[?&]list=([A-Za-z0-9_-]+)/)?.[1] || null
    const params = new URLSearchParams()
    if (playlistId) params.set('list', playlistId)
    params.set('rel', '0')
    params.set('modestbranding', '1')
    params.set('playsinline', '1')

    return {
      videoId,
      playlistId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`,
    }
  } catch {
    const fallbackMatch = trimmed.match(/(?:v=|vi=|youtu\.be\/|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/)
    const videoId = fallbackMatch?.[1] ?? null
    if (!videoId) return null

    const playlistId = trimmed.match(/[?&]list=([A-Za-z0-9_-]+)/)?.[1] || null
    const params = new URLSearchParams()
    if (playlistId) params.set('list', playlistId)
    params.set('rel', '0')
    params.set('modestbranding', '1')
    params.set('playsinline', '1')

    return {
      videoId,
      playlistId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`,
    }
  }
}

export function buildYouTubeEmbedUrl(url, startSeconds = null) {
  const parsed = parseYouTubeUrl(url)
  if (!parsed) return url

  const candidateStart = (() => {
    if (typeof startSeconds === 'number' && Number.isFinite(startSeconds)) {
      return Math.max(0, Math.floor(startSeconds))
    }

    try {
      const raw = new URL(normalizeVideoUrl(url))
      const value = raw.searchParams.get('t') ?? raw.searchParams.get('start') ?? null
      if (!value) return null
      return Number.parseInt(String(value).replace(/[^0-9]/g, ''), 10)
    } catch {
      const shortMatch = normalizeVideoUrl(url).match(/[?&](?:t|start)=(\d+)/)
      return shortMatch ? Number.parseInt(shortMatch[1], 10) : null
    }
  })()

  const params = new URLSearchParams()
  if (Number.isFinite(candidateStart) && candidateStart >= 0) {
    params.set('start', String(candidateStart))
  }

  const parsedParams = new URLSearchParams(parsed.embedUrl.split('?')[1] || '')
  parsedParams.delete('t')
  parsedParams.delete('start')

  for (const [key, value] of parsedParams.entries()) {
    if (value) params.set(key, value)
  }

  const queryString = params.toString()
  return `https://www.youtube-nocookie.com/embed/${parsed.videoId}${queryString ? `?${queryString}` : ''}`
}

export function getProgressStorageKey(subject, chapter, videoId) {
  return `physicsOS.videoProgress.${String(subject ?? '').trim()}.${String(chapter ?? '').trim()}.${String(videoId ?? '').trim()}`
}

export function readVideoProgress(subject, chapter, videoId) {
  const key = getProgressStorageKey(subject, chapter, videoId)
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function writeVideoProgress(subject, chapter, videoId, updates) {
  const key = getProgressStorageKey(subject, chapter, videoId)
  const current = readVideoProgress(subject, chapter, videoId) ?? {
    videoId,
    subject: String(subject ?? ''),
    chapter: String(chapter ?? ''),
    watchedSeconds: 0,
    completed: false,
    lastUpdatedAt: Date.now(),
  }

  const next = {
    ...current,
    ...updates,
    videoId,
    subject: String(subject ?? ''),
    chapter: String(chapter ?? ''),
    lastUpdatedAt: Date.now(),
  }

  try {
    localStorage.setItem(key, JSON.stringify(next))
  } catch {
    // Ignore storage errors; the app should keep working without persistence.
  }

  return next
}

export function getVideoCompletionThreshold(videoLengthSeconds) {
  if (!Number.isFinite(videoLengthSeconds) || videoLengthSeconds <= 0) return 0.8
  return videoLengthSeconds > 1800 ? 0.7 : 0.8
}
