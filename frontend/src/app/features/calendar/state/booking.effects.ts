import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BookingService } from '../services/booking.service';
import * as BookingActions from './booking.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class BookingEffects {
  constructor(
    private actions$: Actions,
    private bookingService: BookingService,
  ) {}

  createBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.createBooking),
      mergeMap((action) =>
        this.bookingService.bookTimeSlot(action.timeSlotId).pipe(
          map((booking) =>
            BookingActions.createBookingSuccess({
              timeSlotId: action.timeSlotId,
              booking,
            }),
          ),
          catchError((error) =>
            of(BookingActions.createBookingFailure({ error })),
          ),
        ),
      ),
    ),
  );

  cancelBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingActions.cancelBooking),
      mergeMap((action) =>
        this.bookingService.cancelBooking(action.bookingId).pipe(
          map(() =>
            BookingActions.cancelBookingSuccess({
              timeSlotId: action.timeSlotId,
            }),
          ),
          catchError((error) =>
            of(BookingActions.cancelBookingFailure({ error })),
          ),
        ),
      ),
    ),
  );
}
