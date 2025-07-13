import { createAction, props } from '@ngrx/store';

export const register = createAction(
  '[Auth] Register',
  props<{
    username: string;
    email: string;
    password: string;
    password2: string;
  }>(),
);
export const registerSuccess = createAction('[Auth] Register Success');
export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>(),
);

export const login = createAction(
  '[Auth] Login',
  props<{ email: string; password: string }>(),
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ token: string }>(),
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>(),
);

export const logout = createAction('[Auth] Logout');
