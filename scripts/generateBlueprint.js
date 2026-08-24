#!/usr/bin/env node

/**
 * Generate the authoritative JEST blueprint from the Excel workbook.
 * This script reads JEST-JAM-video-links.xlsx and generates jestBlueprint.json
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
        exams: cleanName(row['JAM/JEST']),
        source: cleanName(row['Source']),
        linkType: cleanName(row['Link Type']),
        videoLink: cleanName(row['Video Link']),
        studyNotes: cleanName(row['Study Notes (what to cover, book, timing)']),
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
    
    // Convert topics to chapters (each Excel sub-topic becomes a "chapter" in blueprint terms)
    for (const topic of subjectData.topics) {
      const chapterObj = {
        name: topic.name,
        slug: topic.slug,
        weightage: 'Medium',
        pyqFrequency: topic.exams ? 'Frequently Tested' : 'Occasionally Tested',
        mathPrerequisites: '',
        difficulty: 'Medium',
        highYieldStars: 3,
        commonMisconceptions: '',
        questionStyle: '',
      };
      subjectObj.chapters.push(chapterObj);
    }
    
    blueprint.subjects.push(subjectObj);
  }
  
  return blueprint;
}

function main() {
  const projectRoot = path.join(__dirname, '..');
  const excelPath = path.join(projectRoot, 'JEST-JAM-video-links.xlsx');
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
