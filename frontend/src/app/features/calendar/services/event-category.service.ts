import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventCategory } from '../models/event-category.model';
import { environment } from '@env/environment';

@Injectable({ providedIn: 'root' })
export class EventCategoryService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getAllCategories(): Observable<EventCategory[]> {
    return this.http.get<EventCategory[]>(
      `${this.apiUrl}/event_scheduler/categories/`,
    );
  }

  createCategory(name: string): Observable<EventCategory> {
    return this.http.post<EventCategory>(
      `${this.apiUrl}/event_scheduler/categories/`,
      { name },
    );
  }
}
