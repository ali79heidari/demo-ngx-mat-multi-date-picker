import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MultiDatepickerComponent, CalendarType, StartDayOfWeek, CustomHolidayRule } from 'ngx-multi-date-picker';
import dayjs, { Dayjs } from 'dayjs';
import * as jalaali from 'jalaali-js';
import 'dayjs/locale/fa';
import 'dayjs/locale/ar';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MultiDatepickerComponent,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatCheckboxModule,
    MatInputModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  calendarType: CalendarType = 'jalaali';
  dateValue: Dayjs | null = dayjs();
  startDay: StartDayOfWeek = 'saturday';

  showGregorianHolidays = false;
  showJalaaliHolidays = false;
  showHijriHolidays = false;

  types: {value: CalendarType, label: string}[] = [
    { value: 'jalaali', label: 'Jalaali (Persian)' },
    { value: 'gregorian', label: 'Gregorian' },
    { value: 'hijri', label: 'Hijri (Lunar)' }
  ];

  startDays: {value: StartDayOfWeek, label: string}[] = [
    { value: 'saturday', label: 'Saturday (Jalaali Default)' },
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

  get jalaaliDate(): string {
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
}



