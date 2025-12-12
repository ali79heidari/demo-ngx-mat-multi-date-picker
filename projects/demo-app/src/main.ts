import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
// @ts-ignore
import moment from 'moment';
// @ts-ignore
import moment_jalaali from 'moment-jalaali';
// @ts-ignore
import 'moment-hijri';

console.log('[Main] Moment version:', moment.version);
console.log('[Main] Jalaali jYear?', typeof moment.fn.jYear);
console.log('[Main] Moment instance jYear?', typeof moment().jYear);

const m = moment();
const mj = moment_jalaali(new Date());
console.log('[Main] mj format jYYYY:', mj.format('jYYYY'));

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
