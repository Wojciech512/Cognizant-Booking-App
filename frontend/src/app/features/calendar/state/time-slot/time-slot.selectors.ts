import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TimeSlotState } from '../../models/time-slot.model';

/**
 * Selectors for the TimeSlot feature slice.
 *
 * Context:
 * - Exposes list of slots, loading state, and any errors.
 * - Can be composed with date or category filters in components.
 */

export const selectTimeSlotState =
  createFeatureSelector<TimeSlotState>('timeSlots');

export const selectAllTimeSlots = createSelector(
  selectTimeSlotState,
  (state) => state.timeSlots,
);

export const selectSlotsLoading = createSelector(
  selectTimeSlotState,
  (state) => state.loading,
);
