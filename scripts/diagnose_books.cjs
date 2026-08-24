const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const root = 'Z:/Academics/Knowledge Base';
const booksPath = './src/data/library/books.json';
const booksData = JSON.parse(fs.readFileSync(booksPath, 'utf8'));

// 1. Scan Z:/Academics/Knowledge Base for all PDFs
const allPdfs = [];
function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.toLowerCase().endsWith('.pdf')) {
      allPdfs.push(fullPath.replace(/\\/g, '/').replace(root + '/', ''));
    }
  }
}
walk(root);

function findBestMatch(bookId, title, author) {
  // Simple heuristic: search allPdfs for keywords from title/author or id
  const keywords = [...title.split(/\W+/), ...author.split(/\W+/), ...bookId.split('_')].filter(w => w.length > 3).map(w => w.toLowerCase());
  let bestMatch = null;
  let bestScore = 0;
  for (const pdf of allPdfs) {
    if (pdf.toLowerCase().includes('pyq')) continue;
    const pdfLower = pdf.toLowerCase();
    let score = 0;
    keywords.forEach(k => {
      if (pdfLower.includes(k)) score++;
    });
    if (score > bestScore) {
      bestScore = score;
      bestMatch = pdf;
    }
  }
  return { path: bestMatch, score: bestScore };
}

// 2. Establish ground truth from Excel
const wb = xlsx.readFile('JEST-JAM-video-links-v5.xlsx');
const sheetNames = wb.SheetNames.filter(name => name !== 'Index & Legend');

const bookToSubjectMap = {}; // Maps bookId to subjectName

sheetNames.forEach(sheet => {
  const match = sheet.match(/^\d+\.\s+(.+)$/);
  const subjectName = match ? match[1] : sheet;
  
  const ws = wb.Sheets[sheet];
  const data = xlsx.utils.sheet_to_json(ws);
  data.forEach(row => {
    const bookStr = row['Book & Chapter Reference'] || '';
    const bs = bookStr.toLowerCase();
    
    let matchedId = null;
    if (bs.includes('boas')) matchedId = 'boas_math_methods';
    else if (bs.includes('spiegel')) matchedId = 'vector_analysis';
    else if (bs.includes('arfken')) matchedId = 'arfken_weber';
    else if (bs.includes('kleppner')) matchedId = 'kleppner';
    else if (bs.includes('goldstein')) matchedId = 'goldstein';
    else if (bs.includes('french')) matchedId = 'ap_french';
    else if (bs.includes('griffiths') && subjectName === 'EM Theory') matchedId = 'griffiths_em';
    else if (bs.includes('griffiths') && subjectName === 'Quantum Mechanics') matchedId = 'griffiths_qm';
    else if (bs.includes('purcell')) matchedId = 'purcell';
    else if (bs.includes('zettili')) matchedId = 'zettili';
    else if (bs.includes('mcquarrie')) matchedId = 'mcquarrie';
    else if (bs.includes('zare')) matchedId = 'zare';
    else if (bs.includes('sakurai')) matchedId = 'sakurai_modern_qm';
    else if (bs.includes('reif')) matchedId = 'reif';
    else if (bs.includes('pathria')) matchedId = 'pathria';
    else if (bs.includes('garg')) matchedId = 'garg_bansal_ghosh_thermal_physics';
    else if (bs.includes('kittel') && bs.includes('kroemer')) matchedId = 'kittel_kroemer_thermal_physics';
    else if (bs.includes('hecht')) matchedId = 'hecht';
    else if (bs.includes('kittel') && subjectName === 'Condensed Matter') matchedId = 'kittel';
    else if (bs.includes('sedra')) matchedId = 'sedra_smith';
    else if (bs.includes('horowitz')) matchedId = 'horowitz';
    else if (bs.includes('millman')) matchedId = 'millman_halkias';
    else if (bs.includes('beiser')) matchedId = 'beiser_concepts_of_modern_physics';
    else if (bs.includes('mano')) matchedId = 'morris_mano_digital_logic';
    
    if (matchedId) {
      if (!bookToSubjectMap[matchedId]) bookToSubjectMap[matchedId] = new Set();
      bookToSubjectMap[matchedId].add(subjectName);
    }
  });
});

console.log("=== DIAGNOSIS & REASSIGNMENT ===");
booksData.books.forEach(b => {
  const oldSubject = b.subject;
  const newSubject = bookToSubjectMap[b.id] ? Array.from(bookToSubjectMap[b.id])[0] : 'UNRESOLVED';
  
  const fullPath = path.join(root, b.path);
  const oldPathExists = fs.existsSync(fullPath);
  
  let newPath = b.path;
  let newPathStatus = oldPathExists ? 'EXISTS' : 'MISSING';
  
  if (!oldPathExists) {
    const match = findBestMatch(b.id, b.title, b.author);
    if (match.path && match.score > 1) {
      newPath = match.path;
      newPathStatus = 'FIXED';
    }
  }
  
  console.log(`| ${b.id.padEnd(35)} | ${oldSubject.padEnd(25)} | ${newSubject.padEnd(20)} | ${oldPathExists ? 'EXISTS' : 'MISSING'.padEnd(7)} | ${newPathStatus.padEnd(7)} | ${newPath}`);
});
