import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
} from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient) {}

  register(data: RegisterPayload): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>('/api/register/', data);
  }

  login(credentials: LoginPayload): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/token/', credentials);
  }

  logout(): void {
    localStorage.removeItem('token');
  }
}
