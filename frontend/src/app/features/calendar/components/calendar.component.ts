import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import {
  MatProgressSpinner,
  MatProgressSpinnerModule,
} from '@angular/material/progress-spinner';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { filter, Observable, take } from 'rxjs';
import { EventCategory } from '../models/event-category.model';
import { TimeSlot } from '../models/time-slot.model';
import { FilterPipe } from '../../../shared/pipes/filter.pipe';
import { CategoryColorPipe } from '../../../shared/pipes/category-color.pipe';
import {
  selectAllCategories,
  selectCategoriesLoading,
} from '../state/event-category/event-category.selectors';
import {
  selectAllTimeSlots,
  selectSlotsLoading,
} from '../state/time-slot/time-slot.selectors';
import * as CategoryActions from '../state/event-category/event-category.actions';
import * as BookingActions from '../state/booking/booking.actions';
import * as TimeSlotActions from '../state/time-slot/time-slot.actions';
import {
  MatGridList,
  MatGridListModule,
  MatGridTile,
} from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { selectIsStaff } from '../../auth/state/auth.selectors';

/**
 * CalendarComponent: renders a week-based grid of time slots with category filters.
 *
 * Context:
 * - Initialized under the `/calendar` route; lazy-loaded in app.routes.ts.
 * - Pulls event categories and time slots from NgRx store, showing loading indicators.
 * - Computes current week’s dates and allows navigation between weeks.
 * - Supports category-based filtering via checkboxes.
 * - Enables staff users to create slots (handled elsewhere) and regular users to book/cancel.
 */

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgForOf,
    NgIf,
    MatButton,
    MatButtonModule,
    MatProgressSpinner,
    MatCheckbox,
    FilterPipe,
    CategoryColorPipe,
    MatIconModule,
    MatGridList,
    MatGridTile,
    MatCheckboxModule,
    MatGridListModule,
    MatCardModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  eventCategories$: Observable<EventCategory[]>;
  timeSlots$: Observable<TimeSlot[]>;
  loadingSlots$: Observable<boolean>;
  loadingCategories$: Observable<boolean>;
  isStaff$: Observable<boolean>;

  private categories: EventCategory[] = [];

  selectedCategoryIds: number[] = [];
  currentWeekStart: Date;
  daysOfWeek: Date[] = [];
  hours: number[] = Array.from({ length: 24 }, (_, i) => i);

  constructor(private store: Store) {
    this.eventCategories$ = this.store.select(selectAllCategories);
    this.loadingCategories$ = this.store.select(selectCategoriesLoading);
    this.timeSlots$ = this.store.select(selectAllTimeSlots);
    this.loadingSlots$ = this.store.select(selectSlotsLoading);
    this.isStaff$ = this.store.select(selectIsStaff);

    // Subscribe once to get all categories for name lookups
    this.eventCategories$
      .pipe(
        filter((cats) => cats.length > 0),
        take(1),
      )
      .subscribe((cats) => (this.categories = cats));

    // Calculate start of current week (Mon=first day)
    const today = new Date();
    const dayIndex = today.getDay();
    this.currentWeekStart = new Date(today);
    this.currentWeekStart.setDate(today.getDate() - ((dayIndex + 6) % 7));
    this.generateWeekDays();
  }

  ngOnInit(): void {
    // Trigger load of categories and then initial load of slots
    this.store.dispatch(CategoryActions.loadEventCategories());
    this.loadTimeSlots();
  }

  // Populate daysOfWeek array with 7 dates starting from currentWeekStart
  private generateWeekDays(): void {
    this.daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.currentWeekStart);
      date.setDate(this.currentWeekStart.getDate() + i);
      this.daysOfWeek.push(date);
    }
  }

  // Dispatch loadTimeSlots with current week range and optional category filter
  loadTimeSlots(): void {
    const filter: TimeSlotActions.TimeSlotFilter = {
      categoryIds: this.selectedCategoryIds.length
        ? this.selectedCategoryIds
        : undefined,
      startDate: this.currentWeekStart.toISOString().slice(0, 10),
      endDate: (() => {
        const end = new Date(this.currentWeekStart);
        end.setDate(end.getDate() + 6);
        return end.toISOString().slice(0, 10);
      })(),
    };
    this.store.dispatch(TimeSlotActions.loadTimeSlots({ filter }));
  }

  // Returns unique key for *ngFor when rendering category checkboxes
  trackByCategory(_: number, cat: EventCategory): number {
    return cat.id;
  }

  // Toggle inclusion of a category in the filter and reload slots
  onToggleCategory(categoryId: number, checked: boolean): void {
    if (checked) {
      this.selectedCategoryIds = [...this.selectedCategoryIds, categoryId];
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(
        (id) => id !== categoryId,
      );
    }
    this.loadTimeSlots();
  }
  // Shift view to next week and refresh slots
  nextWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.generateWeekDays();
    this.loadTimeSlots();
  }
  // Shift view to previous week and refresh slots
  prevWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.generateWeekDays();
    this.loadTimeSlots();
  }

  /**
   * Handle user clicking a slot:
   * - If not booked: dispatch createBooking
   * - If booked by current user: dispatch cancelBooking
   */
  onSlotClick(slot: TimeSlot): void {
    if (!slot.is_booked) {
      this.store.dispatch(
        BookingActions.createBooking({ timeSlotId: slot.id }),
      );
    } else if (slot.booked_by_current_user && slot.my_booking_id) {
      this.store.dispatch(
        BookingActions.cancelBooking({
          bookingId: slot.my_booking_id,
          timeSlotId: slot.id,
        }),
      );
    }
  }

  /**
   * Determine if a slot falls into a given grid cell (day + hour).
   * Used in template to position slots correctly.
   */
  slotMatchesCell(slot: TimeSlot, day: Date, hour: number): boolean {
    const start = new Date(slot.start_dt);
    return (
      start.getFullYear() === day.getFullYear() &&
      start.getMonth() === day.getMonth() &&
      start.getDate() === day.getDate() &&
      start.getHours() === hour
    );
  }

  // Lookup category name by ID for display purposes
  getCategoryName(categoryId: number): string {
    const cat = this.categories.find((c) => c.id === categoryId);
    return cat ? cat.name : '';
  }
}
