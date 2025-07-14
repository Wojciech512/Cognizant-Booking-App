import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { selectIsAuthenticated } from '../state/auth.selectors';

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectIsAuthenticated).pipe(
      take(1),
      map((isAuth) => {
        if (isAuth) {
          this.router.navigate(['/calendar']);
          return false;
        }
        return true;
      }),
    );
  }
}
