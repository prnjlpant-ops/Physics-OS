import { useMemo } from 'react'
import { topicTree } from '../../engine/topics'
import { getSubjectsFromTree, getChaptersForSubject, getTopicsForChapter } from '../../engine/topics/topicNavigationService'

const selectClasses = 'rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-1.5 text-xs text-[#e8e8e8] outline-none transition-colors duration-150 focus:border-[#0e639c]'

/** Controlled Subject -> Chapter -> Topic selector shared by session flows. */
export default function TopicCascadeSelect({ value, onChange }) {
  const subjects = useMemo(() => getSubjectsFromTree(topicTree), [])
  const selectedTopic = useMemo(
    () => subjects.flatMap((subject) => subject.chapters).flatMap((chapter) => chapter.topics).find((topic) => topic.id === value.topicId),
    [subjects, value.topicId],
  )
  const subjectId = selectedTopic?.subjectId ?? subjects.find((subject) => subject.subjectName === value.subject)?.subjectId ?? ''
  const chapters = useMemo(() => (subjectId ? getChaptersForSubject(topicTree, subjectId) : []), [subjectId])
  const chapterSlug = selectedTopic?.chapterSlug ?? chapters.find((chapter) => chapter.chapterName === value.chapter)?.chapterSlug ?? ''
  const topics = useMemo(() => (subjectId && chapterSlug ? getTopicsForChapter(topicTree, subjectId, chapterSlug) : []), [subjectId, chapterSlug])

  const selectSubject = (nextSubjectId) => {
    const subject = subjects.find((item) => item.subjectId === nextSubjectId)
    onChange({ subject: subject?.subjectName ?? '', chapter: '', task: '', topicId: '' })
  }
  const selectChapter = (nextChapterSlug) => {
    const chapter = chapters.find((item) => item.chapterSlug === nextChapterSlug)
    onChange({ subject: value.subject, chapter: chapter?.chapterName ?? '', task: '', topicId: '' })
  }
  const selectTopic = (nextTopicId) => {
    const topic = topics.find((item) => item.id === nextTopicId)
    if (!topic) return
    onChange({ subject: topic.subject, chapter: topic.chapter, task: topic.name, topicId: topic.id })
  }

  return <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
    <select value={subjectId} onChange={(event) => selectSubject(event.target.value)} className={selectClasses}>
      <option value="">Select subject...</option>
      {subjects.map((subject) => <option key={subject.subjectId} value={subject.subjectId}>{subject.subjectName}</option>)}
    </select>
    <select value={chapterSlug} onChange={(event) => selectChapter(event.target.value)} disabled={!subjectId} className={selectClasses}>
      <option value="">Select chapter...</option>
      {chapters.map((chapter) => <option key={chapter.chapterSlug} value={chapter.chapterSlug}>{chapter.chapterName}</option>)}
    </select>
    <select value={value.topicId ?? ''} onChange={(event) => selectTopic(event.target.value)} disabled={!chapterSlug} className={selectClasses}>
      <option value="">Select topic...</option>
      {topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.name}</option>)}
    </select>
  </div>
}
