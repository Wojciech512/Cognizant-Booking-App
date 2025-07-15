import { createAction, props } from '@ngrx/store';
import { TimeSlot } from '../models/time-slot.model';
import { EventCategoryError } from '../models/event-category.model';

export interface TimeSlotFilter {
  categoryIds?: number[];
  startDate?: string;
  endDate?: string;
}

export const loadTimeSlots = createAction(
  '[TimeSlot] Load TimeSlots',
  props<{ filter?: TimeSlotFilter }>(),
);
export const loadTimeSlotsSuccess = createAction(
  '[TimeSlot] Load TimeSlots Success',
  props<{ timeSlots: TimeSlot[] }>(),
);
export const loadTimeSlotsFailure = createAction(
  '[TimeSlot] Load TimeSlots Failure',
  props<{ error: EventCategoryError }>(),
);

export const addTimeSlot = createAction(
  '[TimeSlot] Add TimeSlot (Admin)',
  props<{ timeSlot: { start_dt: string; end_dt: string; category: number } }>(),
);
export const addTimeSlotSuccess = createAction(
  '[TimeSlot] Add TimeSlot Success',
  props<{ timeSlot: TimeSlot }>(),
);
export const addTimeSlotFailure = createAction(
  '[TimeSlot] Add TimeSlot Failure',
  props<{ error: EventCategoryError }>(),
);

export const deleteTimeSlot = createAction(
  '[TimeSlot] Delete TimeSlot (Admin)',
  props<{ timeSlotId: string }>(),
);
export const deleteTimeSlotSuccess = createAction(
  '[TimeSlot] Delete TimeSlot Success',
  props<{ timeSlotId: string }>(),
);
export const deleteTimeSlotFailure = createAction(
  '[TimeSlot] Delete TimeSlot Failure',
  props<{ error: EventCategoryError }>(),
);

export const markSlotBooked = createAction(
  '[TimeSlot] Slot Booked',
  props<{ timeSlotId: string; bookingId: number }>(),
);
export const markSlotFreed = createAction(
  '[TimeSlot] Slot Booking Canceled',
  props<{ timeSlotId: string }>(),
);
