import { AuthState } from '../features/auth/models/auth.models';
import { EventCategoryState } from '../features/calendar/models/event-category.model';
import { TimeSlotState } from '../features/calendar/models/time-slot.model';
import { BookingState } from '../features/calendar/models/booking.model';

export interface AppState {
  auth: AuthState;
  eventCategories: EventCategoryState;
  timeSlots: TimeSlotState;
  bookings: BookingState;
}
