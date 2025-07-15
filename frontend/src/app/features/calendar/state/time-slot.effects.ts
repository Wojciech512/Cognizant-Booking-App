import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TimeSlotService } from '../services/time-slot.service';
import * as TimeSlotActions from './time-slot.actions';
import * as BookingActions from './booking.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class TimeSlotEffects {
  constructor(
    private actions$: Actions,
    private timeSlotService: TimeSlotService,
  ) {}

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
