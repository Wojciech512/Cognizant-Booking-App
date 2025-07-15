import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BookingState } from '../../models/booking.model';

export const selectBookingState =
  createFeatureSelector<BookingState>('booking');

export const selectBookingError = createSelector(
  selectBookingState,
  (state: BookingState) => state.error,
);
