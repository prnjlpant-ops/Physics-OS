import test from 'node:test'
import assert from 'node:assert/strict'
import { TOPIC_STATUS } from '../constants/topicConstants.js'
import { getRoadmapMissionSnapshot } from './roadmapMissionService.js'

test('picks the first incomplete roadmap topic as next up', () => {
  const statuses = {
    'phase-a-01': TOPIC_STATUS.MASTERED,
    'phase-a-02': TOPIC_STATUS.NOT_STARTED,
  }

  const snapshot = getRoadmapMissionSnapshot(statuses, new Date('2026-08-11'))

  assert.equal(snapshot.nextTopic?.id, 'phase-a-02')
  assert.equal(snapshot.checkpoint.label, 'Early October checkpoint')
})

test('surfaces later topics as out-of-sequence when they are started ahead of the next topic', () => {
  const statuses = {
    'phase-a-01': TOPIC_STATUS.MASTERED,
    'phase-a-02': TOPIC_STATUS.NOT_STARTED,
    'phase-a-03': TOPIC_STATUS.IN_PROGRESS,
  }

  const snapshot = getRoadmapMissionSnapshot(statuses, new Date('2026-08-11'))

  assert.equal(snapshot.nextTopic?.id, 'phase-a-02')
  assert.deepEqual(snapshot.outOfSequence.map((topic) => topic.id), ['phase-a-03'])
})
