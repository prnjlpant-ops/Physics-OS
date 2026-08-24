import rawIndex from '../../data/pyq/imported/pyq_index.json'
import rawAssets from '../../data/pyq/pyq_assets.json'
import roadmapIndex from '../../data/pyq/pyq_roadmap_index.json'

function flatten(node, results = []) {
  if (Array.isArray(node)) {
    node.forEach((item) => { if (item?.paperId && item?.questionNumber != null) results.push({ ...item, id: `${item.paperId}_q${item.questionNumber}` }) })
  } else if (node && typeof node === 'object') Object.values(node).forEach((value) => flatten(value, results))
  return results
}

const questions = flatten(rawIndex).map((question) => {
  const asset = rawAssets[question.id]
  return {
    ...question,
    asset,
    questionImageUrl: asset?.questionImage ? `/${asset.questionImage}` : null,
    ocrText: asset?.ocrText ?? null,
  }
})

export function getQuestionBank(filters = {}) {
  return questions.filter((question) => {
    if (filters.exam && filters.exam !== 'all' && question.exam !== filters.exam) return false
    if (filters.subject && filters.subject !== 'all' && question.subject !== filters.subject) return false
    if (filters.difficulty && filters.difficulty !== 'all' && question.difficulty !== filters.difficulty) return false
    if (filters.roadmapChapterId && !question.asset?.roadmapChapterIds?.includes(filters.roadmapChapterId)) return false
    const query = filters.query?.trim().toLowerCase()
    return !query || `${question.chapter} ${question.topic} ${question.subtopic} ${(question.conceptTags ?? []).join(' ')}`.toLowerCase().includes(query)
  })
}

export function getQuestionBankStats() {
  return { total: questions.length, subjects: new Set(questions.map((item) => item.subject)).size, papers: new Set(questions.map((item) => item.paperId)).size }
}

export function getQuestionById(questionId) {
  return questions.find((question) => question.id === questionId) ?? null
}

export function getAdjacentQuestionIds(questionId) {
  const index = questions.findIndex((question) => question.id === questionId)
  if (index === -1) return { previous: null, next: null }
  return { previous: questions[index - 1]?.id ?? null, next: questions[index + 1]?.id ?? null }
}

export function getRoadmapChapterIdForTopic(topic) {
  if (!topic) return null
  const normalize = (value) => String(value ?? '').trim().toLowerCase()
  const words = (value) => new Set(normalize(value).replace(/[^a-z0-9]+/g, ' ').split(' ').filter((word) => word.length > 3))
  const name = normalize(topic.name)
  const subject = normalize(topic.subjectName ?? topic.subject)
  const chapter = normalize(topic.chapterName ?? topic.chapter)
  const targetWords = words(`${topic?.metadata?.chapterName ?? ''} ${topic.name ?? ''}`)
  const rankedChapter = roadmapIndex.chapters.map((entry) => ({ entry, score: [...targetWords].filter((word) => words(`${entry.title} ${entry.subtopics.join(' ')}`).has(word)).length }))
    .sort((left, right) => right.score - left.score)[0]
  const roadmapChapter = roadmapIndex.chapters.find((entry) => entry.id === topic?.metadata?.chapterSlug)
    ?? (rankedChapter?.score >= 2 ? rankedChapter.entry : null)
  return roadmapChapter?.id ?? null
}

export function getQuestionsForTopic(topic, limit = 12) {
  if (!topic) return []
  const normalize = (value) => String(value ?? '').trim().toLowerCase()
  const name = normalize(topic.name)
  const subject = normalize(topic.subjectName ?? topic.subject)
  const chapter = normalize(topic.chapterName ?? topic.chapter)
  const roadmapChapterId = getRoadmapChapterIdForTopic(topic)
  const roadmapIds = roadmapChapterId ? [roadmapChapterId] : []
  return questions.filter((question) => {
    if (roadmapIds.length && question.asset?.roadmapChapterIds?.some((id) => roadmapIds.includes(id))) return true
    const haystack = [question.topic, question.subtopic, question.chapter].map(normalize)
    return (name && haystack.some((value) => value === name || value.includes(name) || name.includes(value)))
      || (subject && chapter && normalize(question.subject) === subject && normalize(question.chapter) === chapter)
  }).slice(0, limit)
}
