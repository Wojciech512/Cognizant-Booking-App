import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimeSlot } from '../models/time-slot.model';
import { TimeSlotFilter } from '../state/time-slot/time-slot.actions';
import { environment } from '@env/environment';

/**
 * REST client for time slot operations.
 *
 * Context:
 * - Uses HttpClient to GET available slots for a date and POST new ones.
 * - Coordinates with NgRx effects to keep store in sync.
 */

@Injectable({ providedIn: 'root' })
export class TimeSlotService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getTimeSlots(filter?: TimeSlotFilter): Observable<TimeSlot[]> {
    let params = new HttpParams();
    if (filter) {
      if (filter.categoryIds && filter.categoryIds.length) {
        filter.categoryIds.forEach((catId: number) => {
          params = params.append('category', String(catId));
        });
      }
      if (filter.startDate) {
        params = params.set('start_date', filter.startDate);
      }
      if (filter.endDate) {
        params = params.set('end_date', filter.endDate);
      }
    }
    return this.http.get<TimeSlot[]>(
      `${this.apiUrl}/event_scheduler/timeslots/`,
      { params },
    );
  }

  createTimeSlot(slotData: {
    start_dt: string;
    end_dt: string;
    category: number;
  }): Observable<TimeSlot> {
    return this.http.post<TimeSlot>(
      `${this.apiUrl}/event_scheduler/timeslots/`,
      slotData,
    );
  }

  deleteTimeSlot(slotId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/event_scheduler/timeslots/${slotId}/`,
    );
  }
}
