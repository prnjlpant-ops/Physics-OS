const xlsx = require('xlsx');
const wb = xlsx.readFile('JEST-JAM-video-links-v5.xlsx');
const sheetNames = wb.SheetNames.filter(name => name !== 'Index & Legend');
const firstSheet = sheetNames[0];
const ws = wb.Sheets[firstSheet];
const data = xlsx.utils.sheet_to_json(ws);
console.log(data.map(r => r['Resource ID'] + ' | ' + r['Roadmap Topic / Phase']).slice(0, 10));
