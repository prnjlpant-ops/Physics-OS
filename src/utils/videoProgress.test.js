import test from 'node:test'
import assert from 'node:assert/strict'

import {
  buildYouTubeEmbedUrl,
  getProgressStorageKey,
  normalizeVideoUrl,
  parseYouTubeUrl,
} from './videoProgress.js'

test('parseYouTubeUrl extracts the video and playlist ids from a watch URL', () => {
  const result = parseYouTubeUrl('https://www.youtube.com/watch?v=abcd1234XYZ&list=PL123xyz')

  assert.deepEqual(result, {
    videoId: 'abcd1234XYZ',
    playlistId: 'PL123xyz',
    embedUrl: 'https://www.youtube-nocookie.com/embed/abcd1234XYZ?list=PL123xyz&rel=0&modestbranding=1&playsinline=1',
  })
})

test('buildYouTubeEmbedUrl rewrites a normal YouTube URL to the no-ads embed format', () => {
  const url = buildYouTubeEmbedUrl('https://youtu.be/abcd1234XYZ?t=30')
  assert.equal(url, 'https://www.youtube-nocookie.com/embed/abcd1234XYZ?start=30&rel=0&modestbranding=1&playsinline=1')
})

test('normalizeVideoUrl handles playlist and embed URL variants consistently', () => {
  assert.equal(normalizeVideoUrl('https://www.youtube.com/watch?v=abcd1234XYZ'), 'https://www.youtube.com/watch?v=abcd1234XYZ')
  assert.equal(normalizeVideoUrl('https://www.youtube.com/embed/abcd1234XYZ?autoplay=1'), 'https://www.youtube.com/embed/abcd1234XYZ?autoplay=1')
})

test('getProgressStorageKey is stable per video and chapter', () => {
  assert.equal(
    getProgressStorageKey('Mathematical Methods', 'Vector Calculus & Linear Algebra', 'abcd1234XYZ'),
    'physicsOS.videoProgress.Mathematical Methods.Vector Calculus & Linear Algebra.abcd1234XYZ',
  )
})
