#!/usr/bin/env node

/**
 * Comprehensive curriculum validation and audit
 */

import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('=' .repeat(80));
console.log('PHYSICS OS - COMPREHENSIVE CURRICULUM AUDIT');
console.log('='.repeat(80));

// Read Excel
const excelPath = path.join(__dirname, '..', 'JEST-JAM-video-links.xlsx');
const workbook = XLSX.readFile(excelPath);

const excelCurriculum = {};
let totalExcelTopics = 0;

for (const sheetName of workbook.SheetNames) {
  if (sheetName === 'Index & Legend') continue;
  
  const match = sheetName.match(/^\d+\.\s+(.+)$/);
  const subjectName = match ? match[1] : sheetName;
  
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  
  const chapters = {};
  const topics = [];
  
  for (const row of data) {
    if (!row['Chapter'] || !row['Sub-topic']) continue;
    
    const chapter = String(row['Chapter']).trim();
    const topic = String(row['Sub-topic']).trim();
    
    if (!chapters[chapter]) chapters[chapter] = [];
    chapters[chapter].push(topic);
    topics.push({ chapter, topic });
    totalExcelTopics++;
  }
  
  excelCurriculum[subjectName] = {
    chapters,
    topics,
    chapterCount: Object.keys(chapters).length,
    topicCount: topics.length,
  };
}

// Read blueprint
const blueprintPath = path.join(__dirname, '..', 'src', 'data', 'blueprint', 'jestBlueprint.json');
const blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf-8'));

// Validation
console.log('\n1. SUBJECT STRUCTURE');
console.log('-'.repeat(80));

let subjectValidationPassed = true;
for (const subject of blueprint.subjects) {
  const excelSubject = excelCurriculum[subject.name];
  if (!excelSubject) {
    console.log(`✗ Subject not found in Excel: ${subject.name}`);
    subjectValidationPassed = false;
    continue;
  }
  
  const blueprintTopicCount = subject.chapters.length;
  const excelTopicCount = excelSubject.topicCount;
  
  if (blueprintTopicCount !== excelTopicCount) {
    console.log(`✗ Topic count mismatch for ${subject.name}: blueprint=${blueprintTopicCount}, excel=${excelTopicCount}`);
    subjectValidationPassed = false;
  } else {
    console.log(`✓ ${subject.name}: ${blueprintTopicCount} topics`);
  }
}

if (subjectValidationPassed) {
  console.log('\n✓ All subjects match Excel structure perfectly!');
}

// Check for any Excel subjects not in blueprint
console.log('\n2. COVERAGE CHECK');
console.log('-'.repeat(80));

let coverageIssues = false;
for (const subjectName of Object.keys(excelCurriculum)) {
  const found = blueprint.subjects.find(s => s.name === subjectName);
  if (!found) {
    console.log(`✗ Excel subject not in blueprint: ${subjectName}`);
    coverageIssues = true;
  }
}

if (!coverageIssues) {
  console.log('✓ All Excel subjects are in the blueprint');
}

// Topic details
console.log('\n3. TOPIC DETAILS');
console.log('-'.repeat(80));

const topicIssues = [];

for (const subject of blueprint.subjects) {
  const excelSubject = excelCurriculum[subject.name];
  if (!excelSubject) continue;
  
  for (const chapter of subject.chapters) {
    // Check if topic name exists in Excel
    let found = false;
    for (const excelTopic of excelSubject.topics) {
      if (excelTopic.topic.toLowerCase().includes(chapter.name.toLowerCase()) || 
          chapter.name.toLowerCase().includes(excelTopic.topic.toLowerCase())) {
        found = true;
        break;
      }
    }
    
    if (!found) {
      topicIssues.push({
        subject: subject.name,
        topic: chapter.name,
        status: 'Possible mismatch'
      });
    }
  }
}

if (topicIssues.length === 0) {
  console.log('✓ All topics verified against Excel source');
} else {
  console.log(`! Found ${topicIssues.length} potential mismatches:`);
  topicIssues.slice(0, 5).forEach(issue => {
    console.log(`  - ${issue.subject}: ${issue.topic}`);
  });
  if (topicIssues.length > 5) {
    console.log(`  ... and ${topicIssues.length - 5} more`);
  }
}

// Summary
console.log('\n4. SUMMARY');
console.log('-'.repeat(80));

const totalBlueprintSubjects = blueprint.subjects.length;
const totalBlueprintTopics = blueprint.subjects.reduce((sum, s) => sum + s.chapters.length, 0);

console.log(`Excel:     ${Object.keys(excelCurriculum).length} subjects, ${totalExcelTopics} topics`);
console.log(`Blueprint: ${totalBlueprintSubjects} subjects, ${totalBlueprintTopics} topics`);

const allValid = subjectValidationPassed && !coverageIssues && topicIssues.length === 0 && 
                  totalBlueprintSubjects === Object.keys(excelCurriculum).length &&
                  totalBlueprintTopics === totalExcelTopics;

console.log('\n' + '='.repeat(80));
if (allValid) {
  console.log('✓ CURRICULUM AUDIT PASSED - Excel and Blueprint are perfectly aligned!');
} else {
  console.log('! CURRICULUM AUDIT - Some issues detected, review above');
}
console.log('='.repeat(80));
