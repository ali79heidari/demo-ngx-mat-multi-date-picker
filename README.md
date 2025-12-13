# ngx-multi-date-picker

A **stand‑alone Angular component** that wraps the Angular Material `MatDatepicker` and adds powerful multi‑calendar support (Gregorian, Jalaali‑Persian, Hijri‑Islamic) together with flexible holiday highlighting.

---

## ✨ Features

| Feature                                  | Description                                                                                                                                    |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| **Three calendar systems**               | Switch between Gregorian, Jalaali (Solar Persian) and Hijri (Lunar Islamic) calendars via a single `calendarType` input.                       |
| **Holiday highlighting**                 | Built‑in lists for common Gregorian, Jalaali and Hijri holidays. Dates that are holidays are rendered with a red text style (`.holiday-date`). |
| **Custom Gregorian holidays**            | Provide your own list of dates (with optional reasons) – the component will treat them as holidays.                                            |
| **Weekend configuration**                | Define which days of the week are considered weekends (`weekendDays`).                                                                         |
| **Start‑day of week**                    | Change the first day of the week (`startDay`) to Saturday, Sunday or Monday.                                                                   |
| **Show / hide each calendar’s holidays** | Toggle each calendar’s built‑in holiday set independently (`showGregorianHolidays`, `showJalaaliHolidays`, `showHijriHolidays`).               |
| **Zero external CSS**                    | All styling is done via the component’s encapsulated stylesheet – just import the component and it works out of the box.                       |

---

## 📦 Installation

```bash
npm install ngx-mat-multi-date-picker
```

> **Peer dependencies** (Angular 20+, Angular Material 20+, Moment 2.30+). Make sure they are installed in your project.

---

## 🛠️ Basic Usage

Because the component is **stand‑alone**, you can add it directly to a template without declaring it in an NgModule.

```html
<!-- app.component.html -->
<ngx-multi-datepicker [(ngModel)]="selectedDate" [calendarType]="'jalaali'" [label]="'Select a date'" [showGregorianHolidays]="true" [showJalaaliHolidays]="true" [showHijriHolidays]="false" [weekendDays]="[5,6]" <!-- Friday & Saturday in Jalaali calendar --> [startDay]="'saturday'" [customGregorianHolidays]="customHolidays"> </ngx-multi-datepicker>
```

```ts
// app.component.ts
import { Component } from "@angular/core";
import { CustomHolidayRule } from "ngx-multi-date-picker";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  selectedDate: any;

  // Example of the custom‑holiday format (see the section below)
  customHolidays: CustomHolidayRule[] = [
    { year: 2025, month: 1, days: [1, 2, 3] }, // 1‑3 Jan 2025
    { year: 2025, month: 12, days: [25] }, // 25 Dec 2025 (Christmas)
  ];
}
```

The component will render a Material date‑picker. All holiday dates appear in **red**. The user can still pick any date; the visual cue is only for information.

---

## 📚 API Reference

### Inputs

| Input                     | Type                                      | Default           | Description                                                                                                                      |
| ------------------------- | ----------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `calendarType`            | `'gregorian'` \| `'jalaali'` \| `'hijri'` | `'jalaali'`       | Determines which calendar system is displayed.                                                                                   |
| `label`                   | `string`                                  | `'Choose a date'` | The label shown above the input field.                                                                                           |
| `value`                   | `moment.Moment \| null`                   | `null`            | The currently selected date (two‑way bound with `ngModel`).                                                                      |
| `startDay`                | `StartDayOfWeek \| null`                  | `null`            | First day of the week – `'saturday'`, `'sunday'` or `'monday'`. If `null` the default of the underlying `MatDatepicker` is used. |
| `weekendDays`             | `number[]`                                | `[]`              | Array of weekday numbers that should be treated as weekends. `0 = Sunday`, `1 = Monday`, … `6 = Saturday`.                       |
| `customGregorianHolidays` | `CustomHolidayRule[]`                     | `[]`              | Your own list of Gregorian holidays. See **Custom Holiday format** below.                                                        |
| `showGregorianHolidays`   | `boolean`                                 | `false`           | Show/hide the built‑in Gregorian holiday set.                                                                                    |
| `showJalaaliHolidays`     | `boolean`                                 | `false`           | Show/hide the built‑in Jalaali holiday set.                                                                                      |
| `showHijriHolidays`       | `boolean`                                 | `false`           | Show/hide the built‑in Hijri holiday set.                                                                                        |

### Output

| Output        | Type                                  | Description                                                     |
| ------------- | ------------------------------------- | --------------------------------------------------------------- |
| `valueChange` | `EventEmitter<moment.Moment \| null>` | Emits when the user selects a new date (used by `[(ngModel)]`). |

---

## 🗓️ Built‑in Holiday Lists

### Gregorian (when `showGregorianHolidays` is `true`)

| Date   | Reason    |
| ------ | --------- |
| Jan 1  | New Year  |
| Dec 25 | Christmas |

### Jalaali (Solar Persian) – when `showJalaaliHolidays` is `true`

| Jalaali Date  | Reason                                  |
| ------------- | --------------------------------------- |
| Farvardin 1‑4 | Nowruz (New Year)                       |
| Farvardin 12  | Islamic Republic Day                    |
| Farvardin 13  | Nature Day (Sizdah‑Bedar)               |
| Khordad 14    | Demise of Ayatollah Khomeini            |
| Khordad 15    | 15 Khordad Uprising                     |
| Bahman 22     | Victory of the 1979 Revolution          |
| Esfand 29     | Nationalization of Oil                  |
| Esfand 30     | (Optional – appears only in leap years) |

### Hijri (Lunar Islamic) – when `showHijriHolidays` is `true`

| Hijri Date              | Reason                                    |
| ----------------------- | ----------------------------------------- |
| Muharram 9              | Tasua                                     |
| Muharram 10             | Ashura                                    |
| Safar 20                | Arbaeen                                   |
| Safar 28                | Demise of Prophet & Imam Hassan           |
| End of Safar (29 or 30) | Martyrdom of Imam Reza                    |
| Rabiʿ al‑Awal 8         | Martyrdom of Imam Hassan Askari           |
| Rabiʿ al‑Awal 17        | Birthday of Prophet Muhammad & Imam Sadiq |
| Jumada II 3             | Martyrdom of Fatimah (Zahra)              |
| Rajab 13                | Birthday of Imam Ali                      |
| Rajab 27                | Mabʿath (the return of Imam Mahdi)        |
| Shaʿban 15              | Birthday of Imam Mahdi                    |
| Ramadan 21              | Martyrdom of Imam Ali                     |
| Shawwal 1‑2             | Eid al‑Fitr                               |
| Shawwal 25              | Martyrdom of Imam Sadiq                   |
| Dhu l‑Hijja 10          | Eid al‑Adha                               |
| Dhu l‑Hijja 18          | Eid al‑Ghadir                             |

---

## 🛠️ Custom Gregorian Holiday Format

The component expects an array of objects that match the `CustomHolidayRule` interface:

```ts
export interface CustomHolidayRule {
  year: number; // e.g. 2025
  month: number; // 1‑12 (Gregorian month)
  days: number[]; // list of day numbers in that month
}
```

### Example

```ts
customHolidays: CustomHolidayRule[] = [
  { year: 2025, month: 1, days: [1, 2, 3] },   // 1‑3 Jan 2025
  { year: 2025, month: 12, days: [25] }        // 25 Dec 2025 (Christmas)
];
```

You can bind this array to the component via the `[customGregorianHolidays]` input.

---

## 🎨 Styling

The component adds the CSS class `holiday-date` to every cell that is a holiday. By default the component ships with a small style that makes the date text red:

```css
.holiday-date .mat-calendar-body-cell-content {
  color: red !important;
}
```

If you want a different look, simply override the class in your global stylesheet:

```css
::ng-deep .holiday-date .mat-calendar-body-cell-content {
  color: #ff5722; /* any colour you like */
  font-weight: bold;
}
```

---

## 🏗️ Building & Publishing the Library

The source lives under `projects/ngx-multi-date-picker`. To build a distributable package:

```bash
# From the repository root
npm run build   # runs ng-packagr and outputs to dist/ngx-multi-date-picker
```

The generated `dist/ngx-multi-date-picker` folder contains the ready‑to‑publish npm package. See the **Publishing** section of the main repository README for the exact `npm publish` command.

---

## 🤝 Contributing

Feel free to open issues or submit pull requests. When contributing:

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/awesome‑feature`).
3. Run the demo app (`npm start`) to test your changes.
4. Build the library (`npm run build`).
5. Submit a PR.

---

## 📄 License

MIT © Ali Heidari

---

_Happy coding!_
