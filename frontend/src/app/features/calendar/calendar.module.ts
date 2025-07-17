import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './components/calendar.component';

/**
 * Feature module for the Calendar area.
 *
 * Context:
 * - Configures child routes under '/calendar' (see app.routes.ts), lazy-loaded.
 * - Declares CalendarComponent and any calendar-specific pipes or components.
 * - Imports common Angular modules and shared UI (forms, Material, etc.).
 */

const routes: Routes = [{ path: '', component: CalendarComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), CalendarComponent],
})
export class CalendarModule {}
