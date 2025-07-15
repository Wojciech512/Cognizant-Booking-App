import { EventCategoryError } from './event-category.model';

export interface Booking {
  id: number;
  timeslot: string;
  user: number;
  booked_at: string;
}

export interface BookingState {
  error: EventCategoryError;
}
