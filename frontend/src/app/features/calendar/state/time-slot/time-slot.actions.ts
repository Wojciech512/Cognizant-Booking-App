import { createAction, props } from '@ngrx/store';
import { CreateTimeSlot, TimeSlot } from '../../models/time-slot.model';
import { EventCategoryError } from '../../models/event-category.model';

/**
 * Defines NgRx actions for loading and managing time slots.
 *
 * Context:
 * - loadTimeSlots: triggers fetching slots within a given date range and optional category filter.
 * - createTimeSlot: triggers creation of a new slot (used by admin).
 * - Each operation has corresponding Success/Failure actions carrying payload or error.
 */

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
  props<{ timeSlot: CreateTimeSlot }>(),
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
