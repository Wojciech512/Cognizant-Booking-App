import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TimeSlotState } from '../../models/time-slot.model';

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
