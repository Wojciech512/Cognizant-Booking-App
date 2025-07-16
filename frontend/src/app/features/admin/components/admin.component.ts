import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  addTimeSlot,
  loadTimeSlots,
} from '../../calendar/state/time-slot/time-slot.actions';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { AsyncPipe, DatePipe, NgForOf } from '@angular/common';
import { EventCategory } from '../../calendar/models/event-category.model';
import { Observable } from 'rxjs';
import { selectAllCategories } from '../../calendar/state/event-category/event-category.selectors';
import {
  CreateTimeSlot,
  TimeSlot,
} from '../../calendar/models/time-slot.model';
import { selectAllTimeSlots } from '../../calendar/state/time-slot/time-slot.selectors';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { loadEventCategories } from '../../calendar/state/event-category/event-category.actions';

@Component({
  selector: 'app-admin',
  imports: [
    MatTable,
    MatHeaderCell,
    MatCell,
    MatColumnDef,
    MatHeaderRow,
    MatRow,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatRowDef,
    AsyncPipe,
    DatePipe,
    MatFormField,
    MatLabel,
    MatFormField,
    MatButton,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatFormField,
    MatSelect,
    MatOption,
    NgForOf,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  standalone: true,
})
export class AdminComponent implements OnInit {
  slotForm!: FormGroup;
  eventCategories$: Observable<EventCategory[]>;
  timeSlots$: Observable<TimeSlot[]>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.eventCategories$ = this.store.select(selectAllCategories);
    this.timeSlots$ = this.store.select(selectAllTimeSlots);
  }

  ngOnInit(): void {
    this.store.dispatch(loadEventCategories());
    this.store.dispatch(loadTimeSlots({ filter: {} }));

    this.slotForm = this.fb.group({
      start_dt: ['', Validators.required],
      end_dt: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  onAdd() {
    if (this.slotForm.valid) {
      const value: CreateTimeSlot = this.slotForm.value;
      this.store.dispatch(
        addTimeSlot({
          timeSlot: {
            start_dt: value.start_dt,
            end_dt: value.end_dt,
            category: value.category,
          },
        }),
      );
      this.slotForm.reset();
    }
  }
  // TODO do poprawy
  getCategoryName(categoryId: number): string {
    this.eventCategories$.subscribe((cats) => {
      const cat = cats.find((c) => c.id === categoryId);
      return cat ? cat.name : '';
    });
    return '';
  }
}
