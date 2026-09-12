import blueprintJSON from './blueprint/jestBlueprint.json' with { type: 'json' }

export const EXAM_SCOPE_VALUES = ['JAM_CORE', 'JAM_JEST', 'JEST_EDGE']

export function canonicalizeExamScope(value) {
  const scope = String(value ?? '').trim()

  if (!scope) return 'JAM_JEST'
  const normalized = scope.toUpperCase().replace(/\s+/g, '_')

  if (normalized.includes('JAM_JEST') || normalized.includes('JAM+JEST') || normalized.includes('JAM_JEST_OVERLAP')) {
    return 'JAM_JEST'
  }

  if (normalized.includes('JEST_EDGE') || normalized.includes('JEST-EDGE') || normalized.includes('JEST_EDGE_ADVANCED')) {
    return 'JEST_EDGE'
  }

  if (normalized.includes('JAM_CORE') || normalized.includes('JAM') || normalized.includes('JAM_ONLY') || normalized.includes('JAM_PARTIAL')) {
    return 'JAM_CORE'
  }

  if (normalized.includes('JEST')) {
    return 'JEST_EDGE'
  }

  return 'JAM_JEST'
}

export function getScopeBadgeLabel(scope) {
  switch (scope) {
    case 'JAM_CORE':
      return 'JAM Core'
    case 'JAM_JEST':
      return 'JAM + JEST'
    case 'JEST_EDGE':
      return 'JEST Edge'
    default:
      return 'JAM + JEST'
  }
}

function enrichTopic(topic, subject, chapter) {
  const scope = canonicalizeExamScope(topic.examScope ?? topic.exams ?? topic.exam ?? chapter.examScope ?? subject.examScope)
  return {
    ...topic,
    examScope: scope,
    bookRef: topic.bookReference ?? topic.bookRef ?? topic.book ?? '',
    subjectId: subject.id,
    subjectName: subject.name,
    chapterName: chapter.name,
    chapterSlug: chapter.slug,
  }
}

export function getSubjects() {
  return (blueprintJSON?.subjects ?? []).map((subject) => ({
    ...subject,
    id: subject.id ?? subject.name,
    examScope: canonicalizeExamScope(subject.examScope ?? subject.jamOverlap ?? 'JAM_JEST'),
    chapters: (subject.chapters ?? []).map((chapter) => ({
      ...chapter,
      examScope: canonicalizeExamScope(chapter.examScope ?? chapter.topics?.[0]?.examScope ?? chapter.topics?.[0]?.exams ?? subject.examScope ?? 'JAM_JEST'),
      topics: (chapter.topics ?? []).map((topic) => enrichTopic(topic, subject, chapter)),
    })),
  }))
}

export const subjects = getSubjects()

export function getTopicList() {
  return getSubjects().flatMap((subject) =>
    (subject.chapters ?? []).flatMap((chapter) => (chapter.topics ?? []).map((topic) => ({
      ...topic,
      subjectId: subject.id,
      subjectName: subject.name,
      chapterName: chapter.name,
      chapterSlug: chapter.slug,
    }))),
  )
}

export function getTopicById(topicId) {
  return getTopicList().find((topic) => topic.id === topicId || topic.slug === topicId) ?? null
}

export function getSubjectTopics(subjectId) {
  return getTopicList().filter((topic) => topic.subjectId === subjectId)
}

export function getBlueprintScopeSummary() {
  return {
    totalTopics: getTopicList().length,
    byScope: {
      JAM_CORE: getTopicList().filter((topic) => topic.examScope === 'JAM_CORE').length,
      JAM_JEST: getTopicList().filter((topic) => topic.examScope === 'JAM_JEST').length,
      JEST_EDGE: getTopicList().filter((topic) => topic.examScope === 'JEST_EDGE').length,
    },
  }
}

export function getBlueprintData() {
  return blueprintJSON
}
