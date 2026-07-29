import { useMemo, useState } from 'react'
import { Link2 } from 'lucide-react'
import { useStudyTimer } from '../../context/StudyTimerContext'
import { topicTree } from '../../engine/topics'
import { getSubjectsFromTree, getChaptersForSubject, getTopicsForChapter } from '../../engine/topics/topicNavigationService'

const selectClasses =
  'rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-2.5 py-1.5 text-xs text-[#e8e8e8] outline-none transition-colors duration-150 focus:border-[#0e639c]'

/**
 * TOPIC LINK SELECTOR
 * ====================
 * Sprint 27 — Study Engine & Today's Mission.
 *
 * Lets a session be linked to a real Topic Index record (Subject -> Chapter
 * -> Topic, from `engine/topics`) before it starts, so
 * `SessionResourceLinks.jsx` can surface that topic's mapped resources.
 * The Topic Index ships empty until a future sprint populates
 * `pyq_index.json`'s `topics` array — this degrades gracefully to plain
 * text fields when there's nothing to pick from, per "no hardcoded
 * resources / never crash on missing metadata".
 */
export default function TopicLinkSelector() {
  const { status, subject, chapter, task, setTopic } = useStudyTimer()
  const isIdle = status === 'idle'

  const subjects = useMemo(() => getSubjectsFromTree(topicTree), [])
  const hasTopicIndex = subjects.length > 0

  const [subjectId, setSubjectId] = useState('')
  const [chapterSlug, setChapterSlug] = useState('')

  const chapters = useMemo(() => (subjectId ? getChaptersForSubject(topicTree, subjectId) : []), [subjectId])
  const topics = useMemo(
    () => (subjectId && chapterSlug ? getTopicsForChapter(topicTree, subjectId, chapterSlug) : []),
    [subjectId, chapterSlug],
  )

  if (!isIdle) return null

  const handleTopicSelect = (topicId) => {
    const topic = topics.find((t) => t.id === topicId)
    if (!topic) return
    setTopic({ subject: topic.subject, chapter: topic.chapter, task: topic.name, topicId: topic.id })
  }

  const handleManualChange = (field) => (event) => {
    setTopic({ subject, chapter, task, [field]: event.target.value })
  }

  return (
    <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4 transition-colors duration-150">
      <h2 className="flex items-center gap-1.5 text-sm font-semibold text-[#e8e8e8]">
        <Link2 size={14} strokeWidth={1.75} />
        Link Session to a Topic
      </h2>

      {hasTopicIndex ? (
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <select
            value={subjectId}
            onChange={(e) => {
              setSubjectId(e.target.value)
              setChapterSlug('')
            }}
            className={selectClasses}
          >
            <option value="">Select subject...</option>
            {subjects.map((s) => (
              <option key={s.subjectId} value={s.subjectId}>
                {s.subjectName}
              </option>
            ))}
          </select>

          <select value={chapterSlug} onChange={(e) => setChapterSlug(e.target.value)} disabled={!subjectId} className={selectClasses}>
            <option value="">Select chapter...</option>
            {chapters.map((c) => (
              <option key={c.chapterSlug} value={c.chapterSlug}>
                {c.chapterName}
              </option>
            ))}
          </select>

          <select onChange={(e) => handleTopicSelect(e.target.value)} disabled={!chapterSlug} className={selectClasses}>
            <option value="">Select topic...</option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          <input
            type="text"
            value={subject === 'Not Selected' ? '' : subject}
            onChange={handleManualChange('subject')}
            placeholder="Subject"
            className={selectClasses}
          />
          <input
            type="text"
            value={chapter === 'None' ? '' : chapter}
            onChange={handleManualChange('chapter')}
            placeholder="Chapter"
            className={selectClasses}
          />
          <input
            type="text"
            value={task === 'No active task' ? '' : task}
            onChange={handleManualChange('task')}
            placeholder="Topic / Task"
            className={selectClasses}
          />
        </div>
      )}
    </section>
  )
}
