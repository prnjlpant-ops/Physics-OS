# Enhanced Blueprint Implementation

## Overview

The **Enhanced Blueprint** (v2.0) captures **every piece of information from the Excel workbook** and makes it accessible throughout the application. This includes:

- ✓ All 11 subjects with complete metadata
- ✓ All 78 topics with detailed study plans
- ✓ Video links (Pravegaa, NPTEL, etc.) with source and link type
- ✓ Study notes with book chapters, timing, and practice structure
- ✓ Exam relevance (JAM, JEST, JAM+JEST)
- ✓ Roadmap phases for each topic

## Files Structure

```
Excel Workbook (JEST-JAM-video-links.xlsx)
    ↓
scripts/generateBlueprintEnhanced.cjs (Node.js script)
    ↓
src/data/blueprint/jestBlueprintEnhanced.json (Generated)
    ↓
src/engine/blueprintService.js (Getters)
    ↓
Components & Modules (Access via getters)
```

## Data Flow

1. **Excel Workbook** - Authoritative source with:
   - Subject sheets (1. Math Methods, 2. Mechanics, etc.)
   - Columns: Chapter, Sub-topic, Roadmap Topic/Phase, JAM/JEST, Source, Link Type, Video Link, Study Notes

2. **Generation Script** - `scripts/generateBlueprintEnhanced.cjs`:
   ```bash
   node scripts/generateBlueprintEnhanced.cjs
   ```
   - Reads all subject sheets from Excel
   - Groups topics by chapter within each subject
   - Extracts and preserves all metadata
   - Generates `jestBlueprintEnhanced.json`

3. **Enhanced Blueprint JSON** - Complete curriculum data:
   - Version 2.0 with full topic metadata
   - All Excel information preserved and structured
   - Ready for application consumption

4. **Blueprint Service** - Access layer in `src/engine/blueprintService.js`:
   - `getEnhancedSubject(subjectId)` - Get subject with all chapters
   - `getEnhancedChapter(subjectId, chapterSlug)` - Get chapter with all topics
   - `getTopicMetadata(subjectId, chapterSlug, topicSlug)` - Get topic details
   - `getAllTopicsInSubject(subjectId)` - Get all topics in a subject
   - `getTopicsForExam(exam)` - Get topics for specific exam (JAM/JEST/both)
   - `getStudyNotesByTopic(...)` - Get complete study plan
   - `getResourceLinksByTopic(...)` - Get video links and sources

5. **Components** - Use blueprint service getters:
   ```jsx
   import { getTopicMetadata, getStudyNotesByTopic } from '../engine/blueprintService'
   
   function TopicDetail({ subjectId, chapterSlug, topicSlug }) {
     const metadata = getTopicMetadata(subjectId, chapterSlug, topicSlug)
     const notes = getStudyNotesByTopic(subjectId, chapterSlug, topicSlug)
     
     return (
       <div>
         <h1>{metadata.name}</h1>
         <p>{notes}</p>
         <a href={`#${metadata.videoLink}`}>{metadata.source}</a>
       </div>
     )
   }
   ```

## Topic Data Structure

Each topic in the enhanced blueprint contains:

```json
{
  "name": "Vector algebra, vector calculus (grad/div/curl, Stokes', divergence theorem)",
  "slug": "vector-algebra-vector-calculus-graddivcurl-stokes-",
  "chapter": "Vector Calculus & Linear Algebra",
  "chapterSlug": "vector-calculus-linear-algebra",
  "exams": ["JAM", "JEST"],
  "roadmapPhase": "Topic 1",
  "source": "Book only | Pravegaa | NPTEL — [Professor], [IIT]",
  "linkType": "N/A | Direct (playlist) | Direct (video)",
  "videoLink": "" | "Open playlist" | "Open video",
  "studyNotes": "No dedicated video needed — this is mechanical skill-building. Book: Boas Ch.6, full chapter — work every problem in that section, not just read it. Once the concept + problems are solid, drill PYQs (JAM / CSIR-NET / JEST, 2012–present) on this exact sub-topic before moving on. Timing: Phase A — by early Oct..."
}
```

## Key Features

### 1. Complete Study Notes
Each topic has detailed study notes that include:
- What to watch (video lectures or book chapters)
- Which book to use and what chapter
- Practice problems to work
- PYQ drilling instructions
- Timing in the roadmap
- Tips for equivalent sources

Example:
```
"Book: Boas Ch.6, full chapter — work every problem in that section. 
Once the concept + problems are solid, drill PYQs (JAM / CSIR-NET / JEST, 2012–present).
Timing: Phase A — by early Oct."
```

### 2. Multiple Resource Sources
Topics can have:
- **Book only** - No video, rely on book + PYQs
- **Pravegaa** - Primary video source (playlists or individual videos)
- **NPTEL** - Backup/alternative source from NPTEL professors

### 3. Exam-Specific Curriculum
Filter topics by:
- `JAM` - Topics tested in JAM
- `JEST` - Topics tested in JEST
- `JAM+JEST` - Topics in both exams

### 4. Roadmap Integration
Each topic has:
- `roadmapPhase` - Position in study timeline (Topic 1, Topic 2, Phase A, etc.)
- Timing guidance in study notes
- Dependency information through chapter grouping

## Usage Examples

### Get All Topics in Math Methods
```javascript
import { getAllTopicsInSubject } from '../engine/blueprintService'

const topics = getAllTopicsInSubject('math-methods')
// Returns 17 topics with full metadata
topics.forEach(t => {
  console.log(`${t.name} (${t.exams.join('+')}): ${t.videoLink || 'Book only'}`)
})
```

### Display Topic Study Plan
```javascript
import { getStudyNotesByTopic } from '../engine/blueprintService'

const notes = getStudyNotesByTopic('math-methods', 'vector-calculus-linear-algebra', 'vector-algebra-...')
// Returns: "Book: Boas Ch.6, full chapter — work every problem..."
```

### Get JEST-Specific Topics
```javascript
import { getTopicsForExam } from '../engine/blueprintService'

const jestTopics = getTopicsForExam('JEST')
// Returns all topics relevant to JEST exam
```

### Build Topic Detail Page
```javascript
import { getTopicMetadata, getResourceLinksByTopic } from '../engine/blueprintService'

function TopicPage({ subjectId, chapterSlug, topicSlug }) {
  const meta = getTopicMetadata(subjectId, chapterSlug, topicSlug)
  const resources = getResourceLinksByTopic(subjectId, chapterSlug, topicSlug)
  
  return (
    <article>
      <h1>{meta.name}</h1>
      <p>Exams: {meta.exams.join(', ')}</p>
      <p>Roadmap: {meta.roadmapPhase}</p>
      
      <section>
        <h2>Video Resource</h2>
        <p>Source: {resources.videoSource}</p>
        <a href={`#${resources.videoLink}`}>{resources.linkType}</a>
      </section>
      
      <section>
        <h2>Study Plan</h2>
        <p>{meta.studyNotes}</p>
      </section>
    </article>
  )
}
```

## Updating the Curriculum

### When to Update Excel

Edit `JEST-JAM-video-links.xlsx` to:
- Add/remove subjects
- Modify chapter names
- Change topic descriptions
- Update video links
- Modify study notes
- Add alternative sources
- Change exam relevance

### To Regenerate Blueprint

```bash
# 1. Edit the Excel workbook
# 2. Run the generation script
node scripts/generateBlueprintEnhanced.cjs

# 3. Verify alignment (optional)
node scripts/validateBlueprint.js
node scripts/auditCurriculum.js

# 4. Build the app
npm run build
```

The application will automatically reflect all changes through the updated blueprint.

## Quality Assurance

### Validation Scripts

1. **validateBlueprint.js** - Checks Excel-blueprint alignment:
   ```bash
   node scripts/validateBlueprint.js
   ```
   - Verifies subject name matching
   - Confirms topic count alignment
   - Reports any discrepancies

2. **auditCurriculum.js** - Comprehensive curriculum audit:
   ```bash
   node scripts/auditCurriculum.js
   ```
   - Validates all 11 subjects
   - Confirms all 78 topics
   - Checks for missing data
   - Reports audit status

### Current Status

```
✓ All 11 subjects properly imported
✓ All 78 topics properly imported
✓ Complete metadata preserved
✓ Study notes fully captured
✓ Video links and sources included
✓ Exam relevance (JAM/JEST) preserved
✓ Roadmap phases assigned
✓ Application builds successfully
```

## Implementation Checklist

- [x] Generate enhanced blueprint from Excel
- [x] Add blueprint to blueprintService.js
- [x] Export getter functions for access
- [x] Document usage patterns
- [x] Build and verify compilation
- [x] Create example implementations
- [ ] Update Syllabus component to use enhanced data
- [ ] Update Topics/Chapter pages to display study notes
- [ ] Update Resources/Library to link from study notes
- [ ] Update PYQ module to reference topics with metadata
- [ ] Update Analytics to track topic completion with phases
- [ ] Update Roadmap to show topics with metadata

## Migration from v1 Blueprint

The v1 blueprint (jestBlueprint.json) is still used for basic subject/chapter structure. The v2 enhanced blueprint (jestBlueprintEnhanced.json) provides complete topic-level metadata.

**Both are available:**
- Use `getSubjects()` for basic structure
- Use `getEnhancedSubject()` for full metadata
- Use `getTopicMetadata()` for specific topic details

No breaking changes — all v1 code continues to work.

## File Locations

- **Excel source**: `./JEST-JAM-video-links.xlsx`
- **Generation script**: `./scripts/generateBlueprintEnhanced.cjs`
- **Blueprint output**: `./src/data/blueprint/jestBlueprintEnhanced.json`
- **Service layer**: `./src/engine/blueprintService.js`
- **Examples**: `./src/components/EnhancedBlueprintExamples.jsx`
- **Documentation**: `./ENHANCED_BLUEPRINT.md` (this file)

## Troubleshooting

### Blueprint not updating after Excel changes?
1. Run `node scripts/generateBlueprintEnhanced.cjs` to regenerate
2. Rebuild with `npm run build`
3. Clear browser cache

### Topics showing empty study notes?
1. Check Excel row has content in "Study Notes" column
2. Run validation: `node scripts/validateBlueprint.js`
3. Regenerate and rebuild

### Build errors after adding getters?
1. Verify import statement in blueprintService.js
2. Ensure `jestBlueprintEnhanced.json` exists
3. Run `npm install` to update dependencies

## Next Steps

1. Update component libraries to use enhanced metadata
2. Enhance Syllabus component to show study notes
3. Link Topics view to video resources
4. Integrate with PYQ filtering by exam type
5. Update Roadmap to show topic phases
6. Add Analytics tracking by roadmap phase
