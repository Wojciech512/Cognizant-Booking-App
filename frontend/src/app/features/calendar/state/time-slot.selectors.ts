import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TimeSlotState } from './time-slot.reducer';

export const selectTimeSlotState =
  createFeatureSelector<TimeSlotState>('timeSlots');

export const selectAllTimeSlots = createSelector(
  selectTimeSlotState,
  state => state.timeSlots
);

export const selectSlotsLoading = createSelector(
  selectTimeSlotState,
  state => state.loading
);
