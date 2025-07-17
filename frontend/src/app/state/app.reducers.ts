import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { authReducer } from '../features/auth/state/auth.reducer';
import { eventCategoryReducer } from '../features/calendar/state/event-category/event-category.reducer';
import { timeSlotReducer } from '../features/calendar/state/time-slot/time-slot.reducer';
import { bookingReducer } from '../features/calendar/state/booking/booking.reducer';

/**
 * Maps each AppState slice to its corresponding reducer function.
 *
 * Context:
 * - Supplies the root reducer map to NgRx’s StoreModule via provideStore().
 * - Delegates state transitions to feature reducers imported from their modules.
 * - Keys must align with AppState properties to maintain consistent state shape.
 */

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  eventCategories: eventCategoryReducer,
  timeSlots: timeSlotReducer,
  bookings: bookingReducer,
};
