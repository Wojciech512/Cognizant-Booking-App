import { createReducer, on } from '@ngrx/store';
import * as BookingActions from './booking.actions';
import { BookingState } from '../../models/booking.model';

/**
 * Reducer for booking state: manages list of bookings and loading flags.
 *
 * Context:
 * - Responds to load/create/cancel success and failure to update state.
 * - Maintains an array of current bookings and tracks operation errors.
 */

const initialState: BookingState = {
  error: null,
};

export const bookingReducer = createReducer(
  initialState,
  on(BookingActions.createBooking, (state) => ({ ...state, error: null })),
  on(BookingActions.createBookingFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(BookingActions.cancelBookingFailure, (state, { error }) => ({
    ...state,
    error,
  })),
);
