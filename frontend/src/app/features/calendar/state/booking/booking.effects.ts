import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as BookingActions from './booking.actions';
import { BookingService } from '../../services/booking.service';

/**
 * Side-effects for booking actions: handles HTTP requests and updates store.
 *
 * Context:
 * - Listens for load, create, and cancel actions to call BookingService.
 * - On success, dispatches corresponding success action; on error, dispatches failure.
 * - Ensures UI stays in sync with backend state for booking operations.
 */

@Injectable()
export class BookingEffects {
  private actions$ = inject(Actions);
  private bookingService = inject(BookingService);

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
