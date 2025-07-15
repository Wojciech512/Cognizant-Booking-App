import { createReducer, on } from '@ngrx/store';
import * as BookingActions from './booking.actions';

export interface BookingState {
  error: any;
}
const initialState: BookingState = {
  error: null
};

export const bookingReducer = createReducer(
  initialState,
  on(BookingActions.createBooking, state => ({ ...state, error: null })),
  on(BookingActions.createBookingFailure, (state, { error }) => ({ ...state, error })),
  on(BookingActions.cancelBookingFailure, (state, { error }) => ({ ...state, error }))
);
