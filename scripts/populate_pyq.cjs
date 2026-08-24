const xlsx = require('xlsx');
const fs = require('fs');

const pyqIndexPath = './src/data/pyq/pyq_index.json';
const pyqIndex = JSON.parse(fs.readFileSync(pyqIndexPath, 'utf8'));
const wb = xlsx.readFile('JEST-JAM-video-links-v5.xlsx');
const sheetNames = wb.SheetNames.filter(name => name !== 'Index & Legend');

const topicIdMap = {};
for (let i = 1; i <= 20; i++) {
  topicIdMap[`Topic ${i}`] = `phase-a-${String(i).padStart(2, '0')}`;
  topicIdMap[`Topic ${i} (light touch)`] = `phase-a-${String(i).padStart(2, '0')}`;
  topicIdMap[`Topic ${i} (atomic half)`] = `phase-a-${String(i).padStart(2, '0')}`;
  topicIdMap[`Topic ${i} (nuclear half)`] = `phase-a-${String(i).padStart(2, '0')}`;
}
for (let i = 1; i <= 11; i++) {
  topicIdMap[`Bonus #${i}`] = `phase-a-bonus-${String(i).padStart(2, '0')}`;
  topicIdMap[`Bonus #${i} (dup)`] = `phase-a-bonus-${String(i).padStart(2, '0')}`;
}

const getPhaseBTopicId = (phase, chapter, subTopic) => {
  if (!phase || !phase.startsWith('Phase B')) return null;
  const keywords = ((subTopic || '') + ' ' + (chapter || '')).toLowerCase().split(/\W+/).filter(w => w.length > 3);
  let bestTopic = null;
  let bestScore = 0;
  
  pyqIndex.topics.forEach(t => {
    if (!t.id.startsWith('phase-b')) return;
    const tKeywords = t.name.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const score = keywords.filter(w => tKeywords.includes(w)).length;
    if (score > bestScore) {
      bestScore = score;
      bestTopic = t.id;
    }
  });
  return bestTopic;
};

const getBookId = (bookStr) => {
  if (!bookStr) return null;
  bookStr = bookStr.toLowerCase();
  if (bookStr.includes('boas')) return 'boas_math_methods';
  if (bookStr.includes('arfken')) return 'arfken_weber';
  if (bookStr.includes('kleppner')) return 'kleppner';
  if (bookStr.includes('goldstein')) return 'goldstein';
  if (bookStr.includes('griffiths qm')) return 'griffiths_qm';
  if (bookStr.includes('griffiths')) return 'griffiths_em';
  if (bookStr.includes('zettili')) return 'zettili';
  if (bookStr.includes('hecht')) return 'hecht';
  if (bookStr.includes('garg')) return 'garg_bansal_ghosh_thermal_physics';
  if (bookStr.includes('reif')) return 'reif';
  if (bookStr.includes('pathria')) return 'pathria';
  if (bookStr.includes('millman')) return 'millman_halkias';
  if (bookStr.includes('beiser')) return 'beiser_concepts_of_modern_physics';
  if (bookStr.includes('kittel')) return 'kittel';
  return null;
}

// Clear all topics' relatedBooks and relatedVideos before populating
pyqIndex.topics.forEach(t => {
  t.relatedBooks = [];
  t.relatedVideos = [];
});

const unmappedTopics = new Set(pyqIndex.topics.map(t => t.id));

sheetNames.forEach(sheet => {
  const ws = wb.Sheets[sheet];
  const data = xlsx.utils.sheet_to_json(ws);
  data.forEach(row => {
    const phaseStr = row['Roadmap Topic / Phase'];
    let tId = topicIdMap[phaseStr];
    if (!tId && phaseStr && phaseStr.startsWith('Phase B')) {
      tId = getPhaseBTopicId(phaseStr, row['Chapter'], row['Sub-topic']);
    }
    
    if (tId) {
      const topic = pyqIndex.topics.find(t => t.id === tId);
      if (topic) {
        unmappedTopics.delete(tId);
        
        // Add Video
        if (row['Video URL']) {
          topic.relatedVideos.push({
            url: row['Video URL'],
            source: row['Source'],
            tag: row['JAM/JEST']
          });
        }
        
        // Add Book
        if (row['Book & Chapter Reference']) {
          const bookId = getBookId(row['Book & Chapter Reference']);
          if (bookId && !topic.relatedBooks.includes(bookId)) {
            topic.relatedBooks.push(bookId);
          }
        }
      }
    }
  });
});

console.log('Unmapped pyq_index topics (no matching row):');
Array.from(unmappedTopics).forEach(id => {
  console.log(id, '->', pyqIndex.topics.find(t => t.id === id).name);
});

fs.writeFileSync(pyqIndexPath, JSON.stringify(pyqIndex, null, 2), 'utf8');
console.log('Wrote to pyq_index.json!');
