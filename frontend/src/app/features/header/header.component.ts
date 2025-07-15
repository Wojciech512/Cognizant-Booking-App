import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { logout } from '../auth/state/auth.actions';
import {
  selectIsAuthenticated,
  selectIsStaff,
  selectUsername,
} from '../auth/state/auth.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isAuthenticated$: Observable<boolean>;
  isStaff$: Observable<boolean>;
  username$: Observable<string | undefined>;

  constructor(private store: Store) {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.isStaff$ = this.store.select(selectIsStaff);
    this.username$ = this.store.select(selectUsername);
  }

  logout() {
    this.store.dispatch(logout());
  }
}
