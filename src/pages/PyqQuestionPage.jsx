import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, FileText } from 'lucide-react'
import { getAdjacentQuestionIds, getQuestionById } from '../engine/pyq/questionBankService'

export default function PyqQuestionPage() {
  const { questionId } = useParams()
  const question = getQuestionById(questionId)
  const [showText, setShowText] = useState(false)

  if (!question) return <div className="px-4 py-5 text-sm text-[#9d9d9d]">Question not found.</div>
  const { previous, next } = getAdjacentQuestionIds(questionId)

  return (
    <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <Link to="/pyqs/practice" className="inline-flex w-fit items-center gap-1.5 text-xs text-[#858585] hover:text-[#cccccc]"><ArrowLeft size={14} />Question bank</Link>
      <header className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[10px] uppercase tracking-wide text-[#858585]">{question.exam} {question.year} · Question {question.questionNumber}</p><h2 className="mt-1 text-lg font-semibold text-[#e8e8e8]">{question.subtopic}</h2><p className="mt-1 text-xs text-[#9d9d9d]">{question.subject} · {question.chapter} · {question.topic}</p></div><span className="rounded-full border border-[#3c3c3c] px-2 py-1 text-[10px] text-[#9d9d9d]">{question.difficulty}</span></header>
      {question.questionImageUrl ? <figure className="overflow-auto rounded-lg border border-[#3c3c3c] bg-white p-2"><img src={question.questionImageUrl} alt={`${question.exam} ${question.year} question ${question.questionNumber}`} className="mx-auto max-w-full" /></figure> : <p className="rounded-lg border border-dashed border-[#3c3c3c] p-6 text-sm text-[#858585]">No extracted image is available for this question.</p>}
      {question.ocrText && <section className="rounded-lg border border-[#3c3c3c] bg-[#252526]"><button type="button" onClick={() => setShowText((value) => !value)} className="flex w-full items-center justify-between px-4 py-3 text-left text-xs font-medium text-[#cccccc]"><span className="inline-flex items-center gap-1.5"><FileText size={14} />OCR text</span><span>{showText ? 'Hide' : 'Show'}</span></button>{showText && <pre className="max-h-96 overflow-auto whitespace-pre-wrap border-t border-[#3c3c3c] p-4 text-xs leading-relaxed text-[#bdbdbd]">{question.ocrText}</pre>}</section>}
      <footer className="flex flex-wrap justify-between gap-2"><Link to={previous ? `/pyqs/practice/${previous}` : '/pyqs/practice'} className="inline-flex items-center gap-1 rounded-md border border-[#3c3c3c] px-3 py-2 text-xs text-[#cccccc]"><ChevronLeft size={14} />Previous</Link><Link to={`/pyqs/${question.paperId}`} className="rounded-md border border-[#3c3c3c] px-3 py-2 text-xs text-[#cccccc]">Source paper · page {question.asset?.pageNumber}</Link><Link to={next ? `/pyqs/practice/${next}` : '/pyqs/practice'} className="inline-flex items-center gap-1 rounded-md border border-[#3c3c3c] px-3 py-2 text-xs text-[#cccccc]">Next<ChevronRight size={14} /></Link></footer>
    </div>
  )
}
