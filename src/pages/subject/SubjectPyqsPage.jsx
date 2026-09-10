import { useMemo } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { ChevronRight, FlaskConical } from 'lucide-react'
import { getQuestionsForChapter } from '../../engine/pyq/questionBankService'

export default function SubjectPyqsPage() {
  const { subject } = useOutletContext()
  const chapters = useMemo(() => subject.chapters.map((chapter) => ({
    chapter,
    questions: getQuestionsForChapter(subject, chapter),
  })), [subject])
  const total = chapters.reduce((sum, item) => sum + item.questions.length, 0)

  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3.5">
        <div className="flex items-center gap-2 text-[#4fc1ff]"><FlaskConical size={16} /><h3 className="text-sm font-semibold text-[#e8e8e8]">{subject.name} Question Bank</h3></div>
        <p className="mt-1 text-xs text-[#858585]">{total} imported GATE questions matched to this subject&apos;s chapters.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {chapters.map(({ chapter, questions }) => (
          <Link key={chapter.slug} to={`/subjects/${subject.id}/chapters/${chapter.slug}/pyqs`} className="group rounded-lg border border-[#3c3c3c] bg-[#252526] px-4 py-3.5 transition-colors hover:border-[#4a4a4a]">
            <div className="flex items-start justify-between gap-3"><div className="min-w-0"><h4 className="text-sm font-medium text-[#e8e8e8]">{chapter.name}</h4><p className="mt-1 text-xs text-[#858585]">{questions.length} matched question{questions.length === 1 ? '' : 's'}</p></div><ChevronRight size={15} className="shrink-0 text-[#858585] group-hover:text-[#4fc1ff]" /></div>
          </Link>
        ))}
      </div>
    </section>
  )
}
