const fs = require('fs');

const booksPath = './src/data/library/books.json';
const data = JSON.parse(fs.readFileSync(booksPath, 'utf8'));

const fixMap = {
  'boas_math_methods': { subject: 'Math Methods' },
  'vector_analysis': { path: 'Mathematical Physics/Books/vector-analysis-2ndnbsped-978-0071615457_compress.pdf' },
  'kleppner': { subject: 'Mechanics' },
  'goldstein': { subject: 'Mechanics', path: 'Classical Mechanics/Books/Classical_Mechanics_Herbert_Goldstein_Ch.pdf' },
  'ap_french': { path: 'Oscillations & Waves/Books/AP_French_Vibrations_and_Waves.pdf' },
  'griffiths_em': { subject: 'EM Theory' },
  'purcell': {},
  'griffiths_qm': { subject: 'Quantum Mechanics', path: 'Quantum Mechanics/Books/Introduction-to-Quantum-Mechanics-2nd-Edition-David-J-Griffiths.pdf' },
  'zettili': { subject: 'Quantum Mechanics', path: 'Quantum Mechanics/Books/Zettili.pdf' },
  'mcquarrie': { path: 'Quantum Mechanics/Books/Quantum Chemistry 2e By McQuarrie.pdf' },
  'zare': { path: 'Quantum Mechanics/Books/Zare Angular Momentum Understanding Spatial Aspects in Chemistry and Physics.pdf' },
  'reif': { subject: 'Thermo & StatMech', path: 'Thermodynamics/Books/Fundamentals_of_Statistical_And_Thermal_Physics-F_Reif.pdf' },
  'pathria': { subject: 'Thermo & StatMech', path: 'Statistical Mechanics/Books/PathriaBeale.pdf' },
  'hecht': { subject: 'Waves & Optics', path: 'Optics/Books/Optics - Eugene Hecht.pdf' },
  'kittel': { subject: 'Condensed Matter', path: 'Solid State Physics/Books/Introduction-to-Solid-State-PhysicsCharles-Kittel.pdf' },
  'sedra_smith': { path: 'Electronics/Books/Microelectronic Circuits by Sedra and Smith.pdf' },
  'horowitz': { path: 'Electronics/Books/Thomas-C.-Hayes-Paul-Horowitz-The-Art-of-Electronics-Student-Manual-Cambridge-University-Press-1989.pdf' },
  'garg_bansal_ghosh_thermal_physics': { subject: 'Thermo & StatMech' },
  'beiser_concepts_of_modern_physics': { subject: 'Atomic Molecular' },
  'millman_halkias': { subject: 'Electronics' },
  'arfken_weber': { subject: 'Math Methods', path: 'Mathematical Physics/Books/Methods for Physicists - Arfken Weber Harris.pdf' },
  'sakurai_modern_qm': {},
  'morris_mano_digital_logic': {},
  'kittel_kroemer_thermal_physics': {}
};

data.books.forEach(b => {
  const fixes = fixMap[b.id];
  if (fixes) {
    if (fixes.subject) b.subject = fixes.subject;
    if (fixes.path) b.path = fixes.path;
  }
});

fs.writeFileSync(booksPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Books updated');
