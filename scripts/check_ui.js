import { getAllTopics } from '../src/engine/syllabusData.js';
const t = getAllTopics();
const vector = t.find(x => x.name.includes('Vector algebra'));
console.log('Topic 1 (Vector algebra):', vector?.metadata.difficulty, vector?.metadata.importance, vector?.metadata.priority);

const odes = t.find(x => x.name.includes('ODEs — first order'));
console.log('Topic 2 (ODEs):', odes?.metadata.difficulty, odes?.metadata.importance, odes?.metadata.priority);

const complex = t.find(x => x.name.includes('Complex algebra'));
console.log('Topic 3 (Complex algebra):', complex?.metadata.difficulty, complex?.metadata.importance, complex?.metadata.priority);
