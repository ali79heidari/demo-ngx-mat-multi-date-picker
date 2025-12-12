const m = require('moment');
const mj = require('moment-jalaali');
require('moment-hijri');

console.log('Base moment version:', m.version);
console.log('Jalaali moment version:', mj.version);

const m1 = m();
const m2 = mj();

console.log('Base has jYear?', typeof m1.jYear);
console.log('Base has iYear?', typeof m1.iYear);

console.log('Jalaali has jYear?', typeof m2.jYear);
console.log('Jalaali has iYear?', typeof m2.iYear);

// Check if they are the same
console.log('m === mj?', m === mj);

// Check prototype mutation
console.log('m.fn.jYear?', typeof m.fn.jYear);
console.log('m.fn.iYear?', typeof m.fn.iYear);
