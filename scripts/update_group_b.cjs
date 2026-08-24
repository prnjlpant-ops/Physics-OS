const fs = require('fs');

const booksPath = './src/data/library/books.json';
const data = JSON.parse(fs.readFileSync(booksPath, 'utf8'));

const groupBIds = [
  'vector_analysis',
  'ap_french',
  'mcquarrie',
  'zare',
  'sedra_smith',
  'horowitz'
];

data.books.forEach(b => {
  if (groupBIds.includes(b.id)) {
    b.subject = 'Supplementary';
  }
});

fs.writeFileSync(booksPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Group B updated.');
