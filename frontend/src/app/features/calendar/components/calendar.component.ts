import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {AsyncPipe, DatePipe, JsonPipe, NgForOf, NgIf, SlicePipe} from '@angular/common';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {MatCheckbox} from '@angular/material/checkbox';
import { Observable } from 'rxjs';
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

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgForOf,
    NgIf,
    SlicePipe,
    MatButton,
    MatButtonModule,
    MatProgressSpinner,
    MatCheckbox,
    FilterPipe,
    CategoryColorPipe,
    JsonPipe
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  eventCategories$: Observable<EventCategory[]>;
  timeSlots$: Observable<TimeSlot[]>;
  loadingSlots$: Observable<boolean>;
  loadingCategories$: Observable<boolean>;

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

    this.eventCategories$.subscribe((cats) => (this.categories = cats));

    const today = new Date();
    const dayIndex = today.getDay();
    this.currentWeekStart = new Date(today);
    this.currentWeekStart.setDate(today.getDate() - ((dayIndex + 6) % 7));
    this.generateWeekDays();
  }

  ngOnInit(): void {
    this.store.dispatch(CategoryActions.loadEventCategories());
    this.loadTimeSlots();
  }

  private generateWeekDays(): void {
    this.daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.currentWeekStart);
      date.setDate(this.currentWeekStart.getDate() + i);
      this.daysOfWeek.push(date);
    }
  }

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

  onToggleCategory(categoryId: number, checked: boolean): void {
    if (checked) {
      this.selectedCategoryIds.push(categoryId);
    } else {
      this.selectedCategoryIds = this.selectedCategoryIds.filter(
        (id) => id !== categoryId,
      );
    }
    this.loadTimeSlots();
  }

  nextWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.generateWeekDays();
    this.loadTimeSlots();
  }

  prevWeek(): void {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.generateWeekDays();
    this.loadTimeSlots();
  }

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

  trackBySlot(index: number, slot: TimeSlot): string {
    return slot.id;
  }

  slotMatchesCell(slot: TimeSlot, day: Date, hour: number): boolean {
    const start = new Date(slot.start_dt);
    return (
      start.getFullYear() === day.getFullYear() &&
      start.getMonth() === day.getMonth() &&
      start.getDate() === day.getDate() &&
      start.getHours() === hour
    );
  }

  getCategoryName(categoryId: number): string {
    const cat = this.categories.find((c) => c.id === categoryId);
    return cat ? cat.name : '';
  }
}
