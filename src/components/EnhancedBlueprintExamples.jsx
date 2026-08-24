/**
 * ENHANCED BLUEPRINT USAGE GUIDE
 * ==============================
 * The enhanced blueprint (jestBlueprintEnhanced.json) contains complete metadata
 * for every topic, including study notes, video links, and exam relevance.
 * 
 * All data flows from: Excel workbook → generateBlueprintEnhanced.cjs → 
 * jestBlueprintEnhanced.json → blueprintService getters → Components
 */

import {
  getEnhancedSubject,
  getEnhancedChapter,
  getTopicMetadata,
  getAllTopicsInSubject,
  getTopicsForExam,
  getStudyNotesByTopic,
  getResourceLinksByTopic,
} from '../engine/blueprintService'

/**
 * EXAMPLE 1: Get all topics for a subject with complete metadata
 */
export function ExampleSubjectCurriculum() {
  const subjectId = 'math-methods'
  const topics = getAllTopicsInSubject(subjectId)
  
  return (
    <div className="subject-curriculum">
      <h2>All Topics in {subjectId}</h2>
      {topics.map((topic) => (
        <div key={topic.slug} className="topic-card">
          <h3>{topic.name}</h3>
          <p><strong>Chapter:</strong> {topic.chapter}</p>
          <p><strong>Exams:</strong> {topic.exams.join(', ')}</p>
          <p><strong>Roadmap:</strong> {topic.roadmapPhase}</p>
          <p><strong>Video Source:</strong> {topic.source}</p>
          {topic.videoLink && (
            <a href={`#${topic.videoLink}`} target="_blank" rel="noopener noreferrer">
              {topic.linkType} — {topic.videoLink}
            </a>
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * EXAMPLE 2: Display complete study notes for a topic
 */
export function ExampleStudyNotes({ subjectId, chapterSlug, topicSlug }) {
  const studyNotes = getStudyNotesByTopic(subjectId, chapterSlug, topicSlug)
  
  return (
    <div className="study-notes">
      <h3>Study Plan</h3>
      <p className="notes-content">{studyNotes}</p>
      {/* 
        Example notes format from Excel:
        "Book: Boas Ch.6, full chapter — work every problem in that section.
        Once the concept + problems are solid, drill PYQs (JAM / CSIR-NET / JEST, 2012–present).
        Timing: Phase A — by early Oct."
      */}
    </div>
  )
}

/**
 * EXAMPLE 3: Get all topics relevant to a specific exam
 */
export function ExampleExamTopics() {
  const jamTopics = getTopicsForExam('JAM')
  const jestTopics = getTopicsForExam('JEST')
  const bothTopics = getTopicsForExam('JAM+JEST')
  
  return (
    <div className="exam-curriculum">
      <section>
        <h2>JAM Topics ({jamTopics.length})</h2>
        {jamTopics.slice(0, 5).map((t) => (
          <div key={t.slug}>
            <strong>{t.subjectName}</strong> - {t.name}
            <br />
            <small>{t.source}</small>
          </div>
        ))}
      </section>
      
      <section>
        <h2>JEST Topics ({jestTopics.length})</h2>
        {jestTopics.slice(0, 5).map((t) => (
          <div key={t.slug}>
            <strong>{t.subjectName}</strong> - {t.name}
            <br />
            <small>{t.source}</small>
          </div>
        ))}
      </section>
    </div>
  )
}

/**
 * EXAMPLE 4: Display topic with all resources and links
 */
export function ExampleTopicDetail({ subjectId, chapterSlug, topicSlug }) {
  const metadata = getTopicMetadata(subjectId, chapterSlug, topicSlug)
  const resources = getResourceLinksByTopic(subjectId, chapterSlug, topicSlug)
  
  if (!metadata) return <div>Topic not found</div>
  
  return (
    <div className="topic-detail">
      <h2>{metadata.name}</h2>
      
      <div className="metadata">
        <p><strong>Chapter:</strong> {metadata.chapter}</p>
        <p><strong>Exams:</strong> {metadata.exams.join(', ')}</p>
        <p><strong>Roadmap Phase:</strong> {metadata.roadmapPhase}</p>
      </div>

      <div className="resources">
        <h3>Video Resource</h3>
        <p><strong>Source:</strong> {resources.videoSource}</p>
        <p><strong>Type:</strong> {resources.linkType}</p>
        {resources.videoLink && (
          <a href={`#${resources.videoLink}`} className="btn-primary">
            {resources.videoLink}
          </a>
        )}
      </div>

      <div className="study-plan">
        <h3>Complete Study Plan</h3>
        <p>{metadata.studyNotes}</p>
      </div>
    </div>
  )
}

/**
 * EXAMPLE 5: Build a comprehensive chapter view
 */
export function ExampleChapterView({ subjectId, chapterSlug }) {
  const chapter = getEnhancedChapter(subjectId, chapterSlug)
  
  if (!chapter) return <div>Chapter not found</div>
  
  return (
    <div className="chapter-view">
      <h1>{chapter.name}</h1>
      <p className="topic-count">{chapter.topicCount} topics to master</p>
      
      <div className="topics-list">
        {chapter.topics.map((topic) => (
          <div key={topic.slug} className="topic-row">
            <div className="topic-info">
              <h3>{topic.name}</h3>
              <div className="metadata-inline">
                <span className="badge">{topic.exams.join(' + ')}</span>
                <span className="badge-phase">{topic.roadmapPhase}</span>
              </div>
            </div>
            
            <div className="topic-resources">
              {topic.videoLink && (
                <div className="resource-item">
                  <strong>{topic.source}</strong>
                  <br />
                  <small>{topic.linkType}</small>
                </div>
              )}
              {!topic.videoLink && (
                <div className="resource-item">
                  <strong>{topic.source}</strong>
                </div>
              )}
            </div>
            
            <div className="topic-notes">
              <p className="study-notes-preview">
                {topic.studyNotes.substring(0, 150)}...
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * EXAMPLE 6: Integration with existing Syllabus component
 * 
 * To enhance existing components:
 * 
 * OLD CODE (before enhancement):
 * const chapters = getChapters(subjectId)
 * chapters.map(ch => <Chapter name={ch.name} />)
 * 
 * NEW CODE (with complete metadata):
 * const chapters = getEnhancedChapter(subjectId).chapters
 * chapters.map(ch => (
 *   <Chapter 
 *     name={ch.name}
 *     topics={ch.topics}  // Now has videoLink, studyNotes, exams, etc.
 *     topicCount={ch.topicCount}
 *   />
 * ))
 */

/**
 * STRUCTURE OF ENHANCED BLUEPRINT
 * ===============================
 * 
 * {
 *   meta: {
 *     version: "2.0",
 *     source: "JEST-JAM-video-links.xlsx",
 *     generatedAt: "2026-08-18T...",
 *     description: "Enhanced curriculum..."
 *   },
 *   subjects: [
 *     {
 *       id: "math-methods",
 *       name: "Math Methods",
 *       topicCount: 17,
 *       chapters: [
 *         {
 *           name: "Vector Calculus & Linear Algebra",
 *           slug: "vector-calculus-linear-algebra",
 *           topicCount: 3,
 *           topics: [
 *             {
 *               name: "Vector algebra, vector calculus...",
 *               slug: "vector-algebra-vector-calculus-...",
 *               chapter: "Vector Calculus & Linear Algebra",
 *               chapterSlug: "vector-calculus-linear-algebra",
 *               exams: ["JAM", "JEST"],
 *               roadmapPhase: "Topic 1",
 *               source: "Book only" | "Pravegaa" | "NPTEL — ...",
 *               linkType: "N/A" | "Direct (playlist)" | "Direct (video)",
 *               videoLink: "" | "Open playlist" | "Open video",
 *               studyNotes: "Complete study plan with book chapters, timing, PYQ structure..."
 *             },
 *             ...more topics
 *           ]
 *         },
 *         ...more chapters
 *       ]
 *     },
 *     ...11 subjects total
 *   ]
 * }
 */

export default {
  ExampleSubjectCurriculum,
  ExampleStudyNotes,
  ExampleExamTopics,
  ExampleTopicDetail,
  ExampleChapterView,
}
