import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { BookOpen, ExternalLink } from 'lucide-react'
import { getQuestionBank, getQuestionBankStats } from '../engine/pyq/questionBankService'

export default function PyqPracticePage() {
  const [searchParams] = useSearchParams()
  const roadmapChapterId = searchParams.get('chapter') ?? ''
  const [query, setQuery] = useState('')
  const [exam, setExam] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [limit, setLimit] = useState(40)
  const results = useMemo(() => getQuestionBank({ query, exam, difficulty, roadmapChapterId }).slice(0, limit), [query, exam, difficulty, roadmapChapterId, limit])
  const stats = useMemo(getQuestionBankStats, [])
  return <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
    <div><Link to="/pyqs" className="text-xs text-[#858585] hover:text-[#cccccc]">← PYQ papers</Link><h2 className="mt-3 text-lg font-semibold text-[#e8e8e8]">Practice Question Bank</h2><p className="mt-1 text-xs text-[#858585]">{roadmapChapterId ? 'Topic-linked PYQs, ordered by your selected filters.' : `${stats.total} indexed PYQs across ${stats.papers} papers. Choose a question, then open its source paper to solve it.`}</p></div>
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search concepts or chapters…" className="rounded-md border border-[#3c3c3c] bg-[#252526] px-3 py-2 text-sm text-[#e8e8e8] outline-none focus:border-[#0e639c] sm:col-span-1" /><select value={exam} onChange={(event) => setExam(event.target.value)} className="rounded-md border border-[#3c3c3c] bg-[#252526] px-3 py-2 text-sm text-[#cccccc]"><option value="all">All exams</option><option>GATE</option><option>JEST</option><option>IIT JAM</option></select><select value={difficulty} onChange={(event) => setDifficulty(event.target.value)} className="rounded-md border border-[#3c3c3c] bg-[#252526] px-3 py-2 text-sm text-[#cccccc]"><option value="all">All difficulties</option><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">{results.map((question) => <article key={question.id} className="flex flex-col gap-3 rounded-lg border border-[#3c3c3c] bg-[#252526] p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-[10px] uppercase tracking-wide text-[#858585]">{question.exam} {question.year} · Q{question.questionNumber}</p><h3 className="mt-1 text-sm font-medium text-[#e8e8e8]">{question.subtopic}</h3></div><span className="rounded-full border border-[#3c3c3c] px-2 py-0.5 text-[10px] text-[#9d9d9d]">{question.difficulty}</span></div><p className="text-xs text-[#9d9d9d]"><span className="text-[#cccccc]">{question.subject}</span> · {question.chapter} · {question.topic}</p><div className="flex flex-wrap gap-1">{question.conceptTags?.map((tag) => <span key={tag} className="rounded-full border border-[#3c3c3c] px-2 py-0.5 text-[10px] text-[#858585]">{tag}</span>)}</div><Link to={`/pyqs/practice/${question.id}`} className="mt-auto inline-flex items-center gap-1.5 self-start text-xs text-[#4fc1ff] hover:text-[#9cdcfe]"><BookOpen size={13} />Open question <ExternalLink size={12} /></Link></article>)}</div>
    {results.length === 0 && <p className="rounded-lg border border-dashed border-[#3c3c3c] p-8 text-center text-sm text-[#858585]">No indexed questions match those filters.</p>}
    {results.length === limit && <button type="button" onClick={() => setLimit((value) => value + 40)} className="self-center rounded-md border border-[#3c3c3c] bg-[#252526] px-3 py-2 text-xs text-[#cccccc] hover:border-[#4a4a4a]">Show more questions</button>}
  </div>
}
