import test from 'node:test'
import assert from 'node:assert/strict'

import { canonicalizeExamScope, getSubjects, getScopeBadgeLabel, getTopicList } from './subjects.js'

test('canonicalizeExamScope normalizes legacy labels into the shared 3-scope enum', () => {
  assert.equal(canonicalizeExamScope('JAM+JEST'), 'JAM_JEST')
  assert.equal(canonicalizeExamScope('JAM+JEST overlap'), 'JAM_JEST')
  assert.equal(canonicalizeExamScope('JEST-edge'), 'JEST_EDGE')
  assert.equal(canonicalizeExamScope('JAM-partial'), 'JAM_CORE')
})

test('subject list exposes a shared examScope and bookRef on each topic', () => {
  const topics = getTopicList()
  assert.ok(topics.length > 0)
  const first = topics[0]
  assert.ok(first.examScope)
  assert.match(first.examScope, /^JAM_CORE|JAM_JEST|JEST_EDGE$/)
  assert.ok(typeof first.bookRef === 'string')
})

test('scope badge labels match the required display text', () => {
  assert.equal(getScopeBadgeLabel('JAM_CORE'), 'JAM Core')
  assert.equal(getScopeBadgeLabel('JAM_JEST'), 'JAM + JEST')
  assert.equal(getScopeBadgeLabel('JEST_EDGE'), 'JEST Edge')
})
