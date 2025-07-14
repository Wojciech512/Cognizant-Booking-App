import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { exhaustMap, map, catchError, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ username, email, password, password2 }) =>
        this.authService
          .register({ username, email, password, password2 })
          .pipe(
            map(() => AuthActions.registerSuccess()),
            catchError((error) => {
              const payload = error || {};
              return of(
                AuthActions.registerFailure({
                  fieldErrors: payload.fieldErrors || {},
                  nonFieldErrors: payload.nonFieldErrors || [],
                }),
              );
            }),
          ),
      ),
    ),
  );

  registerRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.registerSuccess),
        tap(() => this.router.navigate(['/login'])),
      ),
    { dispatch: false },
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
            const payload = error || {};
            return of(
              AuthActions.loginFailure({
                fieldErrors: payload.fieldErrors || {},
                nonFieldErrors: payload.nonFieldErrors || [],
              }),
            );
          }),
        ),
      ),
    ),
  );

  loginRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate([''])),
      ),
    { dispatch: false },
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        exhaustMap(() => {
          const refresh = localStorage.getItem('refreshToken');
          if (!refresh) return of(null);

          return this.authService.logout(refresh).pipe(
            tap(() => this.cleanupAfterLogout()),
            catchError(() => {
              this.cleanupAfterLogout();
              return of(null);
            }),
          );
        }),
      ),
    { dispatch: false },
  );

  private cleanupAfterLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['/login']);
  }
}
