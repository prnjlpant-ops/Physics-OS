const XLSX = require('xlsx');
const path = require('path');
const workbook = XLSX.readFile(path.join(__dirname, '..', 'JEST-JAM-video-links.xlsx'));

// Show actual subject sheet
const sheet = workbook.Sheets[workbook.SheetNames[1]];
const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });

console.log('=== SUBJECT SHEET STRUCTURE ===');
console.log('Sheet Name:', workbook.SheetNames[1]);
console.log('Total Rows:', data.length);
console.log('\n=== ALL COLUMN HEADERS ===');
if(data.length > 0) {
  const headers = Object.keys(data[0]);
  headers.forEach((h, i) => console.log((i+1) + '. ' + h));
}

console.log('\n=== FIRST ROW COMPLETE DATA ===');
if(data.length > 0) {
  const row = data[0];
  Object.entries(row).forEach(([k, v]) => {
    console.log('\n' + k + ':');
    console.log(String(v).substring(0, 300));
  });
}

console.log('\n\n=== FIRST 3 ROWS OVERVIEW ===');
data.slice(0, 3).forEach((row, idx) => {
  console.log('\nRow ' + idx + ':');
  Object.entries(row).forEach(([k, v]) => {
    if(v && String(v).trim()) {
      console.log('  ' + k + ': ' + String(v).substring(0, 100));
    }
  });
});
