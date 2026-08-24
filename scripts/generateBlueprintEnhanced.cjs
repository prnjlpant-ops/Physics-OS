const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Helper to clean text
function cleanText(text) {
  if (!text) return '';
  return String(text).trim();
}

// Helper to slugify
function slugify(text) {
  return cleanText(text)
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);
}

// Main extraction function
function extractCurriculumFromExcel() {
  const excelPath = path.join(__dirname, '..', 'JEST-JAM-video-links.xlsx');
  const workbook = XLSX.readFile(excelPath);

  const subjects = [];
  
  // Process each subject sheet (skip "Index & Legend")
  workbook.SheetNames.forEach((sheetName) => {
    if (sheetName === 'Index & Legend') return;

    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    // Extract subject name from sheet name (e.g., "1. Math Methods" -> "Math Methods")
    const subjectName = cleanText(sheetName.replace(/^\d+\.\s*/, ''));
    const subjectSlug = slugify(subjectName);

    // Group rows by chapter
    const chapters = {};
    const subtopicsMap = new Map(); // Track unique subtopics

    rows.forEach((row) => {
      const chapterName = cleanText(row.Chapter);
      const subtopic = cleanText(row['Sub-topic']);
      
      if (!chapterName || !subtopic) return;

      // Create unique subtopic key
      const subtopicKey = `${chapterName}::${subtopic}`;
      
      if (!subtopicsMap.has(subtopicKey)) {
        // Build the topic resource
        const topicResource = {
          // Basic Info
          name: subtopic,
          slug: slugify(subtopic),
          chapter: chapterName,
          chapterSlug: slugify(chapterName),
          
          // Exam & Roadmap
          exams: cleanText(row['JAM/JEST']).split(/[,+]/).map(e => e.trim()).filter(Boolean),
          roadmapPhase: cleanText(row['Roadmap Topic / Phase']),
          
          // Source & Links
          source: cleanText(row.Source),
          linkType: cleanText(row['Link Type']),
          videoLink: cleanText(row['Video Link']),
          
          // Study Notes
          studyNotes: cleanText(row['Study Notes (what to cover, book, timing)'])
        };

        if (!chapters[chapterName]) {
          chapters[chapterName] = [];
        }
        chapters[chapterName].push(topicResource);
        subtopicsMap.set(subtopicKey, true);
      }
    });

    // Convert chapters to array and create subject object
    const chaptersArray = Object.entries(chapters).map(([name, topics]) => ({
      name,
      slug: slugify(name),
      topics: topics,
      topicCount: topics.length
    }));

    const totalTopics = chaptersArray.reduce((sum, ch) => sum + ch.topics.length, 0);

    subjects.push({
      name: subjectName,
      id: subjectSlug,
      chapters: chaptersArray,
      topicCount: totalTopics
    });
  });

  return subjects;
}

// Generate the full blueprint
function generateEnhancedBlueprint() {
  const subjects = extractCurriculumFromExcel();

  const blueprint = {
    meta: {
      version: '2.0',
      source: 'JEST-JAM-video-links.xlsx',
      generatedAt: new Date().toISOString(),
      description: 'Enhanced curriculum with complete topic metadata, study notes, and resource links'
    },
    examPattern: {
      exams: ['JAM', 'JEST', 'JAM+JEST'],
      subjects: subjects.length,
      totalTopics: subjects.reduce((sum, s) => sum + s.topicCount, 0)
    },
    subjects: subjects
  };

  return blueprint;
}

// Main execution
function main() {
  try {
    console.log('================================================================================');
    console.log('GENERATING ENHANCED BLUEPRINT FROM EXCEL');
    console.log('================================================================================\n');

    const blueprint = generateEnhancedBlueprint();

    // Create output directory
    const blueprintDir = path.join(__dirname, '..', 'src', 'data', 'blueprint');
    if (!fs.existsSync(blueprintDir)) {
      fs.mkdirSync(blueprintDir, { recursive: true });
    }

    // Write blueprint
    const outputPath = path.join(blueprintDir, 'jestBlueprintEnhanced.json');
    fs.writeFileSync(outputPath, JSON.stringify(blueprint, null, 2));

    console.log('✓ Blueprint generated successfully\n');
    console.log('STRUCTURE SUMMARY');
    console.log('================================================================================');
    console.log(`Total Subjects: ${blueprint.subjects.length}`);
    console.log(`Total Topics: ${blueprint.examPattern.totalTopics}\n`);

    blueprint.subjects.forEach((subject) => {
      console.log(`${subject.name}: ${subject.topicCount} topics`);
      subject.chapters.forEach((chapter) => {
        console.log(`  └─ ${chapter.name}: ${chapter.topicCount} topics`);
        chapter.topics.slice(0, 2).forEach((topic) => {
          const resources = [];
          if (topic.videoLink) resources.push('Video: ' + topic.videoLink);
          if (topic.source) resources.push('Source: ' + topic.source);
          const resourceStr = resources.length ? ' (' + resources.join(', ') + ')' : '';
          console.log(`     • ${topic.name}${resourceStr}`);
        });
        if (chapter.topicCount > 2) {
          console.log(`     ... and ${chapter.topicCount - 2} more topics`);
        }
      });
    });

    console.log('\n================================================================================');
    console.log(`✓ Output: ${outputPath}`);
    console.log('================================================================================\n');

  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

main();
