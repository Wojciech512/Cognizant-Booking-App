import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { exhaustMap, map, catchError, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from '../services/auth.service';
import { LoginPayload, RegisterPayload } from '../models/auth.models';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ username, email, password, password2 }: RegisterPayload) =>
        this.authService
          .register({ username, email, password, password2 })
          .pipe(
            map(() => AuthActions.registerSuccess()),
            tap(() => {
              this.router.navigate(['/login']);
            }),
            catchError((error) =>
              of(
                AuthActions.registerFailure({
                  error: error.error?.message || 'Registration failed',
                }),
              ),
            ),
          ),
      ),
    ),
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap(({ username, password }) =>
        this.authService.login({ username, password }).pipe(
          map((response) => {
            localStorage.setItem('token', response.access);
            localStorage.setItem('refreshToken', response.refresh!);
            return AuthActions.loginSuccess({ token: response.access });
          }),
          catchError((error) => {
            const nonField =
              error.status === 401
                ? ['Invalid email or password']
                : ['Login failed'];
            return of(
              AuthActions.loginFailure({
                fieldErrors: {},
                nonFieldErrors: nonField,
              }),
            );
          }),
        ),
      ),
    ),
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        exhaustMap(() => {
          const refresh = localStorage.getItem('refreshToken');
          if (!refresh) {
            return of(null);
          }
          return this.authService.logout(refresh).pipe(
            tap(() => {
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              this.router.navigate(['/login']);
            }),
            catchError(() => {
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              this.router.navigate(['/login']);
              return of(null);
            }),
          );
        }),
      ),
    { dispatch: false },
  );
}
