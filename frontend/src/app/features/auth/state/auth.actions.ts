/**
 * NgRx action definitions for authentication flows.
 *
 * Context:
 * - Exposes actions for register, login, logout and error handling.
 * - Uses concise action creators with typed props for payload validation.
 */

import { createAction, props } from '@ngrx/store';
import { LoginPayload, RegisterPayload } from '../models/auth.models';

export const register = createAction(
  '[Auth] Register',
  props<RegisterPayload>(),
);
export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{
    fieldErrors: Record<string, string[]>;
    nonFieldErrors: string[];
  }>(),
);
export const registerSuccess = createAction('[Auth] Register Success');

export const login = createAction('[Auth] Login', props<LoginPayload>());
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{
    fieldErrors: Record<string, string[]>;
    nonFieldErrors: string[];
  }>(),
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: string }>(),
);

export const logout = createAction('[Auth] Logout');

export const clearAuthErrors = createAction('[Auth] Clear Errors');
