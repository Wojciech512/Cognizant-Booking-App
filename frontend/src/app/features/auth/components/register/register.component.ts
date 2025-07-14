import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatCard, MatCardModule } from '@angular/material/card';
import { AsyncPipe, CommonModule, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatFormField,
  MatInput,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { selectAuthLoading } from '../../state/auth.selectors';
import { AuthService } from '../../services/auth.service';
import { ApiError } from '../../models/auth.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: 'register.component.html',
  styleUrls: ['register.component.scss'],
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
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
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
    // this.error$ = this.store.select(selectAuthError);

    this.registerForm = this.fb.group(
      {
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        password2: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password: string = form.get('password')?.value;
    const confirm: string = form.get('password2')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (apiError: ApiError) => {
        Object.keys(this.registerForm.controls).forEach((field) => {
          this.registerForm.get(field)?.setErrors(null);
        });
        Object.entries(apiError.fieldErrors).forEach(([field, messages]) => {
          const control = this.registerForm.get(field);
          if (control) {
            control.setErrors({ server: messages[0] });
          }
        });
        this.nonFieldErrors = apiError.nonFieldErrors || [];
      },
    });
  }
}
