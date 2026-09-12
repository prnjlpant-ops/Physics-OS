import { useState } from 'react'
import { ChevronDown, CheckCircle2, ExternalLink, PlayCircle } from 'lucide-react'
import FocusVideoModal from '../ui/FocusVideoModal'

function guessTier(video) {
  const raw = String(video?.examScope ?? video?.exam ?? video?.scope ?? video?.tier ?? '').toUpperCase()
  if (raw.includes('JEST_EDGE') || raw.includes('JEST-EDGE') || raw.includes('BONUS')) return 'JEST Edge / Bonus'
  if (raw.includes('JAM_JEST') || raw.includes('JAM+JEST') || raw.includes('JAM+JEST')) return 'JAM + JEST'
  if (raw.includes('JAM_CORE') || raw.includes('JAM') || raw.includes('CORE')) return 'JAM Core'
  return 'GATE Extra Practice'
}

function tierMeta(tier) {
  if (tier === 'JAM Core') return { accent: 'text-emerald-300 border-emerald-400/40 bg-emerald-500/10', short: 'Tier 1' }
  if (tier === 'JAM + JEST') return { accent: 'text-sky-300 border-sky-400/40 bg-sky-500/10', short: 'Tier 2' }
  if (tier === 'JEST Edge / Bonus') return { accent: 'text-amber-300 border-amber-400/40 bg-amber-500/10', short: 'Tier 3' }
  return { accent: 'text-violet-300 border-violet-400/40 bg-violet-500/10', short: 'Extra' }
}

export default function CompactVideoList({ videos = [] }) {
  const [activeVideo, setActiveVideo] = useState(null)
  const [openTiers, setOpenTiers] = useState({ 'JAM Core': true, 'JAM + JEST': true, 'JEST Edge / Bonus': true, 'GATE Extra Practice': false })

  const groups = ['JAM Core', 'JAM + JEST', 'JEST Edge / Bonus', 'GATE Extra Practice'].map((tier) => ({
    tier,
    items: videos.filter((video) => guessTier(video) === tier),
  })).filter((group) => group.items.length > 0)

  if (!videos.length) {
    return (
      <div className="rounded-xl border border-[#3a3a3a] bg-[#111320] p-4 text-sm text-[#9ca3af]">
        No lectures mapped to this chapter yet.
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#111320] p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[10px] uppercase tracking-[0.14em] text-[#9ca3af]">V6.1 compact lecture grid</p>
        <span className="text-[10px] text-[#94a3b8]">{videos.length} lectures</span>
      </div>

      <div className="space-y-3">
        {groups.map(({ tier, items }) => {
          const meta = tierMeta(tier)
          const collapsed = !openTiers[tier]
          return (
            <div key={tier} className="rounded-lg border border-white/10 bg-[#151b2b] p-2.5">
              <button
                type="button"
                onClick={() => setOpenTiers((current) => ({ ...current, [tier]: !current[tier] }))}
                className="flex w-full items-center justify-between gap-2 text-left"
              >
                <div className="flex items-center gap-2">
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${meta.accent}`}>
                    {meta.short}
                  </span>
                  <span className="text-xs font-medium text-[#e5e7eb]">{tier}</span>
                </div>
                <ChevronDown size={14} className={collapsed ? '-rotate-90 transition-transform' : 'rotate-0 transition-transform'} />
              </button>

              {!collapsed && (
                <div className="mt-3 grid gap-2">
                  {items.map((video, index) => (
                    <div key={video.id ?? `${video.title}-${index}`} className="flex items-center gap-2 rounded-md border border-white/10 bg-[#0f172a] px-2.5 py-2">
                      <button
                        type="button"
                        onClick={() => setActiveVideo({
                          title: video.title,
                          url: video.url || video.videoUrl || video.link || '',
                          durationSeconds: Number(video.durationSeconds ?? video.duration ?? 0) || null,
                        })}
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-[#4ade80]/40 bg-[#1b2d1f] text-[#86efac] transition hover:scale-[1.03]"
                        aria-label={`Mark ${video.title} as watched`}
                      >
                        <CheckCircle2 size={14} />
                      </button>

                      <span className="inline-flex items-center justify-center rounded border border-white/10 bg-[#1e293b] px-1.5 py-0.5 text-[9px] font-medium text-[#dbeafe]">
                        Lec {String(index + 1).padStart(2, '0')}
                      </span>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-medium text-slate-100">{video.title}</p>
                        <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[9px] text-[#93c5fd]">
                          {video.duration && <span className="rounded bg-white/5 px-1.5 py-0.5">{video.duration}</span>}
                          <span className="max-w-[180px] truncate rounded bg-white/5 px-1.5 py-0.5 text-[#cbd5e1]">
                            {video.whatToWatch || video.syllabus || 'Targeted practice'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="inline-flex items-center gap-1 rounded border border-white/10 bg-[#1f2937] px-1.5 py-1 text-[10px] text-slate-200 hover:border-[#7dd3fc] hover:text-white"
                        onClick={() => setActiveVideo({
                          title: video.title,
                          url: video.url || video.videoUrl || video.link || '',
                          durationSeconds: Number(video.durationSeconds ?? video.duration ?? 0) || null,
                        })}
                      >
                        <PlayCircle size={12} />
                        Open
                      </button>

                      {(video.url || video.videoUrl || video.link) && (
                        <a
                          href={video.url || video.videoUrl || video.link}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded border border-white/10 bg-[#111827] p-1 text-slate-300 hover:text-white"
                          aria-label={`Open ${video.title} in browser`}
                          onClick={(event) => {
                            event.preventDefault()
                            window.open(video.url || video.videoUrl || video.link, '_blank', 'noopener,noreferrer')
                          }}
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {activeVideo && (
        <FocusVideoModal
          open={Boolean(activeVideo)}
          onClose={() => setActiveVideo(null)}
          video={activeVideo}
        />
      )}
    </div>
  )
}
