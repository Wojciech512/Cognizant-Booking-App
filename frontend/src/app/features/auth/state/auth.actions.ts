import { createAction, props } from '@ngrx/store';
import { LoginPayload, RegisterPayload } from '../models/auth.models';

export const register = createAction(
  '[Auth] Register',
  props<RegisterPayload>(),
);
export const registerSuccess = createAction('[Auth] Register Success');
export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>(),
);

export const login = createAction('[Auth] Login', props<LoginPayload>());
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: string }>(),
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>(),
);

export const logout = createAction('[Auth] Logout');
