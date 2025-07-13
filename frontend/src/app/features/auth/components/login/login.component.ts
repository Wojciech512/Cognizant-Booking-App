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
import { Observable } from 'rxjs';
import { selectAuthLoading, selectAuthError } from '../../state/auth.selectors';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiError } from '../../models/auth.models';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    MatLabel,
    MatFormField,
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
  loginForm!: FormGroup;
  loading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  nonFieldErrors: string[] | undefined;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.nonFieldErrors = [];
    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/']),
      error: (apiError: ApiError) => {
        Object.keys(this.loginForm.controls).forEach((field) => {
          this.loginForm.get(field)?.setErrors(null);
        });
        Object.entries(apiError.fieldErrors).forEach(([field, msgs]) => {
          const control = this.loginForm.get(field);
          if (control) {
            control.setErrors({ server: msgs[0] });
          }
        });
        this.nonFieldErrors = apiError.nonFieldErrors || [];
      },
    });
  }
}
