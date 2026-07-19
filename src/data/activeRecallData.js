import { subjects } from '../constants/subjects'
import {
  QUESTION_TYPES,
  DIFFICULTY_LEVELS,
  ACTIVE_RECALL_TAG_POOL,
} from '../constants/activeRecallConstants'

/**
 * Active Recall cards are attached to Chapters, not Books. This module
 * produces placeholder card data per chapter — one card per question type —
 * so the UI layer will not need to change when real per-chapter
 * `activeRecall.json` files arrive. Real question authoring happens later;
 * this only defines shape + placeholder prompts.
 *
 * Active Recall is independent from Formula Sheets and Memory Sheets:
 * formula sheets answer "what is the formula", memory sheets answer "what
 * must I remember forever", active recall tests "can I explain, compare,
 * predict, and reason about this without looking anything up".
 */

function questionTemplate(typeKey, chapter) {
  switch (typeKey) {
    case 'conceptual':
      return `Explain, in your own words, the core idea behind ${chapter.name} and why it works the way it does.`
    case 'why':
      return `Why does ${chapter.name} require the assumptions it does — what would break if one of them were removed?`
    case 'compare':
      return `Compare the approach used in ${chapter.name} with a related method from another chapter. Where do they agree, and where do they diverge?`
    case 'predict':
      return `If a key parameter in ${chapter.name} were pushed to an extreme — very large or very small — predict how the system's behavior would change.`
    case 'physicalInterpretation':
      return `What is the physical meaning behind the central result of ${chapter.name}? Describe it without writing down the formula itself.`
    case 'applications':
      return `Where does ${chapter.name} show up in real experiments or applied physics problems? Describe one concrete scenario.`
    case 'commonMistakes':
      return `What is a mistake students commonly make when applying ${chapter.name}, and why does that error feel reasonable at first?`
    default:
      return `Placeholder question for ${chapter.name}.`
  }
}

function tagsForIndex(index) {
  const first = ACTIVE_RECALL_TAG_POOL[index % ACTIVE_RECALL_TAG_POOL.length]
  const second = ACTIVE_RECALL_TAG_POOL[(index + 3) % ACTIVE_RECALL_TAG_POOL.length]
  return first === second ? [first] : [first, second]
}

function buildCard(subject, chapter, type, index) {
  return {
    id: `${subject.id}__${chapter.slug}__${type.key}`,
    subjectId: subject.id,
    subjectName: subject.name,
    chapterSlug: chapter.slug,
    chapterName: chapter.name,
    typeKey: type.key,
    typeLabel: type.label,
    difficulty: DIFFICULTY_LEVELS[index % DIFFICULTY_LEVELS.length],
    tags: tagsForIndex(index),
    question: questionTemplate(type.key, chapter),
    answer: `Answer placeholder — a detailed "${type.label}" explanation for ${chapter.name} will be added here.`,
    relatedFormulaSheetPath: `/subjects/${subject.id}/chapters/${chapter.slug}/formula-sheet`,
    relatedMemorySheetPath: `/subjects/${subject.id}/chapters/${chapter.slug}/memory-sheet`,
    relatedNotesPath: `/subjects/${subject.id}/chapters/${chapter.slug}/notes`,
  }
}

export function getChapterActiveRecallCards(subject, chapter) {
  return QUESTION_TYPES.map((type, index) => buildCard(subject, chapter, type, index))
}

export function getSubjectActiveRecallCards(subject) {
  return subject.chapters.flatMap((chapter) => getChapterActiveRecallCards(subject, chapter))
}

export function getAllActiveRecallCards() {
  return subjects.flatMap((subject) => getSubjectActiveRecallCards(subject))
}

/**
 * Builds Progress Panel numbers (Total / Reviewed / Remaining / Bookmarked)
 * for any list of Active Recall cards, using live reviewed + bookmark state
 * from their respective hooks. Placeholder values only — no scheduling.
 */
export function getActiveRecallProgress(cardList, { reviewedIds = [], bookmarkedIds = [] } = {}) {
  const total = cardList.length
  const reviewed = cardList.filter((card) => reviewedIds.includes(card.id)).length
  const bookmarked = cardList.filter((card) => bookmarkedIds.includes(card.id)).length

  return {
    total,
    reviewed,
    remaining: total - reviewed,
    bookmarked,
  }
}
