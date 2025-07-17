import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BookingState } from '../../models/booking.model';

/**
 * Selectors for booking feature slice.
 *
 * Context:
 * - Provides convenient access to booking list, loading status, and errors.
 * - Can compose with time-slot selectors to derive booking counts per slot.
 */

export const selectBookingState =
  createFeatureSelector<BookingState>('booking');

export const selectBookingError = createSelector(
  selectBookingState,
  (state: BookingState) => state.error,
);
