import { MatDateFormats } from '@angular/material/core';
import { NativeDateAdapter } from '@angular/material/core';

/**
 * Custom date format definitions and adapter for Angular Material datepickers.
 *
 * Context:
 * - Provides European DD.MM.YYYY parsing/display patterns via MAT_DATE_FORMATS.
 * - Overrides NativeDateAdapter.format() to output dates as “day.month.year” with zero-padding.
 * - Registered globally in AppComponent providers to standardize all date fields.
 */

export const APP_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD.MM.YYYY',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD.MM.YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

export class AppDateAdapter extends NativeDateAdapter {
  override format(date: Date): string {
    const d = date.getDate().toString().padStart(2, '0');
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const y = date.getFullYear();
    return `${d}.${m}.${y}`;
  }
}
