import * as TimeSlotActions from '../state/time-slot/time-slot.actions';
import { EventCategoryError } from './event-category.model';

export interface TimeSlot {
  id: string;
  start_dt: string;
  end_dt: string;
  is_booked: boolean;
  category: number;
  booked_by_current_user?: boolean;
  my_booking_id?: number;
  booking?: {
    user: string
    booked_at: string
  }
}

export interface TimeSlotState {
  timeSlots: TimeSlot[];
  loading: boolean;
  filter: TimeSlotActions.TimeSlotFilter;
  error: EventCategoryError;
}
