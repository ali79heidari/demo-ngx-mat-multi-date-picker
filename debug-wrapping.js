const m = require('moment');
const mj = require('moment-jalaali');
const mh = require('moment-hijri');

console.log('--- Debugging Wrappers ---');

const base = m();
console.log('Base moment:', base.format('YYYY-MM-DD'));
console.log('Base is jalaali?', typeof base.jYear);

const wrappedJ = mj(base);
console.log('Wrapped Jalaali type:', typeof wrappedJ);
console.log('Wrapped Jalaali jYear?', typeof wrappedJ.jYear);
console.log('Wrapped Jalaali format jYYYY:', wrappedJ.format('jYYYY'));

const wrappedH = mh(base);
console.log('Wrapped Hijri type:', typeof wrappedH);
console.log('Wrapped Hijri iYear?', typeof wrappedH.iYear);
console.log('Wrapped Hijri format iYYYY:', wrappedH.format('iYYYY'));

// Test wrapping a CLONE
const cloneJ = mj(base.clone());
console.log('Clone Jalaali format jYYYY:', cloneJ.format('jYYYY'));

// Test wrapping a JS Date
const fromDateJ = mj(base.toDate());
console.log('From Date Jalaali format jYYYY:', fromDateJ.format('jYYYY'));
