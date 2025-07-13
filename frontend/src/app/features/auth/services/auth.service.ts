import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ApiError,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  private handleApiError(error: HttpErrorResponse) {
    const apiError: ApiError = { fieldErrors: {} };

    if (error.error && typeof error.error === 'object') {
      apiError.fieldErrors = { ...error.error };

      if (typeof error.error.detail === 'string') {
        apiError.nonFieldErrors = [error.error.detail];
      } else {
        apiError.nonFieldErrors =
          (error.error.non_field_errors as string[]) || [];
      }
    }

    return throwError(() => apiError);
  }

  register(data: RegisterPayload): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>('/api/register/', data)
      .pipe(catchError(this.handleApiError.bind(this)));
  }

  login(credentials: LoginPayload): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>('/api/token/', credentials)
      .pipe(catchError(this.handleApiError.bind(this)));
  }

  logout(refreshToken: string): Observable<void> {
    return this.http.post<void>('/api/logout/', { refresh: refreshToken });
  }
}
