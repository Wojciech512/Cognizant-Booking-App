import { EventCategoryError } from './event-category.model';

/**
 * Domain model for a booking.
 *
 * Context:
 * - Represents a user’s reservation of a specific time slot.
 * - Used by BookingService and NgRx state (actions, reducers, selectors).
 */

export interface Booking {
  id: number;
  timeslot: string;
  user: number;
  booked_at: string;
}

export interface BookingState {
  error: EventCategoryError;
}
