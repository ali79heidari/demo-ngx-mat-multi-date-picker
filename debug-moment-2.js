const m = require('moment');
const mj = require('moment-jalaali');
const mh = require('moment-hijri');

console.log('Hijri export type:', typeof mh);
console.log('Hijri export has iYear?', mh ? typeof mh.iYear : 'null');
if (mh && mh.fn) {
    console.log('Hijri export fn.iYear?', typeof mh.fn.iYear);
}

// Check if patches stuck to base moment after explicit require
console.log('Base has iYear after import?', typeof m().iYear);
console.log('Base fn iYear?', typeof m.fn.iYear);

// Maybe mh is the patched moment?
if (typeof mh === 'function') {
    const mh_inst = mh();
    console.log('mh instance has iYear?', typeof mh_inst.iYear);
}
