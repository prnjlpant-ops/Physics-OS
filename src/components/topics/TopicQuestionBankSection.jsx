import { Link } from 'react-router-dom'
import { BookOpen, ChevronRight } from 'lucide-react'
import { getQuestionsForTopic } from '../../engine/pyq/questionBankService'

export default function TopicQuestionBankSection({ topic }) {
  const questions = getQuestionsForTopic(topic)

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-4">
      <div className="flex items-center justify-between gap-3"><div><h3 className="text-sm font-semibold text-[#e8e8e8]">Question Bank</h3><p className="mt-0.5 text-[11px] text-[#858585]">GATE PYQs matched to this topic.</p></div><Link to="/pyqs/practice" className="text-xs text-[#4fc1ff] hover:text-[#9cdcfe]">All questions</Link></div>
      {questions.length === 0 ? <p className="text-[11px] leading-relaxed text-[#6e6e6e]">No direct PYQ match yet. Add or refine the topic name in the PYQ index as you expand the bank.</p> : <div className="grid gap-2 sm:grid-cols-2">{questions.map((question) => <Link key={question.id} to={`/pyqs/practice/${question.id}`} className="group flex items-center justify-between gap-2 rounded-md border border-[#3c3c3c] bg-[#1e1e1e] px-3 py-2 text-xs transition-colors hover:border-[#4a4a4a]"><span className="min-w-0"><span className="font-medium text-[#cccccc]">GATE {question.year} · Q{question.questionNumber}</span><span className="mt-0.5 block truncate text-[10px] text-[#858585]">{question.subtopic}</span></span><ChevronRight size={14} className="shrink-0 text-[#858585] group-hover:text-[#4fc1ff]" /></Link>)}</div>}
      {questions.length > 0 && <p className="inline-flex items-center gap-1 text-[10px] text-[#6e6e6e]"><BookOpen size={12} />Open a question to view the extracted paper image and OCR text.</p>}
    </section>
  )
}
