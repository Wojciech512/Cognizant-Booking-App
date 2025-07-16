import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
import { AsyncPipe, DatePipe } from '@angular/common';
import { EventCategory } from '../../calendar/models/event-category.model';
import { Observable } from 'rxjs';
import { selectAllCategories } from '../../calendar/state/event-category/event-category.selectors';
import {TimeSlot} from '../../calendar/models/time-slot.model';
import {selectAllTimeSlots} from '../../calendar/state/time-slot/time-slot.selectors';

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
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  standalone: true,
})
export class AdminComponent implements OnInit {
  slotForm!: FormGroup;
  eventCategories$: Observable<EventCategory[]>;
  timeSlots$: Observable<TimeSlot[]>;

  private categories: EventCategory[] = [];

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.eventCategories$ = this.store.select(selectAllCategories);
    this.timeSlots$ = this.store.select(selectAllTimeSlots);

    this.eventCategories$.subscribe((cats) => (this.categories = cats));

  }

  ngOnInit(): void {
    this.store.dispatch(loadTimeSlots({ filter: {} }));

    this.slotForm = this.fb.group({
      start_dt: ['', Validators.required],
      end_dt: ['', Validators.required],
      category: ['', Validators.required],
    });
  }

  onAdd() {
    if (this.slotForm.valid) {
      this.store.dispatch(addTimeSlot({ timeSlot: this.slotForm.value }));
      this.slotForm.reset();
    }
  }
  getCategoryName(categoryId: number): string {
    const cat = this.categories.find((c) => c.id === categoryId);
    return cat ? cat.name : '';
  }
}
