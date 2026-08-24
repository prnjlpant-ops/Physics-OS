import { Coffee, Target } from 'lucide-react'
import { useStudyTimer } from '../../context/StudyTimerContext'
import { formatDuration } from '../../utils/formatDuration'

const presets = [25, 50, 90]

export default function FocusTargetPanel() {
  const { elapsedMs, focusTargetMs, setFocusTarget, status } = useStudyTimer()
  const progress = Math.min(100, Math.round((elapsedMs / focusTargetMs) * 100))
  const complete = elapsedMs >= focusTargetMs

  return <section className="rounded-lg border border-[#3c3c3c] bg-[#252526] p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e8e8e8]"><Target size={15} />Focus target</p><p className="mt-1 text-[11px] text-[#858585]">PW-style focus blocks: work with one clear target, then take a deliberate break.</p></div><span className={`rounded-full border px-2 py-1 text-[10px] ${complete ? 'border-[#2e5a2e] bg-[#1f2e1f] text-[#8fd18f]' : 'border-[#3c3c3c] text-[#9d9d9d]'}`}>{complete ? 'Break ready' : `${progress}% complete`}</span></div><div className="mt-4 flex flex-wrap gap-2">{presets.map((minutes) => <button key={minutes} type="button" disabled={status !== 'idle'} onClick={() => setFocusTarget(minutes * 60 * 1000)} className={`rounded-md border px-3 py-1.5 text-xs transition-colors disabled:opacity-50 ${focusTargetMs === minutes * 60 * 1000 ? 'border-[#0e639c] bg-[#0e639c] text-white' : 'border-[#3c3c3c] text-[#cccccc] hover:border-[#4a4a4a]'}`}>{minutes} min</button>)}</div><div className="mt-4 h-2 overflow-hidden rounded-full bg-[#1e1e1e]"><div className={`h-full rounded-full transition-all ${complete ? 'bg-[#6a9955]' : 'bg-[#0e639c]'}`} style={{ width: `${progress}%` }} /></div><div className="mt-2 flex items-center justify-between text-[11px] text-[#858585]"><span>{formatDuration(elapsedMs)} focused</span><span>{formatDuration(focusTargetMs)} target</span></div>{complete && <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#8fd18f]"><Coffee size={14} />Focus block complete. Pause, take a short break, then start your next block.</p>}</section>
}
