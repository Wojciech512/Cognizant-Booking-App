import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
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
import { Observable, Subject, takeUntil } from 'rxjs';
import {
  selectAuthFieldErrors,
  selectAuthLoading,
  selectAuthNonFieldErrors,
} from '../../state/auth.selectors';
import { RegisterPayload } from '../../models/auth.models';
import * as AuthActions from '../../state/auth.actions';

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
export class RegisterComponent implements OnInit, OnDestroy {
  objectKeys = Object.keys;
  registerForm!: FormGroup;
  loading$!: Observable<boolean>;
  fieldErrors$!: Observable<Record<string, string[]>>;
  nonFieldErrors$!: Observable<string[]>;
  nonFieldErrors: string[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.store.dispatch(AuthActions.clearAuthErrors());

    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      password2: [
        '',
        [Validators.required, this.passwordMatchValidator.bind(this)],
      ],
    });

    this.loading$ = this.store.select(selectAuthLoading);
    this.fieldErrors$ = this.store.select(selectAuthFieldErrors);
    this.nonFieldErrors$ = this.store.select(selectAuthNonFieldErrors);

    this.fieldErrors$.pipe(takeUntil(this.destroy$)).subscribe((errors) => {
      Object.keys(this.registerForm.controls).forEach((field) => {
        this.registerForm.get(field)!.setErrors(null);
      });
      Object.entries(errors).forEach(([field, msgs]) => {
        const control = this.registerForm.get(field);
        if (control && msgs.length) {
          control.setErrors({ server: msgs[0] });
        }
      });
    });

    this.nonFieldErrors$.pipe(takeUntil(this.destroy$)).subscribe((errs) => {
      this.nonFieldErrors = errs;
    });

    this.registerForm
      .get('password')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.registerForm.get('password2')!.updateValueAndValidity();
      });
  }

  private passwordMatchValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    if (!this.registerForm) return null;
    const pass1 = this.registerForm.get('password')!.value;
    const pass2 = control.value;
    return pass1 === pass2 ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }
    const payload: RegisterPayload = this.registerForm.value;
    this.store.dispatch(AuthActions.register(payload));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
