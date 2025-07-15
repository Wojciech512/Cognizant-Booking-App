import { ActionReducerMap } from '@ngrx/store';
import { AppState } from './app.state';
import { authReducer } from '../features/auth/state/auth.reducer';
import {eventCategoryReducer} from '../features/calendar/state/event-category/event-category.reducer';
import {timeSlotReducer} from '../features/calendar/state/time-slot/time-slot.reducer';
import {bookingReducer} from '../features/calendar/state/booking/booking.reducer';

export const appReducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  eventCategories: eventCategoryReducer,
  timeSlots: timeSlotReducer,
  bookings: bookingReducer,
};
