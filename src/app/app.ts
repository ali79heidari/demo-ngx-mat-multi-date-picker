import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import dayjs, { Dayjs } from 'dayjs';
import * as jalaali from 'jalaali-js';
import 'dayjs/locale/fa';
import 'dayjs/locale/ar';
import {
  CalendarType,
  CustomHolidayRule,
  MultiDatepickerComponent,
  MultiDateRangePickerComponent,
  StartDayOfWeek
} from 'ngx-mat-multi-date-picker';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MultiDatepickerComponent,
    MultiDateRangePickerComponent,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatCheckboxModule,
    MatInputModule,
    MatRadioModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  calendarType: CalendarType = 'jalali';
  dateValue: Dayjs | null = dayjs();
  startDay: StartDayOfWeek = 'saturday';

  showGregorianHolidays = false;
  showJalaliHolidays = false;
  showHijriHolidays = false;

  types: {value: CalendarType, label: string}[] = [
    { value: 'jalali', label: 'Jalali (Persian)' },
    { value: 'gregorian', label: 'Gregorian' },
    { value: 'hijri', label: 'Hijri (Lunar)' }
  ];

  startDays: {value: StartDayOfWeek, label: string}[] = [
    { value: 'saturday', label: 'Saturday (Jalali Default)' },
    { value: 'sunday', label: 'Sunday (Gregorian Default)' },
    { value: 'monday', label: 'Monday (ISO Default)' }
  ];

  weekendDays: number[] = [];

  daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  // Custom Holidays Input
  customHolidaysInput = '2025-01: 1,2,3; 2025-12: 10';

  get parsedCustomHolidays(): CustomHolidayRule[] {
    if (!this.customHolidaysInput) return [];

    const rules: CustomHolidayRule[] = [];
    const parts = this.customHolidaysInput.split(';'); // Split different Month/Year rules

    for (const part of parts) {
      if (!part.trim()) continue;
      // Expected format: YYYY-MM: D,D,D
      const [ym, daysStr] = part.split(':');
      if (!ym || !daysStr) continue;

      const [y, m] = ym.trim().split('-');
      const year = parseInt(y, 10);
      const month = parseInt(m, 10);

      if (isNaN(year) || isNaN(month)) continue;

      const days: number[] = daysStr.split(',')
        .map(d => parseInt(d.trim(), 10))
        .filter(d => !isNaN(d));

      rules.push({ year, month, days });
    }

    return rules;
  }

  get gregorianDate(): string {
    if (!this.dateValue) return '';
    // Ensure we are working with a standard Gregorian Dayjs object
    const d = dayjs(this.dateValue.valueOf());
    return d.format('YYYY/MM/DD');
  }

  get jalaliDate(): string {
    if (!this.dateValue) return '';
    // Ensure we are working with a standard Gregorian Dayjs object for conversion source
    const d = dayjs(this.dateValue.valueOf());
    // @ts-ignore
    const j = jalaali.toJalaali(d.year(), d.month() + 1, d.date());
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${j.jy}/${pad(j.jm)}/${pad(j.jd)}`;
  }

  get hijriDate(): string {
    if (!this.dateValue) return '';
    // Use dayjs-hijri
    // @ts-ignore
    if (this.dateValue.calendar) {
         // @ts-ignore
        return this.dateValue.calendar('hijri').format('YYYY/MM/DD');
    }
    return '';
  }

  // Showcase Examples Data
  dateJalali: Dayjs | null = dayjs();
  dateGregorian: Dayjs | null = dayjs();
  dateHijri: Dayjs | null = dayjs();
  dateCustom: Dayjs | null = dayjs().year(2025).month(0).date(15);
  dateTouch: Dayjs | null = dayjs();
  dateColored: Dayjs | null = dayjs();

  exampleCustomHolidays: CustomHolidayRule[] = [
    { year: 2025, month: 1, days: [1, 15, 20] }, // Jan 1st, 15th, 20th
    { year: 2025, month: 12, days: [25] }
  ];

  // Range Picker
  rangeStart: Dayjs | null = dayjs();
  rangeEnd: Dayjs | null = dayjs().add(5, 'day');
  rangeCalendarType: CalendarType = 'gregorian';

  // Picker Modes
  dateMonthPicker: Dayjs | null = dayjs();
  dateYearPicker: Dayjs | null = dayjs();

  // Advanced Features Data
  dateMinMax: Dayjs | null = dayjs();
  minDate: Dayjs = dayjs().subtract(7, 'day');
  maxDate: Dayjs = dayjs().add(7, 'day');

  dateFilterValue: Dayjs | null = dayjs();
  // Filter: Only allow even dates
  myDateFilter = (d: Dayjs | null): boolean => {
    if (!d) return true;
    return d.date() % 2 === 0;
  };

  dateStartView: Dayjs | null = dayjs();

  dateMixedClass: Dayjs | null = dayjs();
  // Custom Date Class: Highlight 15th of month
  myDateClass = (d: Dayjs): string => {
    if (d.date() === 15) {
      return 'custom-blue-date';
    }
    return '';
  };
}



