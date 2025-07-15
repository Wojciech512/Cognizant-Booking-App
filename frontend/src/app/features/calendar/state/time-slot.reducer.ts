import { createReducer, on } from '@ngrx/store';
import { TimeSlot } from '../models/time-slot.model';
import * as TimeSlotActions from './time-slot.actions';
import { EventCategoryError } from '../models/event-category.model';

export interface TimeSlotState {
  timeSlots: TimeSlot[];
  loading: boolean;
  filter: TimeSlotActions.TimeSlotFilter;
  error: EventCategoryError;
}
const initialState: TimeSlotState = {
  timeSlots: [],
  loading: false,
  filter: {},
  error: null,
};

export const timeSlotReducer = createReducer(
  initialState,
  on(TimeSlotActions.loadTimeSlots, (state, { filter }) => ({
    ...state,
    loading: true,
    error: null,
    filter: filter || {},
  })),
  on(TimeSlotActions.loadTimeSlotsSuccess, (state, { timeSlots }) => ({
    ...state,
    loading: false,
    timeSlots,
  })),
  on(TimeSlotActions.loadTimeSlotsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(TimeSlotActions.addTimeSlotSuccess, (state, { timeSlot }) => ({
    ...state,
    timeSlots: [...state.timeSlots, timeSlot],
  })),
  on(TimeSlotActions.deleteTimeSlotSuccess, (state, { timeSlotId }) => ({
    ...state,
    timeSlots: state.timeSlots.filter((ts) => ts.id !== timeSlotId),
  })),
  on(TimeSlotActions.markSlotBooked, (state, { timeSlotId, bookingId }) => ({
    ...state,
    timeSlots: state.timeSlots.map((ts) =>
      ts.id === timeSlotId
        ? {
            ...ts,
            is_booked: true,
            booked_by_current_user: true,
            my_booking_id: bookingId,
          }
        : ts,
    ),
  })),
  on(TimeSlotActions.markSlotFreed, (state, { timeSlotId }) => ({
    ...state,
    timeSlots: state.timeSlots.map((ts) =>
      ts.id === timeSlotId
        ? {
            ...ts,
            is_booked: false,
            booked_by_current_user: false,
            my_booking_id: undefined,
          }
        : ts,
    ),
  })),
);
