#!/usr/bin/env node

/**
 * Validate curriculum alignment between Excel and generated blueprint
 */

import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read Excel
const excelPath = path.join(__dirname, '..', 'JEST-JAM-video-links.xlsx');
const workbook = XLSX.readFile(excelPath);
const excelSubjects = workbook.SheetNames
  .filter(name => name !== 'Index & Legend')
  .map(name => {
    const match = name.match(/^\d+\.\s+(.+)$/);
    return match ? match[1] : name;
  });

// Read generated blueprint
const blueprintPath = path.join(__dirname, '..', 'src', 'data', 'blueprint', 'jestBlueprint.json');
const blueprint = JSON.parse(fs.readFileSync(blueprintPath, 'utf-8'));
const blueprintSubjects = blueprint.subjects.map(s => s.name);

console.log('=' .repeat(80));
console.log('CURRICULUM ALIGNMENT VALIDATION');
console.log('='.repeat(80));

console.log('\nExcel Subjects (11):');
excelSubjects.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));

console.log('\nBlueprint Subjects (should match):');
blueprintSubjects.forEach((s, i) => console.log(`  ${i + 1}. ${s}`));

// Check for mismatches
console.log('\n' + '='.repeat(80));
console.log('VALIDATION RESULTS');
console.log('='.repeat(80));

const excelSet = new Set(excelSubjects);
const blueprintSet = new Set(blueprintSubjects);

if (excelSubjects.length === blueprintSubjects.length && 
    excelSubjects.every(s => blueprintSet.has(s))) {
  console.log('\n✓ Subject names match perfectly!');
  console.log(`✓ Total subjects: ${excelSubjects.length}`);
} else {
  console.log('\n✗ Subject mismatch detected!');
  const missing = excelSubjects.filter(s => !blueprintSet.has(s));
  const extra = blueprintSubjects.filter(s => !excelSet.has(s));
  if (missing.length > 0) {
    console.log('\nMissing from blueprint:');
    missing.forEach(s => console.log(`  - ${s}`));
  }
  if (extra.length > 0) {
    console.log('\nExtra in blueprint:');
    extra.forEach(s => console.log(`  + ${s}`));
  }
}

// Validate topic counts
console.log('\n' + '='.repeat(80));
console.log('TOPIC COUNT VALIDATION');
console.log('='.repeat(80));

let totalExcelTopics = 0;
for (const sheetName of workbook.SheetNames) {
  if (sheetName === 'Index & Legend') continue;
  const sheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(sheet);
  const validRows = data.filter(row => row['Chapter'] && row['Sub-topic']).length;
  totalExcelTopics += validRows;
}

const totalBlueprintTopics = blueprint.subjects.reduce((sum, s) => sum + s.chapters.length, 0);

console.log(`\nExcel topics: ${totalExcelTopics}`);
console.log(`Blueprint chapters (= topics): ${totalBlueprintTopics}`);

if (totalExcelTopics === totalBlueprintTopics) {
  console.log('✓ Topic counts match!');
} else {
  console.log('✗ Topic count mismatch!');
}

console.log('\n' + '='.repeat(80));
