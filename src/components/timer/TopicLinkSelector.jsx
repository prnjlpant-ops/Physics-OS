import { Link2 } from 'lucide-react'
import { useStudyTimer } from '../../context/StudyTimerContext'
import TopicCascadeSelect from './TopicCascadeSelect'

/** Timer-specific wrapper around the shared controlled topic cascade. */
export default function TopicLinkSelector() {
  const { status, subject, chapter, task, topicId, setTopic } = useStudyTimer()
  if (status !== 'idle') return null

  return <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-4 transition-colors duration-150">
    <h2 className="flex items-center gap-1.5 text-sm font-semibold text-[#e8e8e8]"><Link2 size={14} strokeWidth={1.75} />Link Session to a Topic</h2>
    <div className="mt-3"><TopicCascadeSelect value={{ subject, chapter, task, topicId }} onChange={setTopic} /></div>
  </section>
}
