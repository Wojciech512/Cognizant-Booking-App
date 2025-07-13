import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { exhaustMap, map, catchError, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router,
  ) {}

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ email, password }) =>
        this.authService.register({ email, password }).pipe(
          map(() => AuthActions.registerSuccess()),
          tap(() => {
            this.router.navigate(['/login']);
          }),
          catchError((error) =>
            of(
              AuthActions.registerFailure({
                error: error.error?.message || 'Rejestracja nie powiodła się',
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
      exhaustMap(({ email, password }) =>
        this.authService.login({ email, password }).pipe(
          map((response) => {
            const token = response.access;
            localStorage.setItem('token', token);
            return AuthActions.loginSuccess({ token });
          }),
          tap(() => {
            this.router.navigate(['/']);
          }),
          catchError((error) => {
            const errMsg =
              error.status === 401
                ? 'Nieprawidłowy email lub hasło'
                : 'Logowanie nie powiodło się';
            return of(AuthActions.loginFailure({ error: errMsg }));
          }),
        ),
      ),
    ),
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false },
  );
}
