import test from 'node:test'
import assert from 'node:assert/strict'

const { normalizeLectureScope, buildLectureScopeGroups } = await import('./lectureScope.js')

test('normalizeLectureScope canonicalizes exam scope labels', () => {
  assert.equal(normalizeLectureScope('JAM Core / JAM Only'), 'JAM_CORE')
  assert.equal(normalizeLectureScope('JAM + JEST'), 'JAM_JEST')
  assert.equal(normalizeLectureScope('JEST Edge / Bonus'), 'JEST_EDGE')
  assert.equal(normalizeLectureScope('GATE Extra'), 'GATE_EXTRA')
})

test('buildLectureScopeGroups keeps live lecture order and groups by scope', () => {
  const lectures = [
    { title: 'Lec 1', examScope: 'JAM Core / JAM Only' },
    { title: 'Lec 2', examScope: 'JAM + JEST' },
    { title: 'Lec 3', examScope: 'JEST Edge / Bonus' },
    { title: 'Lec 4', examScope: 'GATE Extra' },
    { title: 'Lec 5', examScope: 'JAM + JEST' },
  ]

  const groups = buildLectureScopeGroups(lectures)
  assert.deepEqual(groups.map((group) => group.scopeKey), ['JAM_CORE', 'JAM_JEST', 'JEST_EDGE', 'GATE_EXTRA'])
  assert.equal(groups[0].lectures.length, 1)
  assert.equal(groups[1].lectures.length, 2)
  assert.equal(groups[2].lectures.length, 1)
  assert.equal(groups[3].lectures.length, 1)
})
