import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map, take } from 'rxjs';
import { selectIsStaff } from '../state/auth.selectors';

@Injectable({ providedIn: 'root' })
export class IsStaffGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router,
  ) {}

  canActivate(): Observable<boolean> {
    return this.store.select(selectIsStaff).pipe(
      take(1),
      map((IsStaff) => {
        if (!IsStaff) {
          this.router.navigate(['']);
          return false;
        }
        return true;
      }),
    );
  }
}
