import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MultiDatepickerComponent, CalendarType, StartDayOfWeek, CustomHolidayRule } from 'ngx-multi-date-picker';
import moment from 'moment';
// @ts-ignore
import moment_jalaali from 'moment-jalaali';
// @ts-ignore
import moment_hijri from 'moment-hijri';

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
  dateValue: moment.Moment | null = moment();
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
    return moment(this.dateValue).format('YYYY/MM/DD');
  }

  get jalaaliDate(): string {
    if (!this.dateValue) return '';
    return moment_jalaali(this.dateValue).format('jYYYY/jM/jD');
  }

  get hijriDate(): string {
    if (!this.dateValue) return '';
    return moment_hijri(this.dateValue).format('iYYYY/iM/iD');
  }
}
