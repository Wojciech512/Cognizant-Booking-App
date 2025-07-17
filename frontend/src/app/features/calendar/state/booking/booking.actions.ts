import { createAction, props } from '@ngrx/store';
import { Booking } from '../../models/booking.model';
import { EventCategoryError } from '../../models/event-category.model';

/**
 * NgRx action definitions for booking workflows.
 *
 * Context:
 * - Exposes actions to load, create, and cancel bookings.
 * - Carries minimal payloads: filter criteria or booking identifiers.
 */

export const createBooking = createAction(
  '[Booking] Create Booking',
  props<{ timeSlotId: string }>(),
);
export const createBookingSuccess = createAction(
  '[Booking] Create Booking Success',
  props<{ timeSlotId: string; booking: Booking }>(),
);
export const createBookingFailure = createAction(
  '[Booking] Create Booking Failure',
  props<{ error: EventCategoryError }>(),
);

export const cancelBooking = createAction(
  '[Booking] Cancel Booking',
  props<{ bookingId: number; timeSlotId: string }>(),
);
export const cancelBookingSuccess = createAction(
  '[Booking] Cancel Booking Success',
  props<{ timeSlotId: string }>(),
);
export const cancelBookingFailure = createAction(
  '[Booking] Cancel Booking Failure',
  props<{ error: EventCategoryError }>(),
);
