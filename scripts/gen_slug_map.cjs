const xlsx = require('xlsx');
const fs = require('fs');

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

const pyqIndex = JSON.parse(fs.readFileSync('./src/data/pyq/pyq_index.json', 'utf8'));

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

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

const chapterToTopicSlugMap = {};

sheetNames.forEach(sheet => {
  const ws = wb.Sheets[sheet];
  const data = xlsx.utils.sheet_to_json(ws);
  data.forEach(row => {
    const chapterName = row['Chapter'];
    if (!chapterName) return;
    
    const phaseStr = row['Roadmap Topic / Phase'];
    let tId = topicIdMap[phaseStr];
    if (!tId && phaseStr && phaseStr.startsWith('Phase B')) {
      tId = getPhaseBTopicId(phaseStr, chapterName, row['Sub-topic']);
    }
    
    if (tId) {
      const slug = slugify(chapterName);
      if (!chapterToTopicSlugMap[slug]) {
        chapterToTopicSlugMap[slug] = [];
      }
      if (!chapterToTopicSlugMap[slug].includes(tId)) {
        chapterToTopicSlugMap[slug].push(tId);
      }
    }
  });
});

console.log(JSON.stringify(chapterToTopicSlugMap, null, 2));
