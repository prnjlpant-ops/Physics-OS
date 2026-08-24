import { LIBRARY_CATEGORY_META } from '../../constants/libraryConstants'
import { createLibraryResource } from './libraryModel'

/**
 * Turns the explicit roadmap video links into Library resources.  The
 * roadmap id is deliberately the video id: Topic Index records already use
 * that id in `relatedVideos`, so no title matching is needed.
 */
export function parseRoadmapVideos(roadmapTopics = []) {
  return roadmapTopics
    .map((topic) => {
      const url = topic.video?.match(/https?:\/\/\S+/i)?.[0]?.replace(/[),.;]+$/, '') ?? null
      if (!url) return null

      const source = topic.video.split('—')[0].trim() || 'Video link'
      return createLibraryResource({
        id: topic.id,
        category: LIBRARY_CATEGORY_META.videos.label,
        categoryKey: 'videos',
        title: `${source} — ${topic.title.replace(/`\[[^\]]+\]`/g, '').trim()}`,
        author: source,
        subjectId: null,
        subjectName: null,
        description: topic.videoDepthNote || '',
        status: 'Available',
        url,
      })
    })
    .filter(Boolean)
}
