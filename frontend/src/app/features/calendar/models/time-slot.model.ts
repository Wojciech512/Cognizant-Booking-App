import * as TimeSlotActions from '../state/time-slot/time-slot.actions';
import { EventCategoryError } from './event-category.model';

/**
 * REST client for time slot operations.
 *
 * Context:
 * - Uses HttpClient to GET available slots for a date and POST new ones.
 * - Coordinates with NgRx effects to keep store in sync.
 */

export interface TimeSlot {
  id: string;
  start_dt: string;
  end_dt: string;
  is_booked?: boolean;
  category: number;
  booked_by_current_user?: boolean;
  my_booking_id?: number;
  booking?: {
    user: string;
    booked_at: string;
  };
}

export interface CreateTimeSlot {
  start_dt: string;
  end_dt: string;
  category: number;
}

export interface TimeSlotState {
  timeSlots: TimeSlot[];
  loading: boolean;
  filter: TimeSlotActions.TimeSlotFilter;
  error: EventCategoryError;
}
