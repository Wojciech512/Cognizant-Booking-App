import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatOption } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import {
  AsyncPipe,
  DatePipe,
  NgForOf,
  NgIf,
  NgSwitch,
  NgSwitchCase,
} from '@angular/common';
import { MatSelect } from '@angular/material/select';
import { filter, Observable, take } from 'rxjs';
import {
  addTimeSlot,
  loadTimeSlots,
} from '../../calendar/state/time-slot/time-slot.actions';
import { EventCategory } from '../../calendar/models/event-category.model';
import { selectAllCategories } from '../../calendar/state/event-category/event-category.selectors';
import {
  CreateTimeSlot,
  TimeSlot,
} from '../../calendar/models/time-slot.model';
import { selectAllTimeSlots } from '../../calendar/state/time-slot/time-slot.selectors';
import { loadEventCategories } from '../../calendar/state/event-category/event-category.actions';

/**
 * Main admin UI component for managing time slots.
 *
 * Context:
 * - Fetches event categories and existing slots via NgRx on init.
 * - Builds a reactive form to add new slots (date, time, category).
 * - Provides utility functions to map category IDs to names.
 * - Dispatches load/add actions to the store and resets the form.
 */

@Component({
  selector: 'app-admin',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTimepickerModule,
    MatTableModule,
    AsyncPipe,
    MatOption,
    NgForOf,
    MatSelect,
    DatePipe,
    NgIf,
    NgSwitchCase,
    NgSwitch,
  ],

  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  standalone: true,
})
export class AdminComponent implements OnInit {
  readonly eventCategories$: Observable<EventCategory[]>;
  readonly timeSlots$: Observable<TimeSlot[]>;
  readonly minDate: Date = new Date();
  readonly availableHours: string[] = [];

  public objectKeys = Object.keys;
  public categories: EventCategory[] = [];
  public slotForm!: FormGroup;

  constructor(
    private fb: NonNullableFormBuilder,
    private store: Store,
  ) {
    this.eventCategories$ = this.store.select(selectAllCategories);
    this.timeSlots$ = this.store.select(selectAllTimeSlots);

    this.store.dispatch(loadEventCategories());
    this.store.dispatch(loadTimeSlots({ filter: {} }));
  }

  ngOnInit(): void {
    this.buildAvailableHours();

    this.slotForm = this.fb.group({
      date: [this.minDate, Validators.required],
      time: [this.availableHours[0], Validators.required],
      category: [null, Validators.required],
    });

    this.eventCategories$
      .pipe(
        filter((cats) => cats.length > 0),
        take(1),
      )
      .subscribe((cats) => {
        this.categories = cats;
        this.slotForm.patchValue({ category: cats[0].id });
      });
  }

  getCategoryName(categoryId: number): string {
    const cat = this.categories.find((c) => c.id === categoryId);
    return cat ? cat.name : '-';
  }

  onAdd(): void {
    if (this.slotForm.invalid) return;

    const { date, time, category } = this.slotForm.value;
    const [hourStr, minStr] = time.split(':');
    const dt = new Date(date);
    dt.setHours(+hourStr, +minStr, 0, 0);

    const start_dt = dt.toISOString();
    const end_dt = new Date(dt.getTime() + 60 * 60 * 1000).toISOString();

    const payload: CreateTimeSlot = {
      start_dt: start_dt,
      end_dt: end_dt,
      category,
    };

    this.store.dispatch(addTimeSlot({ timeSlot: payload }));
    this.slotForm.reset({
      date: this.minDate,
      time: this.availableHours[0],
      category: this.slotForm.value.category,
    });
  }

  buildAvailableHours() {
    const now = new Date();
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 1);
    const startH = now.getHours();

    for (let h = startH; h < 24; h++) {
      const hh = h.toString().padStart(2, '0');
      this.availableHours.push(`${hh}:00`);
    }
  }
}
