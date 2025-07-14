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
