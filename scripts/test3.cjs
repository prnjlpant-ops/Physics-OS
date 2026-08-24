const xlsx = require('xlsx');
const fs = require('fs');

const pyqIndex = JSON.parse(fs.readFileSync('./src/data/pyq/pyq_index.json', 'utf8'));
const booksData = JSON.parse(fs.readFileSync('./src/data/library/books.json', 'utf8'));
const wb = xlsx.readFile('JEST-JAM-video-links-v5.xlsx');
const sheetNames = wb.SheetNames.filter(name => name !== 'Index & Legend');

const bookRefs = new Set();
sheetNames.forEach(sheet => {
  const ws = wb.Sheets[sheet];
  const data = xlsx.utils.sheet_to_json(ws);
  data.forEach(row => {
    if (row['Book & Chapter Reference']) bookRefs.add(row['Book & Chapter Reference']);
  });
});
console.log(Array.from(bookRefs));
