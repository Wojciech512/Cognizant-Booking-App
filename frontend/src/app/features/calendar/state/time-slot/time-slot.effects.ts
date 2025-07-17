import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as TimeSlotActions from './time-slot.actions';
import * as BookingActions from '../booking/booking.actions';
import { TimeSlotService } from '../../services/time-slot.service';

/**
 * Side-effects for TimeSlot actions: performs HTTP calls via TimeSlotService.
 *
 * Context:
 * - loadTimeSlots$: on loadTimeSlots, fetch slots from backend and dispatch success/failure.
 * - createTimeSlot$: on createTimeSlot, POST new slot and dispatch success/failure.
 */

@Injectable()
export class TimeSlotEffects {
  private actions$ = inject(Actions);
  private timeSlotService = inject(TimeSlotService);

  loadTimeSlots$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeSlotActions.loadTimeSlots),
      mergeMap((action) =>
        this.timeSlotService.getTimeSlots(action.filter).pipe(
          map((timeSlots) =>
            TimeSlotActions.loadTimeSlotsSuccess({ timeSlots }),
          ),
          catchError((error) =>
            of(TimeSlotActions.loadTimeSlotsFailure({ error })),
          ),
        ),
      ),
    ),
  );

  addTimeSlot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeSlotActions.addTimeSlot),
      mergeMap((action) =>
        this.timeSlotService.createTimeSlot(action.timeSlot).pipe(
          map((createdSlot) =>
            TimeSlotActions.addTimeSlotSuccess({ timeSlot: createdSlot }),
          ),
          catchError((error) =>
            of(TimeSlotActions.addTimeSlotFailure({ error })),
          ),
        ),
      ),
    ),
  );

  deleteTimeSlot$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TimeSlotActions.deleteTimeSlot),
      mergeMap((action) =>
        this.timeSlotService.deleteTimeSlot(action.timeSlotId).pipe(
          map(() =>
            TimeSlotActions.deleteTimeSlotSuccess({
              timeSlotId: action.timeSlotId,
            }),
          ),
          catchError((error) =>
            of(TimeSlotActions.deleteTimeSlotFailure({ error })),
          ),
        ),
      ),
    ),
  );

  bookingCreated$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.createBookingSuccess),
      map(({ timeSlotId, booking }) =>
        TimeSlotActions.markSlotBooked({ timeSlotId, bookingId: booking.id }),
      ),
    ),
  );

  bookingCanceled$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.cancelBookingSuccess),
      map(({ timeSlotId }) => TimeSlotActions.markSlotFreed({ timeSlotId })),
    ),
  );
}
