import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../models/booking.model';
import { environment } from '@env/environment';

/**
 * REST client for booking operations.
 *
 * Context:
 * - Uses HttpClient to GET existing bookings and POST new ones.
 * - Centralizes error handling for booking API endpoints.
 */

@Injectable({ providedIn: 'root' })
export class BookingService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  bookTimeSlot(timeSlotId: string): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/bookings/`, {
      timeslot: timeSlotId,
    });
  }

  cancelBooking(bookingId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/bookings/${bookingId}/`);
  }
}
