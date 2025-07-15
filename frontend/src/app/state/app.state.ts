import { AuthState } from '../features/auth/models/auth.models';
import { BookingState } from '../features/calendar/state/booking.reducer';
import { TimeSlotState } from '../features/calendar/state/time-slot.reducer';
import { EventCategoryState } from '../features/calendar/models/event-category.model';

export interface AppState {
  auth: AuthState;
  eventCategories: EventCategoryState;
  timeSlots: TimeSlotState;
  bookings: BookingState;
}
