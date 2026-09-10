#!/usr/bin/env node

/**
 * Generate the authoritative JEST blueprint from the Excel workbook.
 * This script reads JEST-JAM-video-links-v5.xlsx and generates jestBlueprint.json
 * to make the Excel the single source of truth for curriculum structure.
 */

import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function cleanName(name) {
  if (!name) return null;
  const cleaned = String(name).trim();
  if (!cleaned || cleaned.toLowerCase() === 'none' || cleaned.toLowerCase() === 'nan') {
    return null;
  }
  return cleaned;
}

function slugify(name) {
  if (!name) return '';
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[-\s]+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '');
  return slug;
}

// v5 carries its scheduling priority as Roadmap Topic / Phase rather than a
// separate Priority column. Keep this conversion here so the generated
// blueprint, Subject views, Syllabus filters, and Today's Mission agree.
function priorityFromRoadmapPhase(value) {
  const phase = String(value ?? '').toLowerCase()
  if (/\btopic\s*(?:[1-9]|1\d|20)\b/.test(phase) || phase.includes('supplemental')) return 'High'
  if (phase.includes('bonus')) return 'Medium'
  if (phase.includes('tier 1')) return 'Medium'
  if (phase.includes('tier 2') || phase.includes('tier 3')) return 'Low'
  return 'Medium'
}

function highestPriority(values) {
  if (values.includes('High')) return 'High'
  if (values.includes('Medium')) return 'Medium'
  return 'Low'
}

function extractCurriculumFromExcel(excelPath) {
  console.log(`\nReading Excel workbook: ${excelPath}`);
  
  const workbook = XLSX.readFile(excelPath);
  const subjectsMap = {};
  
  for (const sheetName of workbook.SheetNames) {
    if (sheetName === 'Index & Legend') continue;
    
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    
    // Parse sheet name: "1. Math Methods" -> "Math Methods"
    const match = sheetName.match(/^\d+\.\s+(.+)$/);
    const subjectName = match ? match[1] : sheetName;
    
    // Flatten all topics directly (not grouped by chapter)
    const topicsList = [];
    
    for (const row of data) {
      const chapter = cleanName(row['Chapter']);
      const subtopic = cleanName(row['Sub-topic']);
      
      if (!chapter || !subtopic) continue;
      
      const topicData = {
        name: subtopic,
        slug: slugify(subtopic),
        chapter: chapter,  // Keep track of which chapter it came from
        roadmapPhase: cleanName(row['Roadmap Topic / Phase']),
        priority: priorityFromRoadmapPhase(row['Roadmap Topic / Phase']),
        exams: cleanName(row['JAM/JEST']),
        source: cleanName(row['Source']),
        linkType: cleanName(row['Link Type']),
        resourceId: cleanName(row['Resource ID']),
        videoLink: cleanName(row['Video URL']) || cleanName(row['Video Link']),
        duration: cleanName(row['Duration']),
        bookReference: cleanName(row['Book & Chapter Reference']),
        whatToCover: cleanName(row['What to Watch / Cover']),
        timing: cleanName(row['Timing (Phase & Deadline)']),
        additionalNotes: cleanName(row['Additional Notes']),
      };
      
      topicsList.push(topicData);
    }
    
    subjectsMap[subjectName] = {
      name: subjectName,
      slug: slugify(subjectName),
      topics: topicsList,
      topicCount: topicsList.length,
    };
  }
  
  return subjectsMap;
}

function generateBlueprint(subjectsMap) {
  const blueprint = {
    meta: {
      title: 'JEST Physics 2027 — Master Strategic Blueprint',
      track: 'Concurrent Preparation Track: JEST + IIT JAM Physics',
      sourceFormat: 'excel',
      sourceFile: 'JEST-JAM-video-links.xlsx',
      generatedFrom: 'scripts/generateBlueprint.js',
      note: 'This blueprint is generated from the Excel workbook. Do not edit directly; regenerate from Excel.',
    },
    examPattern: {
      duration: '3 hours (180 minutes)',
      mode: 'Predominantly offline (pen-and-paper)',
      medium: 'English',
      calculatorAllowed: false,
      sections: [
        {
          name: 'Part A',
          questions: 10,
          type: 'MCQ',
          marksCorrect: 1,
          marksIncorrect: -0.3333,
          totalMarks: 10,
        },
        {
          name: 'Part B',
          questions: 20,
          type: 'MCQ',
          marksCorrect: 3,
          marksIncorrect: -1,
          totalMarks: 60,
        },
        {
          name: 'Part C',
          questions: 10,
          type: 'NAT',
          marksCorrect: 3,
          marksIncorrect: 0,
          totalMarks: 30,
        },
      ],
      totalQuestions: 40,
      totalMarks: 100,
    },
    subjects: [],
  };
  
  // Add subjects to blueprint
  for (const [, subjectData] of Object.entries(subjectsMap)) {
    const subjectObj = {
      name: subjectData.name,
      id: subjectData.slug,
      weightageRange: '',
      priority: 'Medium',
      jamOverlap: 'Medium',
      deadline: '',
      primaryBook: '',
      primaryVideo: '',
      difficultyOverall: 'Medium',
      coreOverlapTopics: '',
      jestExclusiveTopics: '',
      chapters: [],
      resources: {
        books: [],
        videos: [],
        solutionManuals: [],
      },
    };
    
    // Preserve the workbook's Chapter -> Sub-topic hierarchy and attach
    // each row's resources to that exact chapter/topic.
    const chaptersByName = new Map();
    for (const topic of subjectData.topics) {
      if (!chaptersByName.has(topic.chapter)) {
        chaptersByName.set(topic.chapter, {
          name: topic.chapter, slug: slugify(topic.chapter), topics: [],
          weightage: 'Medium', priority: topic.priority, pyqFrequency: 'Frequently Tested', mathPrerequisites: '',
          difficulty: 'Medium', highYieldStars: 3, commonMisconceptions: '', questionStyle: '',
          resources: { books: [], videos: [] },
        });
      }
      const chapter = chaptersByName.get(topic.chapter);
      chapter.topics.push(topic);
      chapter.priority = highestPriority(chapter.topics.map((entry) => entry.priority));
      if (topic.bookReference) chapter.resources.books.push({
        id: `${topic.resourceId || topic.slug}__book`, title: topic.bookReference,
        author: 'Workbook reference', description: topic.whatToCover || '', syllabus: topic.name,
        topicName: topic.name, source: 'JEST-JAM-video-links-v5.xlsx',
      });
      if (topic.videoLink) chapter.resources.videos.push({
        id: `${topic.resourceId || topic.slug}__video`, title: topic.source || topic.name,
        url: topic.videoLink, duration: topic.duration || '', description: topic.whatToCover || '',
        syllabus: topic.name, topicName: topic.name, source: topic.source || 'Workbook video',
      });
    }
    subjectObj.chapters.push(...chaptersByName.values());
    subjectObj.priority = highestPriority(subjectObj.chapters.map((chapter) => chapter.priority));
    
    blueprint.subjects.push(subjectObj);
  }
  
  return blueprint;
}

function main() {
  const projectRoot = path.join(__dirname, '..');
  const excelPath = path.join(projectRoot, 'JEST-JAM-video-links-v5.xlsx');
  const outputPath = path.join(projectRoot, 'src', 'data', 'blueprint', 'jestBlueprint.json');
  
  console.log('================================================================================');
  console.log('Generating blueprint from Excel workbook...');
  console.log('================================================================================');
  
  // Extract curriculum
  const subjectsMap = extractCurriculumFromExcel(excelPath);
  
  console.log(`\n✓ Extracted ${Object.keys(subjectsMap).length} subjects from Excel:`);
  for (const [subjectName, subjectData] of Object.entries(subjectsMap)) {
    console.log(
      `  • ${subjectName}: ${subjectData.topicCount} topics`
    );
  }
  
  // Generate blueprint
  const blueprint = generateBlueprint(subjectsMap);
  
  // Write blueprint
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(blueprint, null, 2), 'utf-8');
  
  console.log(`\n✓ Blueprint written to: ${outputPath}`);
  console.log(`✓ Total subjects: ${blueprint.subjects.length}`);
  
  // Print summary
  const totalChapters = blueprint.subjects.reduce((sum, s) => sum + s.chapters.length, 0);
  const totalTopics = blueprint.subjects.reduce((sum, s) => sum + s.chapters.length, 0);
  console.log(`✓ Total chapters (topics flattened): ${totalChapters}`);
  
  console.log('\n================================================================================');
  console.log('Blueprint generation complete!');
  console.log('================================================================================');
}

main();
