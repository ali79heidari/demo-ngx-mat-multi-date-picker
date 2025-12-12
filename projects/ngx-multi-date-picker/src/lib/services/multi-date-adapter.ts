import { Inject, Injectable, Optional } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import moment from 'moment';
// @ts-ignore
import moment_jalaali from 'moment-jalaali';
// @ts-ignore
import moment_hijri from 'moment-hijri';
import { Subject } from 'rxjs';

export type CalendarType = 'gregorian' | 'jalaali' | 'hijri';
export type StartDayOfWeek = 'saturday' | 'sunday' | 'monday';

declare module 'moment' {
  interface Moment {
    jYear(): number;
    jYear(y: number): moment.Moment;
    jMonth(): number;
    jMonth(m: number): moment.Moment;
    jDate(): number;
    jDate(d: number): moment.Moment;
    jDayOfYear(): number;
    jDayOfYear(d: number): moment.Moment;
    jWeek(): number;
    jWeek(w: number): moment.Moment;
    jWeekYear(): number;
    jWeekYear(y: number): moment.Moment;

    iYear(): number;
    iYear(y: number): moment.Moment;
    iMonth(): number;
    iMonth(m: number): moment.Moment;
    iDate(): number;
    iDate(d: number): moment.Moment;
    iDayOfYear(): number;
    iDayOfYear(d: number): moment.Moment;

    format(format?: string): string;
  }
}

@Injectable()
export class MultiDateAdapter extends DateAdapter<moment.Moment> {
  private _calendarType: CalendarType = 'jalaali';
  private _customStartDay: number | null = null;
  // @ts-ignore
  override readonly changes = new Subject<void>();

  constructor(@Optional() @Inject(MAT_DATE_LOCALE) dateLocale: string) {
    super();
    this.setLocale(dateLocale || 'fa');
    moment.locale(this.locale);
    moment_jalaali.locale(this.locale);
    moment_hijri.locale(this.locale);
    console.log('[MultiDateAdapter] - Strategy: Aggressive Re-wrapping');
  }

  setCalendarType(type: CalendarType) {
    this._calendarType = type;
    this.changes.next();
  }

  setStartDay(day: StartDayOfWeek) {
    switch (day) {
      case 'saturday': this._customStartDay = 6; break;
      case 'sunday': this._customStartDay = 0; break;
      case 'monday': this._customStartDay = 1; break;
    }
    this.changes.next();
  }

  private _wrap(date: moment.Moment, type?: CalendarType): any {
    const targetType = type || this._calendarType;
    if (!date || !date.isValid()) return date;
    
    // Aggressively re-wrap to ensure the instance prototype matches the library
    // This is crucial because moment-jalaali/hijri extend the prototype of their OWN instances
    // but might not successfully patch the global 'moment' if webpack isolates modules.
    // By creating a fresh instance via the specific library, we guarantee the methods exist.
    if (targetType === 'jalaali') {
        // .toDate() strips it down to a JS Date, ensuring clean re-creation
        const jm = moment_jalaali(date.toDate());
        jm.locale(this.locale);
        return jm;
    }
    if (targetType === 'hijri') {
        const hm = moment_hijri(date.toDate());
        // Hijri library often defaults to Arabic-Indic digits unless 'en' locale or specific settings are used
        // We set to 'en' temporarily for consistent parsing/formatting math, but display might need 'fa' or 'ar'
        // For now, let's keep it 'en' to ensure iYear/iMonth math works predictably (some versions have issues with non-latin digits)
        // or just inherit. Let's try inheriting first.
        hm.locale(this.locale); 
        return hm;
    }
    
    const m = moment(date.toDate());
    m.locale(this.locale);
    return m;
  }

  getYear(date: moment.Moment): number {
    const d = this._wrap(date);
    if (this._calendarType === 'jalaali') return d.jYear();
    if (this._calendarType === 'hijri') return d.iYear();
    return d.year();
  }

  getMonth(date: moment.Moment): number {
    const d = this._wrap(date);
    if (this._calendarType === 'jalaali') return d.jMonth();
    if (this._calendarType === 'hijri') return d.iMonth();
    return d.month();
  }

  getDate(date: moment.Moment): number {
    const d = this._wrap(date);
    if (this._calendarType === 'jalaali') return d.jDate();
    if (this._calendarType === 'hijri') return d.iDate();
    return d.date();
  }

  getDayOfWeek(date: moment.Moment): number {
    return date.day();
  }

  getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (this._calendarType === 'jalaali') {
      return ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    }
    if (this._calendarType === 'hijri') {
        return ['محرم', 'صفر', 'ربیع‌الاول', 'ربیع‌الثانی', 'جمادی‌الاول', 'جمادی‌الثانی', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذی‌القعده', 'ذی‌الحجه'];
    }
    return moment.localeData(this.locale).months();
  }

  getDateNames(): string[] {
    const days = [];
    for (let i = 1; i <= 31; i++) days.push(String(i));
    return days;
  }

  getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    if (this._calendarType === 'jalaali') {
        return ['یک‌شنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه', 'شنبه'];
    }
    return moment.localeData(this.locale).weekdaysMin();
  }

  getYearName(date: moment.Moment): string {
    const d = this._wrap(date);
    if (this._calendarType === 'jalaali') return String(d.jYear());
    if (this._calendarType === 'hijri') return String(d.iYear());
    return String(d.year());
  }

  getFirstDayOfWeek(): number {
    if (this._customStartDay !== null) return this._customStartDay;
    return this._calendarType === 'jalaali' ? 6 : 0;
  }

  getNumDaysInMonth(date: moment.Moment): number {
    const d = this._wrap(date);
    if (this._calendarType === 'jalaali') return moment_jalaali.jDaysInMonth(d.jYear(), d.jMonth());
    if (this._calendarType === 'hijri') return moment_hijri.iDaysInMonth(d.iYear(), d.iMonth());
    return d.daysInMonth();
  }

  clone(date: moment.Moment): moment.Moment {
    // We can just clone the standard moment, wrapping handles the rest on demand
    return date.clone();
  }

  createDate(year: number, month: number, date: number): moment.Moment {
    if (this._calendarType === 'jalaali') {
       return moment_jalaali(`${year}/${month + 1}/${date}`, 'jYYYY/jM/jD').locale(this.locale);
    }
    if (this._calendarType === 'hijri') {
       return moment_hijri(`${year}/${month + 1}/${date}`, 'iYYYY/iM/iD').locale(this.locale);
    }
    return moment([year, month, date]).locale(this.locale);
  }

  today(): moment.Moment {
    if (this._calendarType === 'jalaali') return moment_jalaali().locale(this.locale);
    if (this._calendarType === 'hijri') return moment_hijri().locale(this.locale);
    return moment().locale(this.locale);
  }

  parse(value: any, parseFormat: any): moment.Moment | null {
    if (value && typeof value === 'string') {
        if (this._calendarType === 'jalaali') {
            return moment_jalaali(value, 'jYYYY/jM/jD');
        }
        if (this._calendarType === 'hijri') {
            return moment_hijri(value, 'iYYYY/iM/iD');
        }
        return moment(value, parseFormat);
    }
    return value ? moment(value).locale(this.locale) : null;
  }

  format(date: moment.Moment, displayFormat: any): string {
    const d = this._wrap(date);
    if (!this.isValid(d)) {
      throw Error('MultiDateAdapter: Cannot format invalid date.');
    }
    
    // Explicitly enforce the format based on type.
    // By wrapping correctly above, 'jYYYY' should now be parsed by moment-jalaali.
    
    try {
        if (this._calendarType === 'jalaali') {
            return d.format('jYYYY/jMM/jDD');
        }
        if (this._calendarType === 'hijri') {
            return d.format('iYYYY/iMM/iDD');
        }
    } catch (e) {
        console.error('Format error', e); 
    }
    
    return d.format(displayFormat || 'YYYY/MM/DD');
  }

  addCalendarYears(date: moment.Moment, years: number): moment.Moment {
    // wrap first, do math, return wrapped result
    let d = this._wrap(date);
    if (this._calendarType === 'jalaali') {
        d.jYear(d.jYear() + years);
    } else if (this._calendarType === 'hijri') {
        d.iYear(d.iYear() + years);
    } else {
        d.add(years, 'years');
    }
    return d;
  }

  addCalendarMonths(date: moment.Moment, months: number): moment.Moment {
    let d = this._wrap(date);
     if (this._calendarType === 'jalaali') {
        d.jMonth(d.jMonth() + months);
    } else if (this._calendarType === 'hijri') {
        d.iMonth(d.iMonth() + months);
    } else {
        d.add(months, 'months');
    }
    return d;
  }

  addCalendarDays(date: moment.Moment, days: number): moment.Moment {
     const d = this._wrap(date);
     d.add(days, 'days');
     return d;
  }

  toIso8601(date: moment.Moment): string {
    return date.toISOString();
  }

  isDateInstance(obj: any): boolean {
    return moment.isMoment(obj) || (!!obj && obj._isAMomentObject);
  }

  isValid(date: moment.Moment): boolean {
    return date.isValid();
  }

  invalid(): moment.Moment {
    return moment.invalid();
  }
}
