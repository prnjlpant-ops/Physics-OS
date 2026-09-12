export const LECTURE_SCOPE_ORDER = ['JAM_CORE', 'JAM_JEST', 'JEST_EDGE', 'GATE_EXTRA']

export const LECTURE_SCOPE_META = {
  JAM_CORE: {
    label: 'JAM Core / JAM Only',
    containerStyles: 'border-emerald-500/30 bg-emerald-950/10',
    badgeStyles: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',
    phaseNote: 'Phase A — Mandatory Foundation',
  },
  JAM_JEST: {
    label: 'JAM + JEST',
    containerStyles: 'border-indigo-500/30 bg-indigo-950/10',
    badgeStyles: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40',
    phaseNote: 'Phase A — High Yield (Both Exams)',
  },
  JEST_EDGE: {
    label: 'JEST Edge / Bonus',
    containerStyles: 'border-amber-500/30 bg-amber-950/10',
    badgeStyles: 'bg-amber-500/20 text-amber-300 border border-amber-500/40',
    phaseNote: 'Phase A-Bonus / Phase B — Post-Cutoff Advance',
  },
  GATE_EXTRA: {
    label: 'GATE Extra',
    containerStyles: 'border-cyan-500/30 bg-cyan-950/10',
    badgeStyles: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40',
    phaseNote: 'Phase B — Extra Depth',
  },
}

export function normalizeLectureScope(value = '') {
  const raw = String(value ?? '').trim()

  if (!raw) return 'JAM_JEST'

  const normalized = raw.toLowerCase().replace(/[_+]/g, ' ').replace(/-/g, ' ')

  if (/gate|extra/.test(normalized)) return 'GATE_EXTRA'
  if (/jam\s*\+\s*jest|jam\s*jest|overlap/.test(normalized)) return 'JAM_JEST'
  if (/jest edge|bonus|edge|advanced/i.test(normalized) || (/jest/.test(normalized) && !/jam/.test(normalized))) {
    return 'JEST_EDGE'
  }
  if (/jam core|jam only|jam partial|jam\b/.test(normalized) && !/jest/.test(normalized)) {
    return 'JAM_CORE'
  }
  if (/jest/.test(normalized)) return 'JEST_EDGE'

  return 'JAM_JEST'
}

export function buildLectureScopeGroups(lectures = []) {
  const groups = LECTURE_SCOPE_ORDER.map((scopeKey) => ({
    scopeKey,
    ...LECTURE_SCOPE_META[scopeKey],
    lectures: [],
  }))

  const byScope = Object.fromEntries(groups.map((group) => [group.scopeKey, group]))

  lectures.forEach((lecture) => {
    const scopeKey = normalizeLectureScope(
      lecture.examScope ?? lecture.exam ?? lecture.scope ?? lecture.tier ?? lecture.source ?? 'JAM_JEST',
    )
    if (byScope[scopeKey]) {
      byScope[scopeKey].lectures.push(lecture)
    }
  })

  return groups.filter((group) => group.lectures.length > 0)
}
