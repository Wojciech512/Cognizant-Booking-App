import { AuthState } from '../features/auth/models/auth.models';
import { EventCategoryState } from '../features/calendar/models/event-category.model';
import { TimeSlotState } from '../features/calendar/models/time-slot.model';
import { BookingState } from '../features/calendar/models/booking.model';

/**
 * Defines the shape of the global application state.
 *
 * Context:
 * - Aggregates feature-specific state interfaces into a single root AppState.
 * - Ensures type safety when selecting or updating slices of state via NgRx.
 * - Used by ActionReducerMap in app.reducers.ts and provideStore() in app.config.ts.
 */

export interface AppState {
  auth: AuthState;
  eventCategories: EventCategoryState;
  timeSlots: TimeSlotState;
  bookings: BookingState;
}
