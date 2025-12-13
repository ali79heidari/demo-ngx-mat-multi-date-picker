import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import dayjs from 'dayjs';
import * as jalaali from 'jalaali-js';
import localeData from 'dayjs/plugin/localeData';
import 'dayjs/locale/fa';
import 'dayjs/locale/ar';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import hijri from 'dayjs-hijri';

dayjs.extend(localeData);
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(hijri);


bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
