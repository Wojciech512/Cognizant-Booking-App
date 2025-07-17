import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import {
  MatFormField,
  MatInput,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable } from 'rxjs';
import {
  selectAuthLoading,
  selectAuthFieldErrors,
  selectAuthNonFieldErrors,
} from '../../state/auth.selectors';
import { LoginPayload } from '../../models/auth.models';
import * as AuthActions from '../../state/auth.actions';

/**
 * Component for user login form.
 *
 * Context:
 * - Standalone Angular component displayed under `/login` route.
 * - Uses reactive forms to capture credentials and NgRx to dispatch login actions.
 * - Redirects to main app on success, and displays API errors on failure.
 */

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatInput,
    MatLabel,
    MatFormField,
    MatCard,
    NgIf,
    MatButton,
    MatButtonModule,
    MatCardModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class LoginComponent implements OnInit {
  objectKeys = Object.keys;
  loginForm!: FormGroup;
  loading$!: Observable<boolean>;
  fieldErrors$!: Observable<Record<string, string[]>>;
  nonFieldErrors$!: Observable<string[]>;

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(AuthActions.clearAuthErrors());

    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.loading$ = this.store.select(selectAuthLoading);
    this.fieldErrors$ = this.store.select(selectAuthFieldErrors);
    this.nonFieldErrors$ = this.store.select(selectAuthNonFieldErrors);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    const payload: LoginPayload = this.loginForm.value;
    this.store.dispatch(AuthActions.login(payload));
  }
}
