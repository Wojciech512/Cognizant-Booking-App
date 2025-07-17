import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { HeaderComponent } from './features/header/header.component';
import {
  APP_DATE_FORMATS,
  AppDateAdapter,
} from './shared/formats/app-date-formats';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [
    // Sets the app-wide locale for Material Date components to English
    { provide: MAT_DATE_LOCALE, useValue: 'en-EN' },
    // Replaces default DateAdapter with custom implementation
    { provide: DateAdapter, useClass: AppDateAdapter, deps: [MAT_DATE_LOCALE] },
    // Applies custom date format definitions across all date-pickers
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
  standalone: true,
})
export class AppComponent {}
