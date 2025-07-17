import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  ApiError,
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from '../models/auth.models';
import { environment } from '@env/environment';

/**
 * Service encapsulating REST calls for user authentication.
 *
 * Context:
 * - Uses Angular HttpClient to hit `/users/register/`, `/users/token/`, `/users/logout/`.
 * - Centralizes error handling: maps HttpErrorResponse into normalized ApiError.
 * - Reads `environment.apiUrl` for base URL and sets auth headers on logout.
 */

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
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
      .post<RegisterResponse>(`${this.apiUrl}/users/register/`, data)
      .pipe(catchError(this.handleApiError.bind(this)));
  }

  login(credentials: LoginPayload): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/users/token/`, credentials)
      .pipe(catchError(this.handleApiError.bind(this)));
  }

  logout(refreshToken: string): Observable<void> {
    const access = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${access}`);
    return this.http.post<void>(
      `${this.apiUrl}/users/logout/`,
      { refresh: refreshToken },
      { headers },
    );
  }
}
