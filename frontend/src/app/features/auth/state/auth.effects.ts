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

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      exhaustMap(({ username, email, password, password2 }) =>
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
                ? 'Invalid email or password'
                : 'Login failed';
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
