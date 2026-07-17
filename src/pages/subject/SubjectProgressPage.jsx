import { useOutletContext } from 'react-router-dom'

function average(values) {
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
}

function statusToValue(status, doneLabel) {
  if (status === doneLabel) return 100
  if (status === 'In Progress') return 55
  return 0
}

function ProgressBar({ label, value }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#cccccc]">{label}</p>
        <p className="text-sm font-medium text-[#e8e8e8]">{value}%</p>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#3c3c3c]">
        <div className="h-full rounded-full bg-[#0e639c]" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

export default function SubjectProgressPage() {
  const { subject } = useOutletContext()

  const overall = average(subject.chapters.map((c) => c.progress))
  const reading = average(subject.chapters.map((c) => statusToValue(c.reading, 'Done')))
  const problems = average(subject.chapters.map((c) => statusToValue(c.problems, 'Done')))
  const revision = average(subject.chapters.map((c) => statusToValue(c.revision, 'Done')))

  return (
    <section className="flex flex-col gap-6 rounded-lg border border-[#3c3c3c] bg-[#252526] px-5 py-5">
      <ProgressBar label="Overall Completion" value={overall} />
      <ProgressBar label="Reading Progress" value={reading} />
      <ProgressBar label="Problem Solving Progress" value={problems} />
      <ProgressBar label="Revision Progress" value={revision} />
    </section>
  )
}
