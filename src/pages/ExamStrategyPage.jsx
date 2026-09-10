import { Calculator, CheckCircle2, Clock3, ShieldAlert, Target } from 'lucide-react'

const confidenceRows = [
  ['High (>80%)', 'Attempt', 'Attempt', 'Attempt'],
  ['Medium (50–80%)', 'Attempt cautiously', 'Attempt only after eliminating 2 options', 'Always attempt'],
  ['Low (<50%)', 'Skip', 'Skip', 'Attempt if any partial method exists'],
]

const timePlan = [
  ['Initial scan', '10 min', 'Flag easy NATs and difficult Part B questions.'],
  ['Part B', '~90 min', 'Primary score-building phase; protect against negative marking.'],
  ['Part C / NAT', '~40 min', 'Risk-free numerical scoring; use two-pass arithmetic.'],
  ['Part A', '~20 min', 'Quick confidence-based attempts.'],
  ['Final review', '~20 min', 'Recheck NAT arithmetic and every negative-marked guess.'],
]

function Card({ icon: Icon, title, children }) {
  return <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4"><div className="flex items-center gap-2"><Icon size={16} className="text-[#4fc1ff]" /><h3 className="text-sm font-semibold text-[#e8e8e8]">{title}</h3></div><div className="mt-3 text-xs leading-relaxed text-[#bdbdbd]">{children}</div></section>
}

export default function ExamStrategyPage() {
  return <div className="flex flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
    <header><p className="text-[10px] uppercase tracking-wide text-[#4fc1ff]">Master Blueprint v3 · Section 8</p><h2 className="mt-1 text-lg font-semibold text-[#e8e8e8]">JEST exam strategy</h2><p className="mt-1 max-w-3xl text-xs text-[#858585]">Use marks per minute and risk—not paper order—to decide what to attempt. Re-check the official 2027 notification before the exam.</p></header>

    <div className="grid gap-3 lg:grid-cols-3">
      <Card icon={Target} title="Attempt priority"><ol className="space-y-2"><li><strong className="text-[#e8e8e8]">1. Part C / NAT:</strong> no negative marking; give every viable question a partial attempt.</li><li><strong className="text-[#e8e8e8]">2. Part B:</strong> the main score-building section; do not blindly guess.</li><li><strong className="text-[#e8e8e8]">3. Part A:</strong> use as quick, confidence-based scoring.</li></ol></Card>
      <Card icon={Calculator} title="NAT routine"><p>Estimate first, then recompute carefully when time permits. Check units, sign, and order of magnitude; keep extra significant figures until the final answer. No calculator: practise manual arithmetic throughout preparation.</p></Card>
      <Card icon={ShieldAlert} title="MCQ safeguards"><p>Use elimination, dimensions, limiting cases, and physical plausibility before attempting. For Part B, skip any question without at least one confident elimination; negative marking turns blind guesses into a poor trade.</p></Card>
    </div>

    <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4"><div className="flex items-center gap-2"><Clock3 size={16} className="text-[#4fc1ff]" /><h3 className="text-sm font-semibold text-[#e8e8e8]">Time budget</h3></div><div className="mt-3 grid gap-2 md:grid-cols-5">{timePlan.map(([segment, time, action]) => <div key={segment} className="rounded-md border border-[#3c3c3c] bg-[#1e1e1e] p-3"><p className="text-xs font-medium text-[#e8e8e8]">{segment} <span className="text-[#4fc1ff]">{time}</span></p><p className="mt-1 text-[11px] leading-relaxed text-[#858585]">{action}</p></div>)}</div></section>

    <section className="overflow-x-auto rounded-lg border border-[#3c3c3c] bg-[#252526]"><div className="flex items-center gap-2 border-b border-[#3c3c3c] px-4 py-3"><CheckCircle2 size={16} className="text-[#4fc1ff]" /><h3 className="text-sm font-semibold text-[#e8e8e8]">Confidence rule</h3></div><table className="w-full min-w-[620px] text-left text-xs"><thead className="bg-[#1e1e1e] text-[#9d9d9d]"><tr>{['Confidence', 'Part A', 'Part B', 'Part C / NAT'].map((cell) => <th key={cell} className="px-4 py-2.5 font-medium">{cell}</th>)}</tr></thead><tbody>{confidenceRows.map((row) => <tr key={row[0]} className="border-t border-[#3c3c3c] text-[#cccccc]">{row.map((cell, index) => <td key={cell} className={`px-4 py-3 ${index === 0 ? 'font-medium text-[#e8e8e8]' : ''}`}>{cell}</td>)}</tr>)}</tbody></table></section>
  </div>
}
